import { Box, Button, ChevronLeftIcon, Flex, useModal, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import MintModal from '../components/MintModal'
import { Collection } from 'state/nftMarket/types'

const BackLink = styled(NextLinkFromReactRouter)`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  font-weight: 600;
`

interface TopBarProps extends React.PropsWithChildren {
  collection: Collection
}

const TopBar: React.FC<TopBarProps> = ({collection}) => {
  const { t } = useTranslation()

  const [onPresentModal] = useModal(<MintModal collection={collection} />)

  return (
    <Flex alignItems="center" justifyContent="space-between" mb="24px">
      <BackLink to={`${nftsBaseUrl}/collections`}>
        <ChevronLeftIcon color="primary" width="24px" />
        {t('All Collections')}
      </BackLink>
      <Box>
        <Button onClick={onPresentModal}>Mint</Button>
      </Box>
    </Flex>
  )
}

export default TopBar
