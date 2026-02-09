import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

const shareUrl = (path: string) => `${siteMetadata.siteUrl}/${path}`

const whatsappUrl = (path: string) => `https://wa.me/?text=${encodeURIComponent(shareUrl(path))}`

const facebookUrl = (path: string) =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl(path))}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[] // kept for compatibility, not used
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { path, slug, date, title, tags } = content
  const basePath = path.split('/')[0]

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 text-center xl:pb-6">
            <div className="text-base font-medium text-gray-500 dark:text-gray-400">
              <time dateTime={date}>
                {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
              </time>
              {content.readingTime && (
                <>
                  <span> • </span>
                  <span>{Math.ceil(content.readingTime.minutes)} minutos de lectura</span>
                </>
              )}
            </div>
            <PageTitle>{title}</PageTitle>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-4 xl:gap-x-6">
            <div className="xl:col-span-3">
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">{children}</div>

              {/* SHARE LINKS */}
              <div className="space-x-4 pb-6 text-sm text-gray-700 dark:text-gray-300">
                <Link href={whatsappUrl(path)} rel="nofollow">
                  Compartir en WhatsApp
                </Link>
                <Link href={facebookUrl(path)} rel="nofollow">
                  Compartir en Facebook
                </Link>
              </div>

              {/* COMMENTS */}
              {siteMetadata.comments && (
                <div
                  className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <aside>
              <div className="divide-y divide-gray-200 text-sm font-medium dark:divide-gray-700">
                {tags && (
                  <div className="py-6">
                    <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Temas
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}

                {(prev || next) && (
                  <div className="space-y-6 py-6">
                    {prev && (
                      <div>
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          Artículo anterior
                        </h2>
                        <Link href={`/${prev.path}`}>{prev.title}</Link>
                      </div>
                    )}
                    {next && (
                      <div>
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          Artículo siguiente
                        </h2>
                        <Link href={`/${next.path}`}>{next.title}</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-6">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  ← Volver al blog
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
