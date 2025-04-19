import { Box, BoxProps } from '@pancakeswap/uikit'

const Container: React.FC<React.PropsWithChildren<BoxProps>> = ({ children, ...props }) => (
  <Box px={['4px', '8px', '16px', '24px']} mx="auto" {...props}>
    {children}
  </Box>
)

export default Container
