// /resuena/boletin/confirmado: where Kit sends people after they confirm
// (set in the "Boletín de Resuena" form in Kit).

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
        'Tu suscripción al boletín de Resuena está confirmada. El próximo te llegará directamente al correo.',
      ]}
      volverA="/resuena"
      volverTexto="Volver a Resuena"
    />
  )
}
