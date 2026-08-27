import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentBlockView } from "@/features/lesson/components/content-block";
import { buildContentIndex } from "@/lib/content/loader";

/**
 * Regression guard: a lesson must never show raw LaTeX or raw markdown.
 * Every block type that can carry `$...$` has to route through MathText.
 */
describe("content blocks render maths rather than leaking LaTeX", () => {
  it("renders maths in a hook block", () => {
    const { container } = render(
      <ContentBlockView block={{ type: "hook", text: "A physicist would write $30\\,\\text{m}$ instead." }} />,
    );
    expect(container.textContent).not.toContain("$30");
    expect(container.querySelector(".katex")).not.toBeNull();
  });

  it("renders maths in worked example step text", () => {
    const { container } = render(
      <ContentBlockView
        block={{
          type: "worked_example",
          title: "Example",
          prompt: "Solve $2x = 8$",
          steps: [{ text: "Divide both sides by $2$" }, { text: "Read off the value of $x$" }],
          answer: "$x = 4$",
        }}
      />,
    );
    expect(container.textContent).not.toMatch(/\$\d/);
    expect(container.querySelectorAll(".katex").length).toBeGreaterThan(2);
  });

  it("renders maths in a callout title and body", () => {
    const { container } = render(
      <ContentBlockView
        block={{ type: "callout", variant: "definition", title: "Value of $g$", text: "Take $g = 10$ m/s²." }} />,
    );
    expect(container.textContent).not.toContain("$g$");
  });

  it("formats markdown emphasis rather than showing the asterisks", () => {
    const { container } = render(
      <ContentBlockView block={{ type: "text", markdown: "A **linear equation** has one unknown." }} />,
    );
    expect(container.textContent).not.toContain("**");
    expect(container.querySelector("strong")?.textContent).toBe("linear equation");
  });

  it("renders markdown headings as real heading elements", () => {
    render(<ContentBlockView block={{ type: "text", markdown: "### Collecting like terms" }} />);
    expect(screen.getByRole("heading", { name: "Collecting like terms" })).toBeInTheDocument();
  });
});

describe("every seeded lesson is free of raw notation leaks", () => {
  const index = buildContentIndex();

  it("has lessons to check", () => {
    expect(index.lessonBySubtopicId.size).toBeGreaterThan(0);
  });

  it("never leaves an unpaired dollar sign in block text", () => {
    const offenders: string[] = [];

    for (const lesson of index.lessonBySubtopicId.values()) {
      for (const block of lesson.blocks) {
        const strings: string[] = [];
        if (block.type === "hook") strings.push(block.text);
        if (block.type === "text") strings.push(block.markdown);
        if (block.type === "callout") strings.push(block.title, block.text);
        if (block.type === "summary") strings.push(...block.points);
        if (block.type === "worked_example") {
          strings.push(block.title, block.prompt, block.answer, ...block.steps.map((s) => s.text));
        }

        for (const value of strings) {
          const dollars = (value.match(/\$/g) ?? []).length;
          if (dollars % 2 !== 0) offenders.push(`${lesson.id}: ${value.slice(0, 60)}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
