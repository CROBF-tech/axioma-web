import { Skeleton } from "../../components/ui/index.ts"
import "./NotebookSkeleton.css"

export default function NotebookSkeleton() {
  return (
    <div className="notebook-skeleton" aria-busy="true" aria-label="Cargando notebook">
      <div className="notebook-skeleton__header">
        <Skeleton variant="text" width="60%" height="2rem" />
        <div className="notebook-skeleton__actions">
          <Skeleton variant="rect" width="6rem" height="2rem" />
          <Skeleton variant="rect" width="6rem" height="2rem" />
          <Skeleton variant="rect" width="6rem" height="2rem" />
        </div>
      </div>
      <div className="notebook-skeleton__cells">
        <Skeleton variant="rect" width="100%" height="8rem" />
        <Skeleton variant="rect" width="100%" height="8rem" />
        <Skeleton variant="rect" width="100%" height="8rem" />
      </div>
    </div>
  )
}
