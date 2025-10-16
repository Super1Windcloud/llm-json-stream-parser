 
export function tryParseJsonStreamAutoComplete(
  content: string,
  onJson: (obj: Record<string, any>, consumed: number) => void
) {
  let attempt = content.trim();

  attempt = attempt.replace(/[,\\]+$/, "");

  const quoteCount = (attempt.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    attempt += '"';
  }

  const openCurly = (attempt.match(/{/g) || []).length;
  const closeCurly = (attempt.match(/}/g) || []).length;
  const openSquare = (attempt.match(/\[/g) || []).length;
  const closeSquare = (attempt.match(/]/g) || []).length;

  const missingCurly = Math.max(0, openCurly - closeCurly);
  const missingSquare = Math.max(0, openSquare - closeSquare);

  attempt += "]".repeat(missingSquare);
  attempt += "}".repeat(missingCurly);

  try {
    const obj = JSON.parse(attempt);
    onJson(obj, attempt.length);
  } catch {
  }
}
