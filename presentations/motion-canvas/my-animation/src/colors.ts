import { Config } from "./Config";

function convertToBright(color: string) {
  return `#${(
    0xffffff - parseInt(color.startsWith("#") ? color.slice(1) : color, 16)
  )
    .toString(16)
    .padStart(6, "0")
    .toUpperCase()}`;
}

export type ColorMap = { [key: string]: string };

// DarkGray is 64,64,64
// BrightGray is 239,239,239
export const pureColors: ColorMap = {
  darkGray: "#202020",
  brightGray: "#EFEFEF",
  lightGray: "#404040",
  black: "#000000",
  white: "#ffffff",
  green: "#32a852",
  deepBurgundy: "#660033",
  slate: "#333366",
  orange: "#fb9f1a",
  cyan: "#03fcf4",
  red: "#E06C75",
  purple: "#C678DD",
  blue: "#61afef",
  yellow: "#e5c07b",
};

const darkColors: ColorMap = {
  background: pureColors.darkGray,
  alternativeBackground: pureColors.lightGray,
  text: pureColors.white,
  green: pureColors.green,
  orange: pureColors.orange,
  cyan: pureColors.cyan,
  red: pureColors.red,
  purple: pureColors.purple,
  blue: pureColors.blue,
  yellow: pureColors.yellow,
};

const brightColors = Object.fromEntries(
  Object.entries(darkColors).map(([key, value]) => [
    key,
    convertToBright(value),
  ])
);

export const colors: ColorMap =
  Config.THEME == "DARK" ? darkColors : brightColors;
