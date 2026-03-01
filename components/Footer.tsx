import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200 dark:border-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* 1 — Sobre mí */}
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

          {/* 2 — Proyectos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Proyectos</h3>

            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/fonetikas" className="hover:text-primary-500">
                  Fonetikas
                </Link>
              </li>
              <li>
                <Link href="/nordkreis" className="hover:text-primary-500">
                  Nordkreis
                </Link>
              </li>
              <li>
                <Link href="/alemanydu" className="hover:text-primary-500">
                  Alemán·y·Du
                </Link>
              </li>
              <li>
                <Link href="/resuena" className="hover:text-primary-500">
                  Resuena
                </Link>
              </li>
              <li>
                <Link href="/1p2l" className="hover:text-primary-500">
                  1P2L
                </Link>
              </li>
            </ul>
          </div>

          {/* 3 — Contacto */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contacto</h3>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Redes sociales</p>

              <div className="flex flex-wrap gap-4">
                <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
                <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
                <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Correos</p>

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
                <li>
                  <a href="mailto:1p2l@linguatash.com" className="hover:text-primary-500">
                    1p2l@linguatash.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 4 — Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Información legal
            </h3>

            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/politica-de-privacidad" className="hover:text-primary-500">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/aviso-legal" className="hover:text-primary-500">
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link href="/politica-de-cookies" className="hover:text-primary-500">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-16 flex flex-col items-center border-t border-gray-200 pt-6 dark:border-gray-100">
          <div className="mb-2 flex flex-col items-center space-y-1 text-sm text-gray-500 sm:flex-row sm:space-y-0 sm:space-x-2 dark:text-gray-400">
            <div>{siteMetadata.author}</div>
            <div> • </div>
            <div>© {new Date().getFullYear()}</div>
            <div> • </div>
            <Link href="/">{siteMetadata.title}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
