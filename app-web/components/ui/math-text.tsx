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
          <span key={i} dangerouslySetInnerHTML={{ __html: renderLatex(part.value, false) }} />
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

function splitMath(text: string): Array<{ type: "text" | "math"; value: string }> {
  const parts: Array<{ type: "text" | "math"; value: string }> = [];
  const pattern = /\$([^$]+)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: "math", value: match[1] });
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
