import { Txt, TxtProps } from "@motion-canvas/2d";
import { colors } from "../colors";

export const Title = (props: TxtProps) => (
  <Txt
    x={props.x || 0}
    y={props.y || -600}
    fontFamily={props.fontFamily || "monospaced"}
    fontSize={props.fontSize || 75}
    text={props.text}
    fill={props.fill || colors.text}
    {...props}
  />
);
