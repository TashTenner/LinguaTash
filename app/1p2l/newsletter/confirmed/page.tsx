// /1p2l/newsletter/confirmed: where Kit sends people after they confirm (set in
// the 1P2L form in Kit).

import { genPageMetadata } from 'app/seo'
import BoletinConfirmado from '@/components/BoletinConfirmado'

export const metadata = genPageMetadata({
  title: 'Subscription confirmed',
  robots: { index: false, follow: false },
})

export default function Pagina() {
  return (
    <BoletinConfirmado
      titulo="You're in!"
      texto={[
        'Your subscription to the 1P2L newsletter is confirmed. The next one will arrive straight in your inbox.',
        'Tu suscripción al boletín de 1P2L está confirmada.',
      ]}
      volverA="/1p2l"
      volverTexto="Back to 1P2L · Volver a 1P2L"
    />
  )
}
