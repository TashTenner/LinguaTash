'use client'

import { useState } from 'react'
import Image from 'next/image'

// Language definitions
const LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸', note: 'Variante de España peninsular' },
  { code: 'ca', name: 'Catalán', flag: '🏴', note: 'Catalan estándar' },
  { code: 'en', name: 'Inglés', flag: '🇬🇧', note: 'Acento británico' },
  { code: 'de', name: 'Alemán', flag: '🇩🇪', note: 'Hochdeutsch estándar' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', note: 'Italiano estándar' },
  { code: 'ru', name: 'Ruso', flag: '🇷🇺', note: 'Ruso estándar' },
]

const PRICE_PER_LANGUAGE = 4

// ─── Collapsible FAQ item ───────────────────────────────────────────────────
function FaqItem({ question, children }: { question: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#9A8F85]/30 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left font-medium"
      >
        <span>{question}</span>
        <span className="ml-4 shrink-0 text-[#B3475A]">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="mt-3 text-sm leading-relaxed opacity-80">{children}</div>}
    </div>
  )
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function SaltenPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [form, setForm] = useState({
    email: '',
    nombre: '',
    nif: '',
    telefono: '',
    codigoPostal: '',
    ciudad: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function toggleLanguage(code: string) {
    setSelected((prev) => (prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]))
  }

  const total = selected.length * PRICE_PER_LANGUAGE

  function validate() {
    const e: Record<string, string> = {}
    if (!form.email) e.email = 'El email es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email no válido'
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!form.nif.trim()) e.nif = 'El NIF/NIE es obligatorio para emitir factura (Verifactu)'
    return e
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    if (selected.length === 0) return

    setLoading(true)
    setErrors({})

    try {
      // Call your Next.js API route to create a Stripe Checkout session
      const res = await fetch('/api/checkout/salten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          languages: selected,
          customer: {
            email: form.email,
            nombre: form.nombre,
            nif: form.nif,
            telefono: form.telefono,
            codigoPostal: form.codigoPostal,
            ciudad: form.ciudad,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Error al crear la sesión de pago')

      // Redirect to Stripe Checkout
      // Redirect directly — no Stripe.js needed for Checkout URL redirect
      window.location.href = data.url
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setErrors({ general: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-20 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-20 text-center dark:bg-[#081C3C]">
        <p className="mb-3 text-sm font-medium tracking-widest text-[#B3475A] uppercase">
          Juego fonético
        </p>
        <h1 className="text-5xl font-semibold md:text-6xl">Salten</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-80">
          Aprende vocabulario en distintos idiomas únicamente a través del sonido. Sin escritura.
          Sin traducción. Solo el oído.
        </p>
        <a
          href="#comprar"
          className="mt-8 inline-block rounded-xl bg-[#B3475A] px-8 py-3 font-medium text-white transition hover:scale-105"
        >
          Comprar ahora
        </a>
      </section>

      {/* ── POR QUÉ AUDIO PRIMERO ─────────────────────────────────────────── */}
      <section className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">¿Por qué empezar por el sonido?</h2>
          <p className="leading-relaxed opacity-80">
            Cuando aprendemos un idioma leyendo primero la palabra escrita, tendemos a pronunciarla
            con los sonidos de nuestra lengua materna.
          </p>
          <p className="leading-relaxed opacity-80">
            En <strong>Salten</strong> las palabras no aparecen escritas. El objetivo es escuchar el
            sonido y crear una representación auditiva auténtica desde el primer momento.
          </p>
        </div>

        <section>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-[Caveat] text-3xl leading-relaxed">
              „Salten no empieza con la escritura.
              <br />
              Empieza con el oído."
            </p>
          </div>
        </section>
      </section>

      {/* ── QUÉ INCLUYE ──────────────────────────────────────────────────── */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold">¿Qué incluye cada idioma?</h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-6">
          {[
            { n: '150', label: 'Audios', sub: 'Pronunciación nativa' },
            { n: '150', label: 'Imágenes', sub: 'Ilustradas y numeradas' },
            { n: '10', label: 'Cartas Joker', sub: 'Comodines del juego' },
            { n: '1', label: 'Documento', sub: 'IDs + descripciones' },
            { n: '1', label: 'Manual', sub: 'Guía de uso' },
            {
              n: '1',
              label: 'Carta de idioma',
              sub: 'Indica el idioma en el que se juega la ronda',
            },
          ].map(({ n, label, sub }) => (
            <div
              key={label}
              className="rounded-xl border border-[#9A8F85]/40 bg-[#F4EFE8] p-6 text-center dark:bg-[#081C3C]"
            >
              <p className="text-4xl font-semibold text-[#B3475A]">{n}</p>
              <p className="mt-1 font-medium">{label}</p>
              <p className="mt-1 text-xs opacity-60">{sub}</p>
            </div>
          ))}
        </div>

        <p className="text-sm opacity-70">
          Cada idioma es independiente. Puedes empezar con uno y añadir más en cualquier momento.
          Nota: todos incluyen 150 imágenes, pero con varios idiomas solo necesitas imprimir una
          vez.
        </p>
      </section>

      {/* ── EJEMPLO DE CARTAS ────────────────────────────────────────────── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Cómo son las cartas</h2>
        <p className="leading-relaxed opacity-80">
          Las cartas están ilustradas y numeradas. Cada idioma incluye <strong>10 grupos</strong>{' '}
          con <strong>15 cartas</strong> y <strong>15 audios</strong> por grupo.
        </p>
        <div className="rounded-xl border border-[#9A8F85]/40 bg-[#F4EFE8] p-4 dark:bg-[#081C3C]">
          <Image
            src="/static/images/saltenAnimalsExample.jpg"
            alt="Ejemplo cartas Salten"
            className="mx-auto rounded-lg"
            width={600}
            height={400}
            priority
          />
        </div>
        <div className="rounded-xl border border-[#9A8F85]/30 bg-[#F4EFE8]/60 p-6 dark:bg-[#081C3C]/60">
          <p className="mb-3 font-medium">
            Ejemplo — carta <strong>NA01</strong>: "gato"
          </p>
          <ul className="space-y-1 text-sm opacity-80">
            <li>
              <span className="font-medium">Catalán</span> — animal domèstic petit amb quatre potes,
              bigotis i cua
            </li>
            <li>
              <span className="font-medium">Alemán</span> — kleines Haustier mit vier Beinen,
              Schnurrhaaren und einem Schwanz
            </li>
            <li>
              <span className="font-medium">Inglés</span> — a small domestic animal with four legs,
              whiskers and a tail
            </li>
            <li>
              <span className="font-medium">Español</span> — animal doméstico pequeño con cuatro
              patas, bigotes y cola
            </li>
            <li>
              <span className="font-medium">Italiano</span> — piccolo animale domestico con quattro
              zampe, baffi e coda
            </li>
            <li>
              <span className="font-medium">Ruso</span> — маленькое домашнее животное с четырьмя
              лапами, усами и хвостом
            </li>
          </ul>
        </div>
      </section>

      {/* ── AUDIO PREVIEW ────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Escucha un ejemplo</h2>
        <p className="opacity-80">Así suena la palabra "gato" en los seis idiomas disponibles.</p>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: 'Español', src: '/static/audio/es-ES_NA01.mp3' },
            { label: 'Catalán', src: '/static/audio/ca-ES_NA01.wav' },
            { label: 'Inglés', src: '/static/audio/en-GB_NA01.mp3' },
            { label: 'Alemán', src: '/static/audio/de-DE_NA01.mp3' },
            { label: 'Italiano', src: '/static/audio/it-IT_NA01.mp3' },
            { label: 'Ruso', src: '/static/audio/ru-RU_NA01.mp3' },
          ].map(({ label, src }) => (
            <div key={label} className="space-y-2 text-center">
              <p className="text-sm font-medium">{label}</p>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio controls src={src} className="mx-auto w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* ── PARA QUIÉN ───────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">¿Para quién está pensado?</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            'Niños en entornos bilingües o multilingües',
            'Personas que quieren entrenar el oído en un nuevo idioma',
            'Profesores de idiomas que buscan ejercicios de conciencia fonológica',
            'Logopedas y profesionales de la fonética',
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-[#9A8F85]/30 p-4"
            >
              <span className="mt-0.5 text-[#B3475A]">✦</span>
              <span className="text-sm leading-relaxed opacity-80">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
        <div className="divide-y divide-[#9A8F85]/20 rounded-xl border border-[#9A8F85]/40 px-6">
          <FaqItem question="¿Puedo comprar más idiomas más adelante?">
            Sí. Cada idioma es un pack independiente. Puedes empezar con uno y añadir más cuando
            quieras, al mismo precio de 4 € por idioma.
          </FaqItem>
          <FaqItem question="¿Cómo recibo los archivos tras la compra?">
            Recibirás un email con un enlace de descarga segura. Los archivos incluyen los audios
            (MP3), las imágenes y el documento de referencia.
          </FaqItem>
          <FaqItem question="¿El juego funciona con niños pequeños?">
            Está especialmente diseñado para edades tempranas (3–10 años), aunque adultos que
            aprenden idiomas también lo usan con muy buenos resultados.
          </FaqItem>
          <FaqItem question="¿Qué pasa si ya tengo el español y quiero añadir inglés después?">
            Solo compras el pack del idioma nuevo. No hay que volver a comprar lo que ya tienes.
          </FaqItem>
          <FaqItem question="¿Emitís factura?">
            Sí. Se emite factura electrónica conforme a Verifactu para todos los pedidos. Por eso
            pedimos NIF/NIE en el formulario de compra.
          </FaqItem>
          <FaqItem question="¿Por qué se solicita el DNI/NIF/NIE?">
            Verifactu es la normativa de facturación electrónica obligatoria en España. Se requiere
            el DNI/NIF/NIE para emitir facturas válidas y legales. Los datos no se comparten con
            terceros.
          </FaqItem>
          <FaqItem question="¿Puedo jugar con el paquete de Español si hablo español latinoamericano?">
            Claro. Todas las variantes del español son culturalmente válidas y aceptadas. Sin
            embargo, para el juego necesitarías aprender y practicar con la pronunciación del
            español de España, que es la versión incluida en este paquete. Lo mismo aplica para el
            paquete de Inglés, que utiliza la pronunciación británica.
          </FaqItem>
        </div>
      </section>

      {/* ── ORIGEN DEL NOMBRE ────────────────────────────────────────────── */}
      <section className="rounded-xl border border-[#9A8F85]/40 bg-[#F4EFE8] p-8 dark:bg-[#081C3C]">
        <h2 className="mb-4 text-xl font-semibold">¿Por qué se llama Salten?</h2>
        <p className="leading-relaxed opacity-80">
          <strong>Salten</strong> está formado por las primeras letras de los apellidos de mis
          hijos. La idea nació pensando en cómo ayudar a los niños que crecen entre varios idiomas a
          desarrollar una buena sensibilidad fonética desde pequeños.
        </p>
        <p className="mt-4 leading-relaxed opacity-80">
          Los seis idiomas incluidos no son casualidad: español, catalán, inglés, alemán, italiano y
          ruso son las lenguas con las que mis hijos crecen. Elegí deliberadamente estas variantes
          para que reflejaran su realidad multilingüe y la de muchas familias como la nuestra.
        </p>
      </section>

      {/* ── COMPRAR ──────────────────────────────────────────────────────── */}
      <section id="comprar" className="scroll-mt-20 space-y-10">
        <h2 className="text-2xl font-semibold">Comprar</h2>

        {/* Language selector */}
        <div className="space-y-4">
          <p className="font-medium">1. Selecciona los idiomas (4 € cada uno)</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`rounded-xl border p-4 text-left transition ${
                  selected.includes(lang.code)
                    ? 'border-[#B3475A] bg-[#B3475A]/10'
                    : 'border-[#9A8F85]/40 hover:border-[#9A8F85]/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{lang.name}</span>
                  {selected.includes(lang.code) && (
                    <span className="text-xs font-semibold text-[#B3475A]">✓</span>
                  )}
                </div>
                <div className="mt-1 text-xs opacity-60">{lang.note}</div>
                <div className="mt-2 text-sm font-semibold">4 €</div>
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <p className="text-sm opacity-70">
              {selected.length} idioma{selected.length > 1 ? 's' : ''} seleccionado
              {selected.length > 1 ? 's' : ''} · Total: <strong>{total} €</strong>
            </p>
          )}
        </div>

        {/* Purchase form */}
        <div className="space-y-4">
          <p className="font-medium">2. Tus datos</p>
          <p className="text-sm opacity-60">
            Necesitamos estos datos para emitir la factura electrónica conforme a la normativa
            Verifactu.
          </p>

          <form onSubmit={handleCheckout} className="max-w-lg space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="email">
                Email <span className="text-[#B3475A]">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com"
                className="w-full rounded-xl border border-[#9A8F85]/40 bg-white px-4 py-2 text-[#081C3C] focus:border-[#B3475A] focus:outline-none"
              />
              {errors.email && <p className="text-xs text-[#B3475A]">{errors.email}</p>}
            </div>

            {/* Nombre */}
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="nombre">
                Nombre completo <span className="text-[#B3475A]">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ana García López"
                className="w-full rounded-xl border border-[#9A8F85]/40 bg-white px-4 py-2 text-[#081C3C] focus:border-[#B3475A] focus:outline-none"
              />
              {errors.nombre && <p className="text-xs text-[#B3475A]">{errors.nombre}</p>}
            </div>

            {/* NIF */}
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="nif">
                NIF / NIE / Pasaporte <span className="text-[#B3475A]">*</span>
              </label>
              <input
                id="nif"
                type="text"
                value={form.nif}
                onChange={(e) => setForm({ ...form, nif: e.target.value.toUpperCase() })}
                placeholder="12345678A"
                className="w-full rounded-xl border border-[#9A8F85]/40 bg-white px-4 py-2 text-[#081C3C] focus:border-[#B3475A] focus:outline-none"
              />
              {errors.nif && <p className="text-xs text-[#B3475A]">{errors.nif}</p>}
              <p className="text-xs opacity-50">Requerido para la emisión de factura (Verifactu)</p>
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="telefono">
                Teléfono <span className="text-xs font-normal opacity-50">(opcional)</span>
              </label>
              <input
                id="telefono"
                type="tel"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="+34 600 000 000"
                className="w-full rounded-xl border border-[#9A8F85]/40 bg-white px-4 py-2 text-[#081C3C] focus:border-[#B3475A] focus:outline-none"
              />
            </div>

            {/* Ciudad + CP */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="cp">
                  Código postal <span className="text-xs font-normal opacity-50">(opcional)</span>
                </label>
                <input
                  id="cp"
                  type="text"
                  value={form.codigoPostal}
                  onChange={(e) => setForm({ ...form, codigoPostal: e.target.value })}
                  placeholder="43201"
                  className="w-full rounded-xl border border-[#9A8F85]/40 bg-white px-4 py-2 text-[#081C3C] focus:border-[#B3475A] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="ciudad">
                  Ciudad <span className="text-xs font-normal opacity-50">(opcional)</span>
                </label>
                <input
                  id="ciudad"
                  type="text"
                  value={form.ciudad}
                  onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                  placeholder="Reus"
                  className="w-full rounded-xl border border-[#9A8F85]/40 bg-white px-4 py-2 text-[#081C3C] focus:border-[#B3475A] focus:outline-none"
                />
              </div>
            </div>

            {/* General error */}
            {errors.general && (
              <p className="rounded-lg bg-[#B3475A]/10 px-4 py-2 text-sm text-[#B3475A]">
                {errors.general}
              </p>
            )}

            {/* Total + CTA */}
            <div className="rounded-xl border border-[#9A8F85]/30 bg-[#F4EFE8] p-4 dark:bg-[#081C3C]">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-70">
                  {selected.length === 0
                    ? 'Selecciona al menos un idioma'
                    : `${selected.length} idioma${selected.length > 1 ? 's' : ''}`}
                </span>
                <span className="text-xl font-semibold">{total} €</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={selected.length === 0 || loading}
              className="w-full rounded-xl bg-[#B3475A] px-6 py-3 font-medium text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? 'Redirigiendo a pago…' : `Pagar ${total} € con Stripe`}
            </button>

            <p className="text-center text-xs opacity-50">
              Pago seguro con Stripe · Recibirás los archivos y la factura por email
            </p>
          </form>
        </div>
      </section>

      {/* ── BOTTOM SPACER ────────────────────────────────────────────────── */}
      <div className="h-10" />
    </main>
  )
}
