import {
  InstagramIcon,
  GithubIcon,
  FacebookIcon,
  TwitterIcon,
  YoutubeIcon,
  TikTokIcon,
  Text,
  NextLinkFromReactRouter,
} from '@pancakeswap/uikit'
import styled from 'styled-components'

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 12px;
  z-index: 1;
  margin-bottom: 10px;
  @media screen and (max-width: 851px) {
    margin-bottom: 60px;
  }
`

const SocialLinks = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  row-gap: 15px;
  column-gap: 30px;
  padding: 24px;
  flex-wrap: wrap;
  @media screen and (max-width: 499px) {
    row-gap: 10px;
    column-gap: 20px;
  }

  a {
    border: 1px solid gray;
    border-radius: 100%;
    padding: 10px;
    width: 42px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s border;
    &:hover {
      border: 1px solid white;
    }
  }
`

const BottomMenu = () => {
  return (
    <MenuContainer>
      <SocialLinks>
        <a href="https://twitter.com/Bridge3788366" target="_blank" rel="noreferrer">
          <TwitterIcon cursor="pointer" />
        </a>
        <a href="https://www.facebook.com/bridge3.finance" target="_blank" rel="noreferrer">
          <FacebookIcon cursor="pointer" />
        </a>
        <a href="https://www.youtube.com/@bridge3.finance" target="_blank" rel="noreferrer">
          <YoutubeIcon cursor="pointer" />
        </a>
        <a href="https://github.com/Bridge3-Finance" target="_blank" rel="noreferrer">
          <GithubIcon cursor="pointer" />
        </a>
        <a href="https://www.instagram.com/bridge3.finance" target="_blank" rel="noreferrer">
          <InstagramIcon cursor="pointer" />
        </a>
        <a href="https://www.tiktok.com/@bridge3.finance" target="_blank" rel="noreferrer">
          <TikTokIcon cursor="pointer" />
        </a>
      </SocialLinks>
      <Text>©2024 Bridge3</Text>
    </MenuContainer>
  )
}

export default BottomMenu
