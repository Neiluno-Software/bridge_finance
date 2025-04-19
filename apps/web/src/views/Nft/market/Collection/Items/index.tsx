import { useRouter } from 'next/router'
import { useGetCollection } from 'state/nftMarket/hooks'
import CollectionWrapper from './CollectionWrapper'

const Items = () => {
  const collectionAddress = useRouter().query.collectionAddress as string
  const collection = useGetCollection(collectionAddress)

  return (
    <>
      <CollectionWrapper collection={collection} />
    </>
  )
}

export default Items
