import { useEffect } from 'react'
import { Flex, ThemeSwitcher, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import UserMenu from '../UserMenu'
import useTheme from 'hooks/useTheme'

const MenuContainer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 70px;
  width: 100%;
  padding: 0 12px;
  z-index: 1;
  transition: all 0.6s ease;
  background: transparent;
  border-bottom: 1px solid transparent;

  &.sticky {
    background: #060201e0;
    border-bottom: 1px solid #141414;
  }
`
const MobileMenu = styled.div`
  flex-grow: 1;

  & img {
    width: 48px;
    height: 48px;
  }
  & svg {
    width: 48px;
    height: 48px;
  }

  @media screen and (min-width: 851px) {
    display: none;
  }
`

const MenuItem = styled.div`
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1rem;
  padding: 1rem 1.5rem;
  transition: 0.3s background;

  &.active {
    &::after {
      content: '';
      position: absolute;
      width: 80px;
      height: 4px;
      border-radius: 40px;
      background: #eb382d;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
  }

  &:hover {
  }

  @media screen and (max-width: 851px) {
    display: none;
  }
`

const BrandImage = styled.img`
  width: 150px;
  padding: 0px;
  @media screen and (max-width: 851px) {
    display: none;
  }
`

const LinkComponent = (linkProps: any) => {
  return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
}

const TopMenu = ({ menuItems, activeItem }) => {
  const { isDark, setTheme } = useTheme()

  useEffect(() => {
    const header = document.getElementById('myHeader')
    const sticky = header.offsetTop

    const scrollCallBack = () => {
      if (window.pageYOffset > sticky) {
        header.classList.add('sticky')
      } else {
        header.classList.remove('sticky')
      }
    }

    // Specify the event type (Event) for the callback function
    const options: boolean | AddEventListenerOptions = true
    window.addEventListener('scroll', scrollCallBack, options)

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', scrollCallBack, options)
    }
  }, [])

  return (
    <MenuContainer id="myHeader">
      <MobileMenu>
        <img src="/images/mobile-logo.png" alt="logo" />
      </MobileMenu>
      <Flex justifyContent="space-between" width="100%" alignItems="center">
        <Flex justifyContent="space-between" px="20px" py="12px">
          <BrandImage src="/images/logo.png" />
        </Flex>

        <Flex style={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <LinkComponent href={item.href} key={item.label}>
              <MenuItem className={item === activeItem ? 'active' : ''}>{item.label}</MenuItem>
            </LinkComponent>
          ))}
        </Flex>

        <Flex>
          <NetworkSwitcher />
          <UserMenu />
          {/* <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} /> */}
        </Flex>
      </Flex>
    </MenuContainer>
  )
}

export default TopMenu
