import { Box, Flex, Text, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useDomainNameForAddress } from 'hooks/useDomain'

const StyledFlex = styled(Flex)`
  align-items: center;
  transition: opacity 200ms ease-in;

  &:hover {
    opacity: 0.5;
  }
`

const ProfileCell: React.FC<React.PropsWithChildren<{ accountAddress: string }>> = ({ accountAddress }) => {
  const { domainName } = useDomainNameForAddress(accountAddress)

  return (
    <NextLinkFromReactRouter to={`/nfts/profile/${accountAddress}`}>
      <StyledFlex>
        <Box display="inline">
          <Text lineHeight="1.25">{domainName || truncateHash(accountAddress)}</Text>
        </Box>
      </StyledFlex>
    </NextLinkFromReactRouter>
  )
}

export default ProfileCell
