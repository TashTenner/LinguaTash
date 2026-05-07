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
                <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} hoverColor="hover:text-[#FF0000]" />
                <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} hoverColor="hover:text-[#0A66C2]" />
                <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} hoverColor="hover:text-[#E1306C]" />
                <a
                  href="https://wa.me/34602656578"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="text-gray-700 hover:text-[#25D366] dark:text-gray-200 dark:hover:text-[#25D366]"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
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
