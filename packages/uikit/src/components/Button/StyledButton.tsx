import { styled, DefaultTheme, css } from "styled-components";
import { space, layout, variant } from "styled-system";
import { scaleVariants, styleVariants } from "./theme";
import { BaseButtonProps } from "./types";

interface ThemedButtonProps extends BaseButtonProps {
  theme: DefaultTheme;
}

interface TransientButtonProps extends ThemedButtonProps {
  $isLoading?: boolean;
}

const getDisabledStyles = ({ $isLoading, theme }: TransientButtonProps) => {
  if ($isLoading === true) {
    return `
      &:disabled,
      &.pancake-button--disabled {
        cursor: not-allowed;
      }
    `;
  }

  return `
    &:disabled,
    &.pancake-button--disabled {
      background-color: ${theme.colors.backgroundDisabled};
      border-color: ${theme.colors.backgroundDisabled};
      box-shadow: inset 0 -6px 0 rgba(0,0,0,.16);
      color: ${theme.colors.textDisabled};
      cursor: not-allowed;
    }
  `;
};

/**
 * This is to get around an issue where if you use a Link component
 * React will throw a invalid DOM attribute error
 * @see https://github.com/styled-components/styled-components/issues/135
 */

const getOpacity = ({ $isLoading = false }: TransientButtonProps) => {
  return $isLoading ? ".5" : "1";
};

const StyledButton = styled("button").withConfig({
  shouldForwardProp: (props) => !["fullWidth"].includes(props),
})<BaseButtonProps>`
  position: relative;
  align-items: center;
  border: 0;
  border-radius: 50px;
  box-shadow: inset 0 -6px 0 rgba(0, 0, 0, 0.16);
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-weight: 600;
  justify-content: center;
  letter-spacing: 0.03em;
  line-height: 1;
  opacity: ${getOpacity};
  outline: 0;
  transition: background-color 0.2s, opacity 0.2s;

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  @media (hover: hover) {
    &:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
      opacity: 0.85;
    }
  }

  &:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
    box-shadow: inset 0 -8px 0 rgba(0, 0, 0, 0.16);
  }

  ${getDisabledStyles}
  ${variant({
    prop: "scale",
    variants: scaleVariants,
  })}
  ${variant({
    variants: styleVariants,
  })}
  ${layout}
  ${space}
  ${({ decorator, theme }) =>
    decorator &&
    css`
      &::before {
        content: "${decorator.text}";
        position: absolute;
        border-bottom: 20px solid ${decorator.backgroundColor ?? theme.colors.secondary};
        border-left: 34px solid transparent;
        border-right: 12px solid transparent;
        height: 0;
        top: -1px;
        right: -12px;
        width: 75px;
        text-align: center;
        padding-right: 30px;
        line-height: 20px;
        font-size: 12px;
        font-weight: 400;
        transform: rotate(31.17deg);
        color: ${decorator.color ?? "white"};
      }
    `}
`;

export default StyledButton;
