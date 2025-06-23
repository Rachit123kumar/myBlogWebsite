export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/[\s_-]+/g, "-") // replace spaces/underscores with -
    .replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens
}
