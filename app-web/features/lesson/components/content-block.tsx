import type { ContentBlock } from "@/lib/content/schema";
import { MathText, MathBlock } from "@/components/ui/math-text";

/**
 * Subject-agnostic block renderer. Every subject uses these primitives, so no
 * subject depends on a bespoke component to have a complete lesson.
 */
export function ContentBlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "hook":
      return (
        <section className="block-hook">
          <p>{block.text}</p>
        </section>
      );

    case "text":
      return <MarkdownBlock markdown={block.markdown} />;

    case "math":
      return (
        <figure className="block-math">
          <MathBlock latex={block.latex} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    case "image":
      return (
        <figure className="block-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt} loading="lazy" />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    case "video":
      return (
        <figure className="block-video">
          <video src={block.src} controls title={block.title} />
          {block.transcript && (
            <details>
              <summary>Transcript</summary>
              <p>{block.transcript}</p>
            </details>
          )}
        </figure>
      );

    case "table":
      return (
        <figure className="block-table">
          <table>
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header} scope="col">
                    <MathText text={header} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>
                      <MathText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    case "list":
      return block.style === "number" ? (
        <ol className="block-list">
          {block.items.map((item, i) => (
            <li key={i}>
              <MathText text={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="block-list">
          {block.items.map((item, i) => (
            <li key={i}>
              <MathText text={item} />
            </li>
          ))}
        </ul>
      );

    case "callout":
      return (
        <aside className={`block-callout is-${block.variant}`}>
          <h3>{block.title}</h3>
          <p>
            <MathText text={block.text} />
          </p>
        </aside>
      );

    case "worked_example":
      return (
        <section className="block-worked-example">
          <h3>{block.title}</h3>
          <p className="worked-prompt">
            <MathText text={block.prompt} />
          </p>
          <ol>
            {block.steps.map((step, i) => (
              <li key={i}>
                <span>{step.text}</span>
                {step.latex && <MathBlock latex={step.latex} />}
              </li>
            ))}
          </ol>
          <p className="worked-answer">
            Answer: <MathText text={block.answer} />
          </p>
        </section>
      );

    case "summary":
      return (
        <section className="block-summary">
          <h3>Key points</h3>
          <ul>
            {block.points.map((point, i) => (
              <li key={i}>
                <MathText text={point} />
              </li>
            ))}
          </ul>
        </section>
      );

    case "interactive":
      return (
        <section className="block-interactive">
          <p>{block.fallbackText}</p>
        </section>
      );

    case "check":
      return null; // Rendered by the lesson player, which owns answer submission.

    default:
      return null;
  }
}

/** Minimal markdown: headings, bold, italic, inline maths and paragraphs. */
function MarkdownBlock({ markdown }: { markdown: string }) {
  const chunks = markdown.split(/\n{2,}/);
  return (
    <div className="block-text">
      {chunks.map((chunk, i) => {
        const heading = chunk.match(/^(#{2,4})\s+(.*)$/);
        if (heading) {
          const level = heading[1].length;
          const Tag = (level === 2 ? "h2" : level === 3 ? "h3" : "h4") as "h2" | "h3" | "h4";
          return (
            <Tag key={i}>
              <MathText text={heading[2]} />
            </Tag>
          );
        }
        return (
          <p key={i}>
            <MathText text={chunk} />
          </p>
        );
      })}
    </div>
  );
}
