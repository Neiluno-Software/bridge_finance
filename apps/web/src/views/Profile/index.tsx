import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useRouter } from 'next/router'
import { safeGetAddress } from 'utils'
import NoNftsImage from '../Nft/market/components/Activity/NoNftsImage'


const NftProfile: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const accountAddress = useRouter().query.accountAddress as string
  const { t } = useTranslation()

  const invalidAddress = !accountAddress || safeGetAddress(accountAddress) === undefined

  if (invalidAddress) {
    return (
      <>
        <Page style={{ minHeight: 'auto' }}>
          <Flex p="24px" flexDirection="column" alignItems="center">
            <NoNftsImage />
            <Text textAlign="center" maxWidth="420px" pt="8px" bold>
              {t('Please enter a valid address, or connect your wallet to view your profile')}
            </Text>
          </Flex>
        </Page>
      </>
    )
  }

  return (
    <>
      {children}
    </>
  )
}

export const NftProfileLayout: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return <NftProfile>{children}</NftProfile>
}

export default NftProfile
