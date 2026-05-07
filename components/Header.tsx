import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import LogoDark from '@/data/logoDark.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import SocialIcon from './social-icons' // <-- import SocialIcon

const Header = () => {
  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Logo className="block dark:hidden" />
            <LogoDark className="hidden dark:block" />{' '}
          </div>
        </div>
      </Link>

      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        {/* Nav links */}
        <div className="hidden items-center gap-x-2 sm:flex">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100"
              >
                {link.title}
              </Link>
            ))}
        </div>

        {/* Social icons */}
        <div className="hidden items-center gap-x-2 sm:flex">
          {siteMetadata.youtube && (
            <SocialIcon
              kind="youtube"
              href={siteMetadata.youtube}
              size={4}
              hoverColor="hover:text-[#FF0000]"
            />
          )}
          {siteMetadata.linkedin && (
            <SocialIcon
              kind="linkedin"
              href={siteMetadata.linkedin}
              size={4}
              hoverColor="hover:text-[#0A66C2]"
            />
          )}
          {siteMetadata.x && <SocialIcon kind="x" href={siteMetadata.x} size={6} />}
          {siteMetadata.instagram && (
            <SocialIcon
              kind="instagram"
              href={siteMetadata.instagram}
              size={4}
              hoverColor="hover:text-[#E1306C]"
            />
          )}
          <a
            href="https://wa.me/34602656578"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-gray-700 hover:text-[#25D366] dark:text-gray-200 dark:hover:text-[#25D366]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
        </div>

        {/* Other header controls */}
        {/* <SearchButton /> */}
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
