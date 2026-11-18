import { redirect } from 'next/navigation'

/**
 * La página de familias ahora vive dentro de la de audios, plegada debajo de
 * las clases. Esta ruta queda para los QR y los mensajes de WhatsApp que ya
 * apuntan aquí.
 *
 * `redirect` (307) y no `permanentRedirect`: un 308 se queda guardado en el
 * navegador del padre y no se puede deshacer si algún día vuelve esta página.
 */
export default function Pagina() {
  redirect('/alemanydu/audios')
}
