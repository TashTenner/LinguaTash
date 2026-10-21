import { Metadata } from 'next'
import ElternLogin from '@/components/nordkreis/audios/ElternLogin'

export const metadata: Metadata = {
  title: 'Audios · Nordkreis',
  robots: { index: false, follow: false, nocache: true },
}

export default function Anmelden() {
  return <ElternLogin />
}
