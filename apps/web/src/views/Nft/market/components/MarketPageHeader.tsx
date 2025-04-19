import { PageHeader, PageHeaderProps } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'

const MarketPageHeader: React.FC<React.PropsWithChildren<PageHeaderProps>> = (props) => {
  const { theme } = useTheme()
  const background = theme.colors.background
  return <PageHeader background={background} {...props} style={{ paddingBottom: '24px' }} />
}

export default MarketPageHeader
