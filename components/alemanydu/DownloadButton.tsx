import { downloadUrl } from '@/data/alemanydu-audios'

type DownloadButtonProps = {
  /** Basename of the object on the bucket. */
  archivo: string
  /** Full spoken label for screen readers, naming what is being saved. */
  ariaLabel: string
}

/**
 * Downloads go through our own route handler, never straight to the bucket:
 * `<a download>` is ignored cross origin, so a direct link would stream or
 * navigate instead of saving.
 */
export default function DownloadButton({ archivo, ariaLabel }: DownloadButtonProps) {
  return (
    <a
      href={downloadUrl(archivo)}
      aria-label={ariaLabel}
      data-umami-event="audio-descarga"
      data-umami-event-archivo={archivo}
      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#B3475A] px-5 py-2.5 text-sm font-medium text-[#B3475A] transition-colors hover:bg-[#B3475A] hover:text-[#F4EFE8]"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1Zm-7 14a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
      </svg>
      Descargar
    </a>
  )
}
