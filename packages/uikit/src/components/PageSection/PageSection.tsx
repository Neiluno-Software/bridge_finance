import { useMemo } from "react";
import { styled } from "styled-components";
import { Container } from "../Layouts";
import { Box, BoxProps, Flex, FlexProps } from "../Box";
import { ClipFill, DividerFill } from "./types";

interface PageSectionProps extends BackgroundColorProps {
  svgFill?: string;
  dividerComponent?: React.ReactNode;
  hasCurvedDivider?: boolean;
  dividerPosition?: "top" | "bottom";
  concaveDivider?: boolean;
  containerProps?: BoxProps;
  innerProps?: BoxProps;
  clipFill?: ClipFill;
  dividerFill?: DividerFill;
}

interface BackgroundColorProps extends FlexProps {
  index: number;
  padding?: string;
}

const BackgroundColor = styled(Flex).attrs({ className: "page-bg" as string })<BackgroundColorProps>`
  position: relative;
  flex-direction: column;
  align-items: center;
  z-index: ${({ index }) => index - 1};
  padding: ${({ padding }) => padding};
`;

const ChildrenWrapper = styled(Container)`
  min-height: auto;
  padding: 8px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 24px;
    padding-bottom: 0px;
    overflow: hidden;
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    overflow: visible;
  }
`;

const PageSection: React.FC<React.PropsWithChildren<PageSectionProps>> = ({
  children,
  svgFill,
  index = 1,
  dividerComponent,
  dividerPosition = "bottom",
  hasCurvedDivider = true,
  concaveDivider = false,
  clipFill,
  dividerFill,
  containerProps,
  innerProps,
  ...props
}) => {
  return (
    <Box>
      <BackgroundColor index={index} {...props}>
        <ChildrenWrapper {...innerProps}>{children}</ChildrenWrapper>
      </BackgroundColor>
    </Box>
  );
};

export default PageSection;
