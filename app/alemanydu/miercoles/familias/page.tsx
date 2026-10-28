import { Metadata } from 'next'
import PaginaFamilias from '@/components/alemanydu/PaginaFamilias'
import { grupoMiercoles } from '@/data/alemanydu-grupos'

export const metadata: Metadata = {
  title: 'Para las familias · Alemán·y·Du',
  robots: { index: false, follow: false, nocache: true },
}

/**
 * Dinámica a propósito, como la de audios. El aviso del grupo aparece y
 * desaparece según la fecha de hoy, y los despliegues no son diarios: generada
 * en el build, una nota que dice «hoy» seguiría puesta el jueves.
 */
export const dynamic = 'force-dynamic'

export default function Pagina() {
  return <PaginaFamilias grupo={grupoMiercoles} />
}
