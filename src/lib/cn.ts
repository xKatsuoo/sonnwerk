type ClassValue = string | number | null | undefined | false | Record<string, boolean> | ClassValue[];

function flatten(value: ClassValue, out: string[]): void {
  if (!value) return;
  if (typeof value === "string" || typeof value === "number") {
    out.push(String(value));
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v) => flatten(v, out));
    return;
  }
  for (const key in value) {
    if (value[key]) out.push(key);
  }
}

/** Merges conditional class names into a single string, skipping falsy values. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  values.forEach((v) => flatten(v, out));
  return out.join(" ");
}
