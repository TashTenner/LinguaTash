// /boletin/confirmado: where Kit sends people after they confirm the general
// LinguaTash boletín (set in the "Boletín de LinguaTash" form in Kit).

import { genPageMetadata } from 'app/seo'
import BoletinConfirmado from '@/components/BoletinConfirmado'

export const metadata = genPageMetadata({
  title: 'Suscripción confirmada',
  robots: { index: false, follow: false },
})

export default function Pagina() {
  return (
    <BoletinConfirmado
      titulo="¡Listo, ya estás dentro!"
      texto={[
        'Tu suscripción a los boletines que elegiste está confirmada. El próximo te llegará directamente al correo.',
      ]}
      volverA="/"
      volverTexto="Volver a LinguaTash"
    />
  )
}
