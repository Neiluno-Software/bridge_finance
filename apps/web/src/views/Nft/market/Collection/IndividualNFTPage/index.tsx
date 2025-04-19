import { useRouter } from 'next/router'
import PageLoader from 'components/Loader/PageLoader'
import { safeGetAddress } from 'utils'
import IndividualNFTPage from './OneOfAKindNftPage'

const IndividualNFTPageRouter = () => {
  const router = useRouter()
  // For PancakeBunnies tokenId in url is really bunnyId
  const { collectionAddress, tokenId } = router.query

  if (router.isFallback) {
    return <PageLoader />
  }

  return <IndividualNFTPage collectionAddress={safeGetAddress(collectionAddress as string)} tokenId={String(tokenId)} />
}

export default IndividualNFTPageRouter
