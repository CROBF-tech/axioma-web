// Tipos públicos de dominio. En el navegador se usan para las respuestas
// JSON; en el backend se pueden usar para tipar DTOs mientras el source-of-truth
// sigue siendo Drizzle.

export type Notebook = {
  id: string;
  ownerId: string;
  title: string;
  folderId?: string | null;
  accent?: string | null;
  isPublic: boolean;
  publicSlug?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type NewNotebook = Omit<Notebook, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<Notebook, "id" | "createdAt" | "updatedAt">>;

export type Cell = {
  id: string;
  notebookId: string;
  orderIdx: number;
  kind: "math" | "text" | "plot";
  input: string;
  output?: string | null;
  references?: string[] | null;
  createdAt: Date;
  updatedAt: Date;
};

export type NewCell = Omit<Cell, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<Cell, "id" | "createdAt" | "updatedAt">>;

export type CellKind = Cell["kind"];
