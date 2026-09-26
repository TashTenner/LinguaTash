'use client'

import { useState } from 'react'

const FAQS = [
  {
    question: '¿Puedo venir si no soy argentino pero mi pareja sí?',
    answer:
      'Sí. Lo importante es que venga el progenitor que habla la lengua. El otro es bienvenido.',
  },
  {
    question: '¿Puedo dejar a mi hijo y volver a buscarlo?',
    answer:
      'No. La Juntada es una actividad familiar y cada familia es responsable de sus hijos durante toda la tarde.',
  },
  {
    question: '¿Y si mi hijo tiene menos de 3 años?',
    answer: 'Puede venir. La franja es orientativa y la decisión es de cada familia.',
  },
  {
    question: '¿Tengo que traer algo?',
    answer:
      'Tu mate y tu bombilla, si tomás. El agua caliente y la yerba ya están puestas, así que llegás y cebás. El resto también lo ponemos nosotros.',
  },
  {
    question: '¿Puede venir la abuela o el abuelo?',
    answer:
      'Sí, y ojalá vengan. Cada adulto adicional de la familia son 10 euros. Para un chico, escuchar a sus abuelos hablar en su lengua vale más que cualquier actividad que podamos armar.',
  },
  {
    question: '¿Hay que venir todos los meses?',
    answer: 'No. Cada juntada se reserva por separado.',
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#9A8F85]/30 py-4 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left font-medium"
        aria-expanded={open}
      >
        <span>{question}</span>
        <span className="ml-4 shrink-0 text-[#B3475A]">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="mt-3 text-sm leading-relaxed opacity-80">{answer}</div>}
    </div>
  )
}

export default function FaqAccordion() {
  return (
    <div className="divide-y divide-[#9A8F85]/20 rounded-xl border border-[#9A8F85]/40 px-6">
      {FAQS.map((faq) => (
        <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  )
}
