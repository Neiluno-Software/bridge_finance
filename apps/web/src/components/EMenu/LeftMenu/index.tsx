import { DiscordIcon, Flex, GithubIcon, TelegramIcon, TwitterIcon, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import styled from 'styled-components'

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 256px;
  font-size: 12px;
  font-weight: 700;
  z-index: 2;
  background: #000000a0;
  border-right: 1px solid #ff0000;

  @media screen and (max-width: 851px) {
    display: none;
  }
`

const BrandImage = styled.img`
  padding: 0px 24px;
  @media screen and (max-width: 499px) {
    display: none;
  }
`
const MenuItem = styled.div`
  padding: 8px 0 8px 32px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  border-left: 3px solid transparent;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  transition: 0.3s background;

  &.active {
    border-color: #ff0000;
  }

  &:hover {
    border-left-color: #ff0000;
  }

  @media screen and (max-width: 851px) {
    display: none;
  }
`

const SocialLinks = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  padding: 24px;

  @media screen and (max-width: 851px) {
    display: none;
  }
`

const LinkComponent = (linkProps: any) => {
  return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
}

const LeftMenu = ({ menuItems, activeItem }) => {
  return (
    <MenuContainer>
      <Flex justifyContent="space-between" px="20px" py="12px">
        <BrandImage src="/images/logo.png" />
      </Flex>

      <Flex flexDirection="column" mt={10} style={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <LinkComponent href={item.href} key={item.label}>
            <MenuItem className={item === activeItem ? 'active' : ''}>{item.label}</MenuItem>
          </LinkComponent>
        ))}
      </Flex>

      <SocialLinks>
        <a href="https://discord.gg/PmWGn2UmdJ" target="_blank" rel="noreferrer">
          <DiscordIcon cursor="pointer" />
        </a>
        <a href="https://t.me/orb3portal" target="_blank" rel="noreferrer">
          <TelegramIcon cursor="pointer" />
        </a>
        <a href="https://twitter.com/Orb3Tech" target="_blank" rel="noreferrer">
          <TwitterIcon cursor="pointer" />
        </a>
        <a href="https://github.com/orb3-protocol" target="_blank" rel="noreferrer">
          <GithubIcon cursor="pointer" />
        </a>
      </SocialLinks>
    </MenuContainer>
  )
}

export default LeftMenu
