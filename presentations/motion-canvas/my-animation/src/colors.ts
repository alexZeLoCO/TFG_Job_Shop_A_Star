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

const darkColors: ColorMap = {
  background: "#202020",
  alternativeBackground: "#404040",
  text: "#FFFFFF",
  green: "#32a852",
  orange: "#fb9f1a",
  cyan: "#03fcf4",
  red: "#A71D31",
  purple: "#C678DD",
  blue: "#61afef",
  yellow: "#e5c07b",
};

const brightColors = Object.fromEntries(
  Object.entries(darkColors).map(([key, value]) => [
    key,
    convertToBright(value),
  ])
);

export const colors: ColorMap =
  Config.THEME == "DARK" ? darkColors : brightColors;
