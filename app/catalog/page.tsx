import { Suspense } from "react"
import CatalogContent from "./CatalogContent"

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-4">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold mb-0">Catalog</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  )
}
