import { Skeleton } from "../../components/ui/index.ts"
import "./LibrarySkeleton.css"

export default function LibrarySkeleton() {
  return (
    <div className="library-skeleton" aria-busy="true" aria-label="Cargando biblioteca">
      <aside className="library-skeleton__sidebar">
        <Skeleton variant="text" width="80%" height="1.5rem" />
        <Skeleton variant="rect" width="100%" height="2rem" />
        <Skeleton variant="rect" width="90%" height="2rem" />
        <Skeleton variant="rect" width="85%" height="2rem" />
      </aside>
      <main className="library-skeleton__main">
        <Skeleton variant="text" width="40%" height="1.75rem" />
        <div className="library-skeleton__grid">
          <Skeleton variant="rect" width="100%" height="6rem" />
          <Skeleton variant="rect" width="100%" height="6rem" />
          <Skeleton variant="rect" width="100%" height="6rem" />
        </div>
      </main>
    </div>
  )
}
