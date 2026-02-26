import Image from 'next/image'
import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200 dark:border-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* 1 — Portrait */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
              <Image
                src="/static/images/ocean.jpeg"
                alt="Retrato de Tash, fundadora de LinguaTash"
                width={420}
                height={420}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          {/* 2 — About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Mi nombre es Tash
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Imagino un mundo donde aprender idiomas en la edad adulta sea una experiencia natural,
              vivida con alegría y confianza: a través del oído, la voz y el juego. Mi misión es
              acompañarte con claridad y fundamento para que este camino sea sostenible, humano y
              realmente posible en tu vida cotidiana.
            </p>

            <Link href="/perfil" className="text-primary-500 hover:text-primary-600">
              Más sobre mí →
            </Link>
          </div>

          {/* 3 — Offers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Lo que ofrezco
            </h3>

            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/fonetikas" className="hover:text-primary-500">
                  Fonetikas — cursos online de alemán para adultos hispanohablantes, basados en la
                  fonética y la oralidad.
                </Link>
              </li>
              <li>
                <Link href="/nordkreis" className="hover:text-primary-500">
                  Nordkreis — escuela de alemán de los sábados para niños de familias
                  germanohablantes en Barcelona.
                </Link>
              </li>
              <li>
                <Link href="/nordkreis" className="hover:text-primary-500">
                  Alemán·y·Du — extraescolares de alemán con enfoque comunicativo para alumnado de
                  I3 a 4º de ESO en Barcelona.
                </Link>
              </li>
              <li>
                <Link href="/resuena" className="hover:text-primary-500">
                  Resuena — juegos y audiolibros descargables para aprender y mejorar idiomas, con
                  enfoque en el multilingüismo.
                </Link>
              </li>
            </ul>
          </div>

          {/* 4 — Contacto */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Conecta conmigo
            </h3>

            {/* Social Media */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Redes sociales</p>

              <div className="flex flex-wrap gap-4">
                <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
                <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
                <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
              </div>
            </div>

            {/* Emails */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Correos de contacto
              </p>

              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="mailto:info@linguatash.com" className="hover:text-primary-500">
                    info@linguatash.com
                  </a>
                </li>
                <li>
                  <a href="mailto:fonetikas@linguatash.com" className="hover:text-primary-500">
                    fonetikas@linguatash.com
                  </a>
                </li>
                <li>
                  <a href="mailto:nordkreis@linguatash.com" className="hover:text-primary-500">
                    nordkreis@linguatash.com
                  </a>
                </li>
                <li>
                  <a href="mailto:alemanydu@linguatash.com" className="hover:text-primary-500">
                    alemanydu@linguatash.com
                  </a>
                </li>
                <li>
                  <a href="mailto:resuena@linguatash.com" className="hover:text-primary-500">
                    resuena@linguatash.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-16 flex flex-col items-center border-t border-gray-200 pt-6 dark:border-gray-100">
          <div className="mb-2 flex flex-col items-center space-y-1 text-sm text-gray-500 sm:flex-row sm:space-y-0 sm:space-x-2 dark:text-gray-400">
            <div>{siteMetadata.author}</div>
            <div>{` • `}</div>
            <div>{`© ${new Date().getFullYear()}`}</div>
            <div>{` • `}</div>
            <Link href="/">{siteMetadata.title}</Link>
          </div>

          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <Link
              href="https://github.com/timlrx/tailwind-nextjs-starter-blog"
              className="hover:text-primary-500 underline underline-offset-4"
            >
              Tailwind Nextjs Theme
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
