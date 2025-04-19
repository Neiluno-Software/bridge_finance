import React from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Card, Flex, Text } from '@pancakeswap/uikit'

export default function StakerList() {
  const { t } = useTranslation()

  return (
    <>
      <Text fontSize={22} bold mt={20}>
        {t('Stakers')}
      </Text>
      <Card mt={12}>
        <Flex p={24} flexDirection="column">
          STaker
        </Flex>
      </Card>
    </>
  )
}
