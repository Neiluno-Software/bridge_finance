import { useEffect, useState } from 'react'
import { Card, FlexGap, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import BlockBox from 'components/BlockBox'
import { Wrapper } from './styles'
import TransactionRow from './TransactionRow'
import { useBridgeHistory } from '../hooks'

const TabButton = styled.div`
  color: #f2f2f2;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 700;
  font-size: 12px;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  cursor: pointer;
  background-color: #202020;
  transition: 0.3s background-color;

  &:hover {
    background-color: #413c3b;
  }

  &.active {
    background-color: #413c3b;
  }
`

enum Type {
  ALL,
  PROGRESS,
  COMPLETED,
  FAILED,
}

export default function BridgeHistory() {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const [type, setType] = useState(Type.ALL)

  const { data: transactions } = useBridgeHistory()
  const [counts, setCounts] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
  })

  useEffect(() => {
    if (!transactions) {
      setCounts({
        total: 0,
        inProgress: 0,
        completed: 0,
      })
      return
    }
    const _inProgress = transactions.filter((tx) => tx.status === 0)
    const _completed = transactions.filter((tx) => tx.status === 1)
    setCounts({
      total: transactions.length,
      inProgress: _inProgress.length,
      completed: _completed.length,
    })
  }, [transactions])

  return (
    <Wrapper style={{ minHeight: '412px', width: '100%' }}>
      <Card style={{ width: '100%', height: '100%' }}>
        <FlexGap flexDirection="column" p={isMobile ? 10 : 24} height="100%">
          <Text fontSize={20} bold>
            History
          </Text>
          <FlexGap gap="8px" flexWrap="wrap" mt={24}>
            <TabButton className={type === Type.ALL ? 'active' : ''} onClick={() => setType(Type.ALL)}>
              {t('All')}({counts.total})
            </TabButton>
            <TabButton className={type === Type.PROGRESS ? 'active' : ''} onClick={() => setType(Type.PROGRESS)}>
              {t('In Progress')}({counts.inProgress})
            </TabButton>
            <TabButton className={type === Type.COMPLETED ? 'active' : ''} onClick={() => setType(Type.COMPLETED)}>
              {t('Completed')}({counts.completed})
            </TabButton>
            {/* <TabButton className={type === Type.FAILED ? 'active' : ''} onClick={() => setType(Type.FAILED)}>
              {t('Failed')} / {t('Cancelled')}(0)
            </TabButton> */}
          </FlexGap>
          <BlockBox mt={24} height="100%" maxHeight="400px" overflow="auto">
            {!transactions || transactions.length === 0 ? (
              'No History'
            ) : (
              <>
                {transactions.map((tx) => {
                  if (type === Type.PROGRESS && tx.status === 1) return null
                  if (type === Type.COMPLETED && tx.status === 0) return null
                  return <TransactionRow data={tx} />
                })}
              </>
            )}
          </BlockBox>
        </FlexGap>
      </Card>
    </Wrapper>
  )
}
