import Link from '@/components/Link'

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 sm:px-6 lg:px-8">
      {/* First Quote */}
      <section className="py-16 text-center">
        <blockquote className="font-accent text-2xl font-semibold text-gray-900 md:text-3xl dark:text-gray-100">
          "Una lengua se construye primero en el oído y en la voz. Leer y escribir solo tiene
          sentido cuando el idioma ya se siente natural."
        </blockquote>
      </section>

      {/* Intro / LinguaTash projects */}
      <section className="space-y-6">
        <p className="text-lg text-gray-800 dark:text-gray-200">
          LinguaTash es el espacio donde convergen mi trabajo y mi experiencia en adquisición del
          lenguaje. A través de distintos proyectos, exploro cómo se adquieren las lenguas de forma
          natural — en la infancia, en la edad adulta y a través del juego.
        </p>

        <p className="text-lg text-gray-800 dark:text-gray-200">
          De esta base nacen tres proyectos complementarios:
        </p>

        <ul className="list-inside list-disc space-y-2 text-gray-800 dark:text-gray-200">
          <li>
            <strong>Fonetikas</strong> – adquisición del alemán para adultos hispanohablantes a
            partir de la fonética y la oralidad
          </li>
          <li>
            <strong>Sprachwege</strong> – escuela de alemán de los sábados para familias
            germanohablantes en Barcelona
          </li>
          <li>
            <strong>¡Salten!</strong> – un juego de mesa para adquirir vocabulario en distintas
            lenguas mediante la fonética, sin lectura
          </li>
        </ul>

        <p className="text-lg text-gray-800 dark:text-gray-200">
          Todos parten del mismo principio: la lengua se adquiere primero en el oído y en la voz; la
          lectura y la escritura vienen después.
        </p>
      </section>

      {/* Second Quote */}
      <section className="py-16 text-center">
        <blockquote className="font-accent text-2xl font-semibold text-gray-900 md:text-3xl dark:text-gray-100">
          "La capacidad de adquirir lenguas no se pierde con la edad. Lo que a menudo falta es un
          enfoque adecuado, basado en la lengua materna del aprendiz."
        </blockquote>
      </section>

      {/* Mis Propuestas / Offers */}
      <section className="space-y-12">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Mis propuestas
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Fonetikas */}
          <div className="flex flex-col justify-between space-y-4 rounded-lg bg-gray-100 p-6 shadow-md dark:bg-gray-900">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Fonetikas</h3>
              <p className="mt-2 text-gray-800 dark:text-gray-200">
                Adultos hispanohablantes: aprendizaje de alemán desde cero o reconstrucción de la
                base oral, basado en fonética y contrastes con el español.
              </p>
            </div>
            <Link
              href="/fonetikas"
              className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Descubrir Fonetikas
            </Link>
          </div>

          {/* Sprachwege */}
          <div className="flex flex-col justify-between space-y-4 rounded-lg bg-gray-100 p-6 shadow-md dark:bg-gray-900">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Sprachwege</h3>
              <p className="mt-2 text-gray-800 dark:text-gray-200">
                Niños de familias germanohablantes en Barcelona: escuela de alemán los sábados,
                centrada en el desarrollo natural del idioma.
              </p>
            </div>
            <Link
              href="/sprachwege"
              className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Conocer Sprachwege
            </Link>
          </div>

          {/* ¡Salten! */}
          <div className="flex flex-col justify-between space-y-4 rounded-lg bg-gray-100 p-6 shadow-md dark:bg-gray-900">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">¡Salten!</h3>
              <p className="mt-2 text-gray-800 dark:text-gray-200">
                Familias, adultos y niños: juego de mesa para adquirir vocabulario en varias lenguas
                a través de la fonética, sin lectura de palabras.
              </p>
            </div>
            <Link
              href="/salten"
              className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Ver ¡Salten!
            </Link>
          </div>
        </div>
      </section>

      {/* Placeholder / closing third quote */}
      <section className="py-16 text-center">
        <blockquote className="font-accent text-2xl font-semibold text-gray-900 md:text-3xl dark:text-gray-100">
          "El idioma se adquiere primero en el oído y en la voz; la lectura y la escritura llegan
          después."
        </blockquote>
      </section>
    </main>
  )
}

// import Link from '@/components/Link'
// import Tag from '@/components/Tag'
// import siteMetadata from '@/data/siteMetadata'
// import { formatDate } from 'pliny/utils/formatDate'
// import NewsletterForm from 'pliny/ui/NewsletterForm'

// const MAX_DISPLAY = 5

// export default function Home({ posts }) {
//   return (
//     <>
//       <div className="divide-y divide-gray-200 dark:divide-gray-700">
//         <div className="space-y-2 pt-6 pb-8 md:space-y-5">
//           <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
//             Latest
//           </h1>
//           <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
//             {siteMetadata.description}
//           </p>
//         </div>
//         <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//           {!posts.length && 'No posts found.'}
//           {posts.slice(0, MAX_DISPLAY).map((post) => {
//             const { slug, date, title, summary, tags } = post
//             return (
//               <li key={slug} className="py-12">
//                 <article>
//                   <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
//                     <dl>
//                       <dt className="sr-only">Published on</dt>
//                       <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
//                         <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
//                       </dd>
//                     </dl>
//                     <div className="space-y-5 xl:col-span-3">
//                       <div className="space-y-6">
//                         <div>
//                           <h2 className="text-2xl leading-8 font-bold tracking-tight">
//                             <Link
//                               href={`/blog/${slug}`}
//                               className="text-gray-900 dark:text-gray-100"
//                             >
//                               {title}
//                             </Link>
//                           </h2>
//                           <div className="flex flex-wrap">
//                             {tags.map((tag) => (
//                               <Tag key={tag} text={tag} />
//                             ))}
//                           </div>
//                         </div>
//                         <div className="prose max-w-none text-gray-500 dark:text-gray-400">
//                           {summary}
//                         </div>
//                       </div>
//                       <div className="text-base leading-6 font-medium">
//                         <Link
//                           href={`/blog/${slug}`}
//                           className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
//                           aria-label={`Read more: "${title}"`}
//                         >
//                           Read more &rarr;
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </article>
//               </li>
//             )
//           })}
//         </ul>
//       </div>
//       {posts.length > MAX_DISPLAY && (
//         <div className="flex justify-end text-base leading-6 font-medium">
//           <Link
//             href="/blog"
//             className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
//             aria-label="All posts"
//           >
//             All Posts &rarr;
//           </Link>
//         </div>
//       )}
//       {siteMetadata.newsletter?.provider && (
//         <div className="flex items-center justify-center pt-4">
//           <NewsletterForm />
//         </div>
//       )}
//     </>
//   )
// }
