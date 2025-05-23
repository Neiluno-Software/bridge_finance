import { styled } from 'styled-components'

const StyledBannerImageWrapper = styled.div`
  ${({ theme }) => `background-color: ${theme.colors.cardBorder}`};
  flex: none;
  position: relative;
  width: 100%;
  height: 123px;
  overflow: hidden;
  border: 1px solid #F00;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 192px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    height: 256px;
  }
`

export default StyledBannerImageWrapper
