import { customAlphabet } from "nanoid";
import {
  PUBLIC_NOTEBOOK_ROUTE_TEMPLATE,
  PUBLIC_SLUG_ALPHABET,
  PUBLIC_SLUG_MIN_LENGTH,
} from "./constants.ts";

const slugGenerator = customAlphabet(PUBLIC_SLUG_ALPHABET, PUBLIC_SLUG_MIN_LENGTH);

export function generatePublicSlug(): string {
  return slugGenerator();
}

export function buildPublicNotebookPath(slug: string): string {
  return PUBLIC_NOTEBOOK_ROUTE_TEMPLATE.replace(":slug", slug);
}

export function buildPublicNotebookUrl(slug: string, origin: string): string {
  const normalizedOrigin = origin.endsWith("/") ? origin.slice(0, -1) : origin;
  return `${normalizedOrigin}${buildPublicNotebookPath(slug)}`;
}