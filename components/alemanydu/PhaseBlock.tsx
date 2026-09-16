type PhaseBlockProps = {
  /** Name of the phase in Spanish. This is the one parents read. */
  titulo: string
  /** The German name, kept quiet underneath. */
  tituloAleman: string
  /** Months the phase covers, in Spanish. */
  periodo: string
  /** One line describing the phase. */
  descripcion: string
}

export default function PhaseBlock({
  titulo,
  tituloAleman,
  periodo,
  descripcion,
}: PhaseBlockProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold">
        {titulo}{' '}
        <span className="font-normal text-[#9A8F85] dark:text-[#F4EFE8]/60">{tituloAleman}</span>
      </h3>
      <p className="mt-1 text-sm text-[#9A8F85] dark:text-[#F4EFE8]/60">{periodo}</p>
      <p className="mt-2 leading-relaxed opacity-90">{descripcion}</p>
    </div>
  )
}
