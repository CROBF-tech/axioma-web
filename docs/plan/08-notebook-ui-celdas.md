# Paso 08 — Notebook UI: celdas

## Objetivo

Construir la interfaz tipo Jupyter/Mathematica: celdas reordenables, encadenables, con input matemático (mathlive), render KaTeX y referencia a resultados previos.

## Skills usadas

- `shadcn`, `tailwind-v4-shadcn`, `frontend-design` (instaladas).
- Docs Context7 para `zustand`, `mathlive`, `katex`.

## Estado (zustand)

`apps/web/src/store/notebook.ts`:
```ts
type Cell = {
  id: string;
  kind: 'math' | 'text' | 'plot';
  input: string;       // LaTeX o markdown
  output?: EngineResult | string | PlotSpec;
  refs: string[];      // ids de celdas referenciadas
  running: boolean;
  error?: string;
};

type NotebookState = {
  id: string;
  title: string;
  cells: Cell[];
  // acciones
  addCell, removeCell, reorder, updateInput, runCell, runAll, setOutput
};
```

Persistencia: solo al servidor (paso 10 hace caché dexie). En este paso, `POST /notebooks/:id/cells` y `PATCH`/`DELETE`.

## Componentes

```
apps/web/src/features/notebook/
├── NotebookView.tsx
├── CellList.tsx              # drag & drop (dnd-kit)
├── Cell.tsx
├── cells/
│   ├── MathCell.tsx          # mathlive + resultado
│   ├── TextCell.tsx          # markdown editable
│   └── PlotCell.tsx          # (paso 09)
├── MathInput.tsx             # wrapper mathlive
├── Result.tsx                # KaTeX render + steps colapsable
└── Refs.tsx                  # autocompletar celdas anteriores
```

## mathlive
```ts
import 'mathlive';
<math-field onInput={...}>{cell.input}</math-field>
```
El `<math-field>` emite LaTeX en `input` event. Se guarda en el store.

## Referencias entre celdas
- Sintaxis: `$$cellId` o `%1` (atajo por orden). Decidir: **`$$cellId`** (robusto al reordenar).
- Al ejecutar una celda, resolver refs → sustituir por `output.mathJson` de la celda referenciada.
- Autocompletar con lista de celdas anteriores del notebook.

## Ejecución
- `runCell(id)` → llama a `compute()` del paquete compartido (paso 07), en el cliente (no necesita backend para cálculo). Persistir resultado al backend (paso 10).
- Mostrar `Result` con: resultado principal (KaTeX), toggle "Ver pasos", errores parciales con contexto.

## Entregables

- Vista `/notebooks/:id` con celdas funcionales.
- Crear/eliminar/mover celdas.
- Input mathlive → ejecutar → resultado KaTeX + pasos.
- Referencias `$$cellId` resueltas.

## Criterios de aceptación

- [ ] Drag & drop reordena celdas y se persiste.
- [ ] Ejecutar celda `d/dx x^2` muestra `2x` con pasos.
- [ ] Referenciar resultado de celda anterior funciona.
- [ ] Error parcial se muestra con contexto, no en rojo genérico.
- [ ] Edición inline de mathlive sin perder foco.