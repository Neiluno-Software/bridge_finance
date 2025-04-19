import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { useModal, Box, AtomBox } from '@pancakeswap/uikit'
import BottomNav from '@pancakeswap/uikit/components/BottomNav'
import { useRouter } from 'next/router'
import { useMobileMenuItems } from './hooks/useMobileMenuItems'
import { useMenuItems } from './hooks/useMenuItems'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import LeftMenu from './LeftMenu'
import TopMenu from './TopMenu'
import BottomMenu from './BottomMenu'

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
`

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
  max-width: 100vw;

  @media screen and (max-width: 851px) {
    padding-left: 0px;
    padding-top: 76px;
  }
`

const Inner = styled.div`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  padding: 8px;
  max-width: 100%;
  margin-bottom: 50px;
  @media screen and (max-width: 499px) {
    margin-bottom: 10px;
  }
`

const Menu = (props) => {
  const { pathname } = useRouter()

  const menuItems = useMenuItems()
  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })

  const mobileMenuItems = useMobileMenuItems()
  const activeMobileMenuItem = getActiveMenuItem({ menuConfig: mobileMenuItems, pathname })

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {/* <LeftMenu menuItems={menuItems} activeItem={activeMenuItem} /> */}
      <TopMenu menuItems={menuItems} activeItem={activeMenuItem} />

      <Flex>
        <BodyWrapper>
          <Inner>{props.children}</Inner>
        </BodyWrapper>
        <BottomMenu />
      </Flex>
      <AtomBox display={{ xs: 'block', md: 'none' }}>
        <BottomNav items={mobileMenuItems} activeItem={activeMobileMenuItem?.href} />
      </AtomBox>
    </div>
  )
}

export default Menu
