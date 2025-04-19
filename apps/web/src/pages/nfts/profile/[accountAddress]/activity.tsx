import Page from 'components/Layout/Page'
import { NftProfileLayout } from 'views/Profile'
import ActivityHistory from 'views/Profile/components/ActivityHistory'
import SubMenu from 'views/Profile/components/SubMenu'

const NftProfileActivityPage = () => {
  return (
    <Page>
      <SubMenu />
      <ActivityHistory />
    </Page>
  )
}

NftProfileActivityPage.Layout = NftProfileLayout

export default NftProfileActivityPage
