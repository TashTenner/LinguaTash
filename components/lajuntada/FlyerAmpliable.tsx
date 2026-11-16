'use client'

import { useRef } from 'react'
import Image from 'next/image'

/**
 * La miniatura del flyer en la tabla de fechas, que se abre grande al tocarla.
 *
 * Usa el <dialog> del navegador: Esc, el foco y el fondo oscuro vienen solos.
 * Un toque en cualquier parte lo cierra, porque en el móvil no hay una X fácil
 * de acertar encima de una imagen que ocupa toda la pantalla.
 */
export default function FlyerAmpliable({
  src,
  alt,
  pasada,
}: {
  src: string
  alt: string
  pasada: boolean
}) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const texto = pasada ? `${alt} Pasada.` : alt

  return (
    <>
      <button
        type="button"
        onClick={() => dialogo.current?.showModal()}
        className="block overflow-hidden rounded-md border border-[#9A8F85]/30 transition-transform duration-300 hover:scale-105"
        aria-label={`Ver más grande: ${texto}`}
      >
        <Flyer src={src} alt={texto} pasada={pasada} ancho="w-14" />
      </button>

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Esc ya cierra un <dialog> */}
      <dialog
        ref={dialogo}
        onClick={() => dialogo.current?.close()}
        className="m-auto max-h-[90vh] max-w-[90vw] cursor-zoom-out overflow-hidden rounded-xl bg-transparent p-0 backdrop:bg-black/70"
      >
        <Flyer
          src={src}
          alt={texto}
          pasada={pasada}
          // 72vh es el ancho de un 4:5 de 90vh de alto.
          ancho="w-[min(90vw,72vh)]"
        />
      </dialog>
    </>
  )
}

/**
 * El flyer, y si la fecha ya pasó, desvaído y con la banda "Pasada" encima,
 * como el que se hizo a mano para el 15 de noviembre. La banda va abajo, donde
 * los flyers tienen el pie para reservar, y lo tapa: un flyer pasado no invita
 * a nada. Mide en `cqw` para que se lea igual en la miniatura y ampliado, y
 * por eso el ancho lo pone la caja: un contenedor de consultas no puede tomar
 * el ancho de lo que tiene adentro.
 */
function Flyer({
  src,
  alt,
  pasada,
  ancho,
}: {
  src: string
  alt: string
  pasada: boolean
  ancho: string
}) {
  return (
    <div className={`relative ${ancho}`} style={{ containerType: 'inline-size' }}>
      <Image
        src={src}
        alt={alt}
        width={1080}
        height={1350}
        className={`h-auto w-full ${pasada ? 'opacity-45 grayscale-[40%]' : ''}`}
      />
      {pasada && (
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 flex h-[18%] flex-col items-center justify-center bg-[#081C3C] text-[#F4EFE8]"
        >
          <span className="text-[8cqw] leading-none font-bold tracking-[0.12em]">PASADA</span>
          <span className="mt-[1.5cqw] text-[3cqw] leading-none">
            Gracias a las familias que vinieron
          </span>
        </div>
      )}
    </div>
  )
}
