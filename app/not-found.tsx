import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Error 404
      </p>
      <h1 className="font-display text-3xl font-bold">Página no encontrada</h1>
      <p className="max-w-md text-muted-foreground">
        La página que buscas no existe o fue movida.
      </p>
      <div className="mt-2 flex gap-3">
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/tienda">Ir a la tienda</Link>
        </Button>
      </div>
    </div>
  );
}
