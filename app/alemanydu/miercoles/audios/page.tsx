import { Metadata } from 'next'
import PaginaAudios from '@/components/alemanydu/PaginaAudios'
import { grupoMiercoles } from '@/data/alemanydu-grupos'

export const metadata: Metadata = {
  title: 'Audios · Alemán·y·Du',
  robots: { index: false, follow: false, nocache: true },
}

/**
 * Dinámica a propósito. Qué clases se ven depende de la fecha de hoy, y el
 * despliegue solo ocurre los lunes al publicar el audio. Generada en el build,
 * una clase del miércoles no aparecería hasta cinco días después.
 */
export const dynamic = 'force-dynamic'

export default function Pagina() {
  return <PaginaAudios grupo={grupoMiercoles} />
}
