import { Metadata } from 'next'
import PaginaFamilias from '@/components/alemanydu/PaginaFamilias'
import { grupoMiercoles } from '@/data/alemanydu-grupos'

export const metadata: Metadata = {
  title: 'Para las familias · Alemán·y·Du',
  robots: { index: false, follow: false, nocache: true },
}

export default function Pagina() {
  return <PaginaFamilias grupo={grupoMiercoles} />
}
