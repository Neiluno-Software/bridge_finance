import { Card, Heading, PageHeader } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from '@pancakeswap/localization'
import ActivityHistory from '../ActivityHistory/ActivityHistory'

const Activity = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <Heading as="h1" scale="xl" color="primary" data-test="nft-activity-title">
        {t('Activity')}
      </Heading>
      <Card>
        <ActivityHistory />
      </Card>
    </Page>
  )
}

export default Activity
