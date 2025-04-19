import { styled } from 'styled-components'
import { NextSeo } from 'next-seo'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import { DEFAULT_META, getCustomMeta } from 'config/constants/meta'
import Container from './Container'

const StyledPage = styled(Container)`
  width: 100%;
  padding-top: 16px;
  padding-bottom: 16px;
  max-width: 1200px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 88px;
    padding-bottom: 24px;
  }
`

export const PageMeta: React.FC<React.PropsWithChildren> = () => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { pathname } = useRouter()

  const pageMeta = getCustomMeta(pathname, t, locale)

  if (!pageMeta) {
    return null
  }

  const { description, image } = { ...DEFAULT_META, ...pageMeta }

  return (
    <NextSeo
      title={pageMeta.title}
      description={description}
      openGraph={
        image
          ? {
              images: [{ url: image, alt: pageMeta?.title, type: 'image/png' }],
            }
          : undefined
      }
    />
  )
}

const Page: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = ({ children, ...props }) => {
  return (
    <>
      <PageMeta />
      <StyledPage {...props}>{children}</StyledPage>
    </>
  )
}

export default Page
