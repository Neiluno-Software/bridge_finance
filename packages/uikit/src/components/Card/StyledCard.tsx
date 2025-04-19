import shouldForwardProp from "@styled-system/should-forward-prop";
import { styled, css, DefaultTheme } from "styled-components";
import { space } from "styled-system";
import { promotedGradient } from "../../util/animationToolkit";
import { Box } from "../Box";
import { CardProps } from "./types";

interface StyledCardProps extends CardProps {
  theme: DefaultTheme;
}

/**
 * Priority: Warning --> Success --> Active
 */
const getBorderColor = ({ isActive, isSuccess, isWarning, borderBackground, theme }: StyledCardProps) => {
  if (borderBackground) {
    return borderBackground;
  }
  if (isWarning) {
    return theme.colors.warning;
  }

  if (isSuccess) {
    return theme.colors.success;
  }

  if (isActive) {
    return `linear-gradient(180deg, ${theme.colors.primaryBright}, ${theme.colors.secondary})`;
  }

  return theme.colors.cardBorder;
};

export const StyledCard = styled.div.withConfig({
  shouldForwardProp,
})<StyledCardProps>`
  // background: ${getBorderColor};
  color: ${({ theme, isDisabled }) => theme.colors[isDisabled ? "textDisabled" : "text"]};
  overflow: hidden;
  position: relative;
  border-radius: 20px;

  ${({ isActive }) =>
    isActive &&
    css`
      animation: ${promotedGradient} 3s ease infinite;
      background-size: 400% 400%;
    `}

  padding: 2px;

  .card-bg {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
  }

  ${space}
`;

export const StyledCardInner = styled(Box)<{ background?: string; hasCustomBorder: boolean }>`
  z-index: 2;
  width: 100%;
  height: 100%;
  overflow: ${({ hasCustomBorder }) => (hasCustomBorder ? "initial" : "inherit")};
  background: #141414;
  background-image: ${({ theme, background }) => background ?? null};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
`;

StyledCard.defaultProps = {
  isActive: false,
  isSuccess: false,
  isWarning: false,
  isDisabled: false,
};
