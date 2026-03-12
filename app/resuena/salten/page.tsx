'use client'
// import AudioCard from '../../../components/AudioCard'

import { useState } from 'react'

export default function SaltenPage() {
  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'ca', name: 'Catalán' },
    { code: 'en', name: 'Inglés' },
    { code: 'de', name: 'Alemán' },
    { code: 'it', name: 'Italiano' },
    { code: 'ru', name: 'Ruso' },
  ]

  const PRICE_PER_LANGUAGE = 4

  const [selected, setSelected] = useState<string[]>([])
  const [email, setEmail] = useState('')

  function toggleLanguage(code) {
    if (selected.includes(code)) {
      setSelected(selected.filter((l) => l !== code))
    } else {
      setSelected([...selected, code])
    }
  }

  const total = selected.length * PRICE_PER_LANGUAGE

  function handleSubmit(e) {
    e.preventDefault()

    console.log({
      email,
      languages: selected,
      total,
    })
  }

  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* HERO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-20 text-center dark:bg-[#081C3C]">
        <h1 className="text-4xl font-semibold md:text-5xl">¡Salten!</h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-90">
          Un juego fonético para aprender vocabulario en distintos idiomas únicamente a través del
          sonido de las palabras.
        </p>
      </section>

      {/* CONTENIDO DEL PACK */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">¿Qué incluye cada idioma?</h2>

        <ul className="space-y-3 opacity-90">
          <li>• 150 audios</li>
          <li>• 150 imágenes</li>
          <li>• Documento con IDs de imágenes y explicaciones</li>
          <li>• 10 cartas Joker</li>
        </ul>

        <p className="text-sm opacity-80">
          Cada idioma puede descargarse de forma independiente. Puedes empezar con uno o varios
          idiomas y añadir más más adelante.
        </p>
      </section>

      {/* EJEMPLO DE CARTAS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Cómo son las cartas</h2>

        <p className="leading-relaxed opacity-90">
          Las cartas del juego están ilustradas y numeradas con un ID único. Cada idioma incluye{' '}
          <strong>10 grupos</strong> con <strong>15 cartas</strong> y<strong> 15 audios</strong> por
          grupo.
        </p>

        <p className="leading-relaxed opacity-90">En total, cada idioma contiene:</p>

        <ul className="space-y-2 opacity-90">
          <li>• 150 imágenes</li>
          <li>• 150 audios</li>
          <li>• 10 cartas Joker</li>
          <li>• Documento adicional con pistas para identificar cada palabra</li>
        </ul>

        <div className="rounded-xl border border-[#9A8F85]/40 bg-[#F4EFE8] p-4 dark:bg-[#081C3C]">
          <img
            src="/static/images/saltenAnimalsExample.jpg"
            alt="Ejemplo cartas Salten"
            className="mx-auto rounded-lg"
          />
        </div>
      </section>

      {/* EJEMPLO NA01 */}
      <section className="space-y-4">
        <p className="leading-relaxed opacity-90">
          Por ejemplo, la carta <strong>NA01</strong> representa la palabra
          <strong> "gato"</strong>.
        </p>

        <p className="leading-relaxed opacity-90">
          En el documento incluido en el pack se proporcionan descripciones para ayudar a reconocer
          la palabra cuando la imagen no es evidente:
        </p>

        <ul className="space-y-1 text-sm opacity-90">
          <li>Catalán — animal domèstic petit amb quatre potes, bigotis i cua</li>
          <li>Alemán — kleines Haustier mit vier Beinen, Schnurrhaaren und einem Schwanz</li>
          <li>Inglés — a small domestic animal with four legs, whiskers and a tail</li>
          <li>Español — animal doméstico pequeño con cuatro patas, bigotes y cola</li>
          <li>Italiano — piccolo animale domestico con quattro zampe, baffi e coda</li>
          <li>Ruso — маленькое домашнее животное с четырьмя лапами, усами и хвостом</li>
        </ul>
      </section>

      {/* AUDIO PREVIEW */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Escucha un ejemplo</h2>
        <p className="opacity-90">
          Aquí puedes escuchar cómo suena la palabra "gato" en los distintos idiomas disponibles.
        </p>

        {/* <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Escucha un ejemplo</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <AudioCard label="Español" src="/static/audios/es-ES_NA01.mp3" />

            <AudioCard label="Catalán" src="/static/audios/ca-ES_NA01.mp3" />

            <AudioCard label="Inglés" src="/static/audios/en-GB_NA01.mp3" />

            <AudioCard label="Alemán" src="/static/audios/de-DE_NA01.mp3" />

            <AudioCard label="Italiano" src="/static/audios/it-IT_NA01.mp3" />

            <AudioCard label="Ruso" src="/static/audios/ru-RU_NA01.mp3" />
          </div>
        </section> */}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium">Español</p>
            <audio controls src="/static/audios/es-ES_NA01.mp3" className="mx-auto w-full" />
          </div>

          <div className="space-y-2 text-center">
            <p className="text-sm font-medium">Catalán</p>
            <audio controls src="/static/audios/ca-ES_NA01.mp3" className="mx-auto w-full" />
          </div>

          <div className="space-y-2 text-center">
            <p className="text-sm font-medium">Inglés</p>
            <audio controls src="/static/audios/en-GB_NA01.mp3" className="mx-auto w-full" />
          </div>

          <div className="space-y-2 text-center">
            <p className="text-sm font-medium">Alemán</p>
            <audio controls src="/static/audios/de-DE_NA01.mp3" className="mx-auto w-full" />
          </div>

          <div className="space-y-2 text-center">
            <p className="text-sm font-medium">Italiano</p>
            <audio controls src="/static/audios/it-IT_NA01.mp3" className="mx-auto w-full" />
          </div>

          <div className="space-y-2 text-center">
            <p className="text-sm font-medium">Ruso</p>
            <audio controls src="/static/audios/ru-RU_NA01.mp3" className="mx-auto w-full" />
          </div>

          <audio controls className="mx-auto">
            <source src="/static/audios/ru-RU_NA01.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </section>

      {/* MANIFIESTO */}
      <section>
        <div className="rounded-xl border border-[#9A8F85]/40 p-8 text-center text-lg italic opacity-90">
          Salten no empieza con la escritura.
          <br />
          Empieza con el oído.
        </div>
      </section>

      {/* POR QUÉ NO APARECE ESCRITA */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">¿Por qué las palabras no aparecen escritas?</h2>

        <p className="leading-relaxed opacity-90">
          Cuando aprendemos un idioma leyendo primero la palabra escrita, tendemos a pronunciarla
          usando las reglas de nuestra lengua materna.
        </p>

        <p className="leading-relaxed opacity-90">
          Un hablante de español leerá una palabra inglesa usando sonidos del español, un alemán
          aplicará reglas del alemán, y así sucesivamente.
        </p>

        <p className="leading-relaxed opacity-90">
          En <strong>Salten</strong> las palabras no aparecen escritas para evitar ese efecto. El
          objetivo es escuchar primero el sonido y crear una representación auditiva auténtica de la
          palabra.
        </p>
      </section>

      {/* PARA QUIÉN ESTÁ PENSADO */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">¿Para quién está pensado Salten?</h2>

        <ul className="space-y-3 opacity-90">
          <li>• Niños que crecen en entornos bilingües o multilingües</li>
          <li>• Personas que quieren entrenar el oído en un nuevo idioma</li>
          <li>• Profesores de idiomas que buscan ejercicios de conciencia fonológica</li>
          <li>• Logopedas y profesionales de la fonética</li>
        </ul>
      </section>

      {/* ORIGEN DEL NOMBRE */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">¿Por qué se llama Salten?</h2>

        <p className="leading-relaxed opacity-90">El nombre del juego tiene un origen personal.</p>

        <p className="leading-relaxed opacity-90">
          <strong>Salten</strong> está formado por las primeras letras de los apellidos de mis
          hijos.
        </p>

        <p className="leading-relaxed opacity-90">
          La idea del juego nació pensando en cómo ayudar a los niños que crecen entre varios
          idiomas a desarrollar una buena sensibilidad fonética desde pequeños.
        </p>
      </section>

      {/* IDIOMAS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Selecciona los idiomas</h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => toggleLanguage(lang.code)}
              className={`rounded-xl border p-4 transition ${
                selected.includes(lang.code)
                  ? 'border-[#B3475A] bg-[#B3475A]/10'
                  : 'border-[#9A8F85]/40'
              }`}
            >
              <div className="font-medium">{lang.name}</div>

              <div className="text-sm opacity-70">4 €</div>
            </button>
          ))}
        </div>
      </section>

      {/* COMPRA */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Comprar</h2>

        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border px-4 py-2 text-[#081C3C]"
          />

          <div className="text-lg font-semibold">Total: {total} €</div>

          <button
            disabled={selected.length === 0}
            className="w-full rounded-xl bg-[#B3475A] px-6 py-3 font-medium text-white transition hover:scale-105 disabled:opacity-50"
          >
            Comprar
          </button>
        </form>
      </section>
    </main>
  )
}
