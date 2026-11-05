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
export default function FlyerAmpliable({ src, alt }: { src: string; alt: string }) {
  const dialogo = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        type="button"
        onClick={() => dialogo.current?.showModal()}
        className="block overflow-hidden rounded-md border border-[#9A8F85]/30 transition-transform duration-300 hover:scale-105"
        aria-label={`Ver más grande: ${alt}`}
      >
        <Image src={src} alt={alt} width={1080} height={1350} className="h-auto w-14" />
      </button>

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Esc ya cierra un <dialog> */}
      <dialog
        ref={dialogo}
        onClick={() => dialogo.current?.close()}
        className="m-auto max-h-[90vh] max-w-[90vw] cursor-zoom-out bg-transparent p-0 backdrop:bg-black/70"
      >
        <Image
          src={src}
          alt={alt}
          width={1080}
          height={1350}
          className="h-auto max-h-[90vh] w-auto rounded-xl"
        />
      </dialog>
    </>
  )
}
