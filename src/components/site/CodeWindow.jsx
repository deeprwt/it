import { cn } from "@/lib/utils";

const TOKEN_RE =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b(?:export|default|async|await|function|const|let|return|import|from|if|else|new|true|false|null|params)\b)|(\b\d+(?:\.\d+)?[a-z]*\b)|(<\/?[A-Za-z][\w.]*|\/?>)|(\b[A-Za-z_$][\w$]*(?=\())|([{}()[\];,.:=+*\-!?|&]+)/gm;

const CLASSES = [
  "italic text-muted-foreground/70", // comment
  "text-success", // string
  "text-brand-2", // keyword
  "text-warning", // number
  "text-brand", // jsx tag
  "text-sky-300", // function call
  "text-muted-foreground", // punctuation
];

/** Tiny dependency-free highlighter — good enough for marketing snippets. */
function highlight(line) {
  const parts = [];
  let last = 0;
  let match;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(line))) {
    if (match.index > last) parts.push({ text: line.slice(last, match.index) });
    const group = match.slice(1).findIndex((g) => g !== undefined);
    parts.push({ text: match[0], className: CLASSES[group] });
    last = match.index + match[0].length;
    if (match[0].length === 0) TOKEN_RE.lastIndex++;
  }
  if (last < line.length) parts.push({ text: line.slice(last) });
  return parts;
}

export function CodeWindow({ code, filename = "index.ts", className, highlightLine }) {
  const lines = code.split("\n");
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-card/90 shadow-elegant backdrop-blur-xl",
        className
      )}
    >
      <figcaption className="flex items-center gap-2 border-b border-white/10 bg-background/40 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 rounded-md border border-white/10 bg-card px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
          {filename}
        </span>
      </figcaption>
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-6 sm:text-[13px]">
        <code>
          {lines.map((line, i) => (
            <span
              key={i}
              className={cn("block -mx-5 px-5", highlightLine === i + 1 && "bg-brand/10 shadow-[inset_2px_0_0_hsl(var(--brand))]")}
            >
              <span className="mr-5 inline-block w-5 select-none text-right text-muted-foreground/40">{i + 1}</span>
              {highlight(line).map((part, j) =>
                part.className ? (
                  <span key={j} className={part.className}>
                    {part.text}
                  </span>
                ) : (
                  <span key={j}>{part.text}</span>
                )
              )}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
