import { createGlobalStyle } from 'styled-components'
import { PancakeTheme } from '@pancakeswap/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Inter';
  }
  
  html, body, #__next {
    min-height: 100%;
    min-width: 100%;
    display: flex;
  }

  body {
    background-image: url('/images/background.png');
    // background-image: url('/images/spark1.gif');
    background-color: #000000;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    img {
      height: auto;
      max-width: 100%;
    }

    .body-wrapper {
      width: 100%;
      height: 100%;
      // background-image: url('/images/background.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
  }

  #__next {
    position: relative;
    z-index: 1;
  }

  #portal-root {
    position: relative;
    z-index: 2;
  }
`

export default GlobalStyle
