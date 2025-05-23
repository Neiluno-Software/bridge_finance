import { scales, variants } from "./types";
import { vars } from "../../css/vars.css";

export const scaleVariants = {
  [scales.MD]: {
    height: "40px",
    padding: "0 24px",
    fontSize: "14px",
  },
  [scales.SM]: {
    height: "36px",
    padding: "0 16px",
  },
  [scales.XS]: {
    height: "20px",
    fontSize: "12px",
    padding: "0 8px",
  },
};

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: "#eb382d",
    color: "#fff",
  },
  [variants.SECONDARY]: {
    backgroundColor: "transparent",
    border: "2px solid",
    borderColor: "primary",
    boxShadow: "none",
    color: "white",
  },
  [variants.TERTIARY]: {
    backgroundColor: "tertiary",
    boxShadow: "none",
    color: "primary",
  },
  [variants.SUBTLE]: {
    backgroundColor: "textSubtle",
    color: "backgroundAlt",
  },
  [variants.DANGER]: {
    backgroundColor: "failure",
    color: "white",
  },
  [variants.SUCCESS]: {
    backgroundColor: "success",
    color: "white",
  },
  [variants.TEXT]: {
    backgroundColor: "transparent",
    color: "primary",
    boxShadow: "none",
  },
  [variants.LIGHT]: {
    backgroundColor: "input",
    color: "textSubtle",
    boxShadow: "none",
  },
  [variants.BUBBLEGUM]: {
    background: vars.colors.gradientBubblegum,
    color: "textSubtle",
    boxShadow: "none",
    ":disabled": {
      background: vars.colors.disabled,
    },
  },
};
