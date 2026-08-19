# Task 08-T02 — Store zustand del notebook

- **Paso:** 08 — Notebook UI celdas
- **Tiempo estimado:** 2 horas
- **Depende de:** 08-T01

## Contexto

Plan paso 08 líneas 13-36.

## Alcance

- `apps/web/src/store/notebook.ts`:
  ```ts
  type NotebookStore = {
    notebook: Notebook | null;
    setNotebook(n: Notebook): void;
    addCell(kind: CellKind): void;
    updateCell(id: ID, patch: Partial<Cell>): void;
    removeCell(id: ID): void;
    reorder(ids: ID[]): void;
    runCell(id: ID): Promise<void>;
    setRunning(id: ID, r: boolean): void;
    setOutput(id: ID, out: EngineResult | string | PlotSpec | null): void;
    save(): Promise<void>;  // debounced
  };
  ```
- Selector helpers.
- Save debounced 800ms.

## Entregable

- Store + tests.

## Criterios de aceptación

- [ ] `addCell('math')` añade celda con id único.
- [ ] `runCell` setea `running=true`, ejecuta `compute()`, persiste, setea `output`.
- [ ] `save()` se llama 1 vez por ráfaga de edits.
- [ ] `reorder` actualiza `orderIdx` y dispara save.