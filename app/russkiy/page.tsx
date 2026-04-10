import { genPageMetadata } from 'app/seo'
import Link from '../../components/Link'

export const metadata = genPageMetadata({ title: 'Русский · Barcelona' })

export default function RusskiyPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-20 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* HERO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-20 text-center dark:bg-[#081C3C]">
        <p className="mb-4 text-4xl">🌸 ☕</p>

        <h1 className="text-4xl font-semibold md:text-5xl">Ты говоришь по-русски?</h1>

        <p className="mt-6 text-xl font-semibold text-[#B3475A] md:text-2xl">
          Живёшь в Барселоне и русский язык часть твоей жизни?
        </p>

        <div className="mx-auto my-10 h-px w-20 bg-[#9A8F85]" />

        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#081C3C]/80 dark:text-[#F4EFE8]/80">
          Меня зовут Таш. Я билингв, немецкий и русский. Живу в Барселоне, и оба моих ребёнка растут
          с русским языком с рождения. Я ищу русскоязычных людей здесь, в городе, особенно семьи с
          маленькими детьми, чтобы просто быть вместе, говорить по-русски и передавать то, что нам
          важно.
        </p>
      </section>

      {/* QUOTE 1 */}
      <section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[Caveat] text-3xl leading-relaxed">
            „Я хочу, чтобы мои дети слышали русский не только от меня и бабушки, но и понимали: это
            живой язык, на котором говорят другие люди."
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="space-y-6 rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="text-2xl font-semibold">Немного обо мне</h2>

        <p className="leading-relaxed opacity-90">
          Я выросла с немецким и русским языками в Германии. Русский — мой второй родной язык, и он
          занимает особое место в моей жизни и в жизни моей семьи. Мои дети слышат русский каждые
          две недели дома, так как я использую метод{' '}
          <Link href="/1p2l" className="font-semibold hover:underline">
            1P2L (One Person Two Languages):
          </Link>{' '}
          1Р2Я (один родитель, два языка).
        </p>

        <p className="leading-relaxed opacity-90">
          Я живу в Барселоне, в районе Грасия, и мне очень хочется найти здесь русскоязычных людей,
          не для занятий и не для «русской школы». А просто для встреч, совместного
          времяпровождения, для того, чтобы дети слышали живой русский язык от разных людей, чтобы
          мы вместе отмечали праздники, делились традициями, и чтобы русский был не просто языком
          мамы и не просто языком бабушки.
        </p>
      </section>

      {/* WHAT I'M LOOKING FOR */}
      <section className="space-y-6 rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="text-2xl font-semibold">Кого я ищу</h2>

        <p className="leading-relaxed opacity-90">
          Людей, для которых русский язык часть их идентичности, и которые хотят передать его своим
          детям. Не через уроки и учебники, а через живое общение.
        </p>

        <ul className="ml-6 list-disc space-y-3 opacity-90">
          <li>Русскоязычные семьи с детьми примерно до 8 лет, или беременные мамы</li>
          <li>Живущие в Барселоне, особенно в Грасии или рядом</li>
          <li>Те, кому важны традиции, культура и связь между поколениями</li>
        </ul>

        <p className="leading-relaxed opacity-90">
          Встречи, прогулки, совместные праздники. Всё это мы можем придумать вместе.
        </p>
      </section>

      {/* QUOTE 2 */}
      <section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[Caveat] text-3xl leading-relaxed">
            „Язык живёт через отношения. Только через настоящие, живые связи язык по-настоящему
            создаётся и сохраняется."
          </p>
        </div>
      </section>

      {/* WHAT THIS IS NOT */}
      <section className="space-y-6 rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="text-2xl font-semibold">Что это не такое</h2>

        <p className="leading-relaxed opacity-90">
          Я не ищу русскую школу. Мне не интересны формальные занятия и оценки. Я также не ищу
          политических или идеологических разговоров.
        </p>

        <p className="leading-relaxed opacity-90">
          Мне важен живой, естественный русский язык. Тот, каким мы говорим дома, в кругу близких.
          Тот, который передаётся не через правила, а через песни, сказки, совместную еду, смех и
          повседневные разговоры.
        </p>
      </section>

      {/* CONTACT */}
      <section className="rounded-2xl border border-[#9A8F85]/30 bg-[#081C3C] px-6 py-20 text-center text-[#F4EFE8]">
        <h2 className="mb-4 text-2xl font-semibold">Напиши мне</h2>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-[#F4EFE8]/80">
          Если тебя зацепило то, что ты прочитала — напиши. Буду рада познакомиться.
        </p>

        <a
          href="mailto:info@linguatash.com"
          className="inline-block rounded-xl bg-[#B3475A] px-8 py-3 text-base font-medium text-[#F4EFE8] transition-transform duration-300 hover:scale-105"
        >
          info@linguatash.com
        </a>
      </section>
    </main>
  )
}
