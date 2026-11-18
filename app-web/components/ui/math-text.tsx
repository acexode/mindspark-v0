import katex from "katex";

/**
 * Renders text containing inline `$…$` maths and simple markdown emphasis.
 * Every subject can use this safely — text without `$` passes straight through.
 */
export function MathText({ text }: { text: string }) {
  const parts = splitMath(text);
  return (
    <>
      {parts.map((part, i) =>
        part.type === "math" ? (
          <span
            key={i}
            className={part.display ? "math-block" : undefined}
            dangerouslySetInnerHTML={{ __html: renderLatex(part.value, part.display) }}
          />
        ) : (
          <span key={i} dangerouslySetInnerHTML={{ __html: renderEmphasis(part.value) }} />
        ),
      )}
    </>
  );
}

export function MathBlock({ latex }: { latex: string }) {
  return <div className="math-block" dangerouslySetInnerHTML={{ __html: renderLatex(latex, true) }} />;
}

function renderLatex(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, { displayMode, throwOnError: false, output: "html" });
  } catch {
    return escapeHtml(latex);
  }
}

type Part = { type: "text"; value: string } | { type: "math"; value: string; display: boolean };

/**
 * Finds `$$…$$`, `\[…\]` (display) and `\(…\)`, `$…$` (inline). Models often write the backslash
 * forms, so all four are accepted. An unclosed delimiter (a reply still streaming) stays plain text.
 */
const MATH_PATTERN = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$([^$]+)\$/g;

function splitMath(text: string): Part[] {
  const parts: Part[] = [];
  const pattern = new RegExp(MATH_PATTERN.source, "g");
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const display = match[1] !== undefined || match[2] !== undefined;
    parts.push({ type: "math", value: (match[1] ?? match[2] ?? match[3] ?? match[4]).trim(), display });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) parts.push({ type: "text", value: text.slice(lastIndex) });
  return parts;
}

function renderEmphasis(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br />");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
