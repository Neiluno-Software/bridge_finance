import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { NftProfileLayout } from 'views/Profile'
import SubMenu from 'views/Profile/components/SubMenu'
import UnconnectedProfileNfts from 'views/Profile/components/UnconnectedProfileNfts'
import UserNfts from 'views/Profile/components/UserNfts'
import { useNftsForAddress } from 'views/Nft/market/hooks/useNftsForAddress'
import Page from 'components/Layout/Page'

const NftProfilePage = () => {
  const { address: account } = useAccount()
  const accountAddress = useRouter().query.accountAddress as string
  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()

  const {
    nfts,
    isLoading: isNftLoading,
    refresh: refreshUserNfts,
  } = useNftsForAddress(accountAddress)

  return (
    <Page>
      <SubMenu />
      {isConnectedProfile ? (
        <UserNfts
          nfts={nfts}
          isLoading={isNftLoading}
          onSuccessSale={refreshUserNfts}
        />
      ) : (
        <UnconnectedProfileNfts nfts={nfts} isLoading={isNftLoading} />
      )}
    </Page>
  )
}

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
