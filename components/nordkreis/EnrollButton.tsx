'use client'

// Shows the enroll button, or a closed message in April.
export default function EnrollButton() {
  const isApril = new Date().getMonth() === 3

  if (isApril) {
    return (
      <p className="mt-2 text-sm text-[#9A8F85]">
        Die Anmeldungen öffnen am 1. Mai · Las inscripciones abren el 1 de mayo
      </p>
    )
  }

  return (
    <a
      href="/nordkreis/enroll"
      className="inline-block w-fit max-w-full truncate overflow-hidden rounded-xl bg-[#B3475A] px-6 py-3 text-base font-medium whitespace-nowrap text-white transition-transform duration-300 hover:scale-105 sm:text-sm"
    >
      Jetzt anmelden
    </a>
  )
}
