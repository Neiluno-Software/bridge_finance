import { useState, useMemo, ReactNode } from 'react'
import shuffle from 'lodash/shuffle'
import { styled } from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import type SwiperCore from 'swiper'
import { ArrowBackIcon, ArrowForwardIcon, Box, IconButton, Text, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { safeGetAddress } from 'utils'
import useSWRImmutable from 'swr/immutable'
import { Address } from 'wagmi'
import { getNftsFromCollectionApi, getMarketDataForTokenIds } from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
import Trans from 'components/Trans'
import { CollectibleLinkCard } from '../../../components/CollectibleCard'

const INITIAL_SLIDE = 4

const SwiperCircle = styled.div<{ isActive }>`
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.secondary : theme.colors.textDisabled)};
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border-radius: 50%;
  cursor: pointer;
`

const StyledSwiper = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    .swiper-wrapper {
      max-height: 390px;
    }
  }
`

interface MoreFromThisCollectionProps {
  collectionAddress: string
  currentTokenName?: string
  title?: ReactNode
}

const MoreFromThisCollection: React.FC<React.PropsWithChildren<MoreFromThisCollectionProps>> = ({
  collectionAddress,
  currentTokenName = '',
  title = <Trans>More from this collection</Trans>,
}) => {
  const [swiperRef, setSwiperRef] = useState<SwiperCore | null>(null)
  const [activeIndex, setActiveIndex] = useState(1)
  const { isMobile, isMd, isLg } = useMatchBreakpoints()

  const checkSummedCollectionAddress = safeGetAddress(collectionAddress) || collectionAddress

  const { data: collectionNfts } = useSWRImmutable<NftToken[]>(
    checkSummedCollectionAddress
      ? ['nft', 'moreFromCollection', checkSummedCollectionAddress]
      : null,
    async () => {
      try {
        const nfts = await getNftsFromCollectionApi(collectionAddress, 100, 1)

        if (!nfts?.data) {
          return []
        }

        const tokenIds = Object.values(nfts.data).map((nft) => nft.tokenId)
        const nftsMarket = await getMarketDataForTokenIds(collectionAddress, tokenIds)

        return tokenIds.map((id) => {
          const apiMetadata = nfts.data[id]
          const marketData = nftsMarket.find((nft) => nft.tokenId === id)

          return {
            tokenId: id,
            name: apiMetadata.name,
            description: apiMetadata.description,
            collectionName: apiMetadata.collection.name,
            collectionAddress: collectionAddress as Address,
            image: apiMetadata.image,
            attributes: apiMetadata.attributes,
            marketData,
          }
        })
      } catch (error) {
        console.error(`Failed to fetch collection NFTs for ${collectionAddress}`, error)
        return []
      }
    },
  )

  const nftsToShow = useMemo(() => {
    const shuffled = shuffle(collectionNfts?.filter((nft) => nft.name !== currentTokenName && nft.marketData?.isTradable))
    return shuffled.slice(0, 12)
  }, [collectionNfts, currentTokenName])

  const [slidesPerView, maxPageIndex] = useMemo(() => {
    let slides
    let extraPages = 1
    if (isMd) {
      slides = 2
    } else if (isLg) {
      slides = 3
    } else {
      slides = 4
    }
    if (nftsToShow.length % slides === 0) {
      extraPages = 0
    }
    const maxPage = Math.max(Math.floor(nftsToShow.length / slides) + extraPages, 1)
    return [slides, maxPage]
  }, [isMd, isLg, nftsToShow?.length])

  if (!nftsToShow || nftsToShow.length === 0) {
    return null
  }

  const nextSlide = () => {
    if (activeIndex < maxPageIndex - 1) {
      setActiveIndex((index) => index + 1)
      swiperRef?.slideNext()
    }
  }

  const previousSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex((index) => index - 1)
      swiperRef?.slidePrev()
    }
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index / slidesPerView)
    swiperRef?.slideTo(index)
  }

  const updateActiveIndex = ({ activeIndex: newActiveIndex }) => {
    if (newActiveIndex !== undefined) setActiveIndex(Math.ceil(newActiveIndex / slidesPerView))
  }

  return (
    <Box pt="56px" mb="52px">
      {title && (
        <Text bold mb="24px">
          {title}
        </Text>
      )}
      {isMobile ? (
        <StyledSwiper>
          <Swiper spaceBetween={16} slidesPerView={1.5}>
            {nftsToShow.map((nft) => (
              <SwiperSlide key={nft.tokenId}>
                <CollectibleLinkCard nft={nft} />
              </SwiperSlide>
            ))}
          </Swiper>
        </StyledSwiper>
      ) : (
        <StyledSwiper>
          <Swiper
            onSwiper={setSwiperRef}
            onActiveIndexChange={updateActiveIndex}
            spaceBetween={16}
            slidesPerView={slidesPerView}
            slidesPerGroup={slidesPerView}
            initialSlide={INITIAL_SLIDE}
          >
            {nftsToShow.map((nft) => (
              <SwiperSlide key={nft.tokenId}>
                <CollectibleLinkCard
                  nft={nft}
                  currentAskPrice={parseFloat(nft?.marketData?.currentAskPrice)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <Flex mt="16px" alignItems="center" justifyContent="center">
            <IconButton variant="text" onClick={previousSlide}>
              <ArrowBackIcon />
            </IconButton>
            {[...Array(maxPageIndex).keys()].map((index) => (
              <SwiperCircle
                key={index}
                onClick={() => goToSlide(index * slidesPerView)}
                isActive={activeIndex === index}
              />
            ))}
            <IconButton variant="text" onClick={nextSlide}>
              <ArrowForwardIcon />
            </IconButton>
          </Flex>
        </StyledSwiper>
      )}
    </Box>
  )
}

export default MoreFromThisCollection
