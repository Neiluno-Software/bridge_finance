import { Card, CardBody, Heading, PrizeIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Achievement } from 'state/types'
import AchievementsList from './AchievementsList'
import ClaimPointsCallout from './ClaimPointsCallout'

const Achievements: React.FC<
  React.PropsWithChildren<{
    achievements: Achievement[]
    isLoading: boolean
    points?: number
    onSuccess?: () => void
  }>
> = ({ achievements, isLoading, points = 0, onSuccess = null }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardBody>
        <Heading as="h4" scale="md" mb="16px">
          {t('Achievements')}
        </Heading>
        <AchievementsList achievements={achievements} isLoading={isLoading} />
      </CardBody>
    </Card>
  )
}

export default Achievements
