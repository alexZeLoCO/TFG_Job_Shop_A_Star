import {
  Circle,
  CircleProps,
  Code,
  Rect,
  RectProps,
  Txt,
} from "@motion-canvas/2d";
import { colors } from "../colors";

export type State = Circle;

export const State = (props?: CircleProps) => {
  return (
    <Circle
      width={100}
      height={100}
      stroke={colors.text}
      fill={colors.alternativeBackground}
      lineWidth={5}
      {...props}
    />
  );
};

export type OpenSet = Rect;

export const OpenSet = (props?: RectProps) => {
  return (
    <Rect
      {...props}
      radius={25}
      fill={colors.alternativeBackground}
      stroke={props.stroke || colors.text}
      lineWidth={5}
      width={1000}
      height={150}
    >
      <Txt fill={colors.text}>Open Set</Txt>
    </Rect>
  );
};

export type NeighborFunction = Rect;

export const NeighborsFunction = (props?: RectProps) => {
  return (
    <Rect
      radius={props.radius || 25}
      fill={props.fill || colors.alternativeBackground}
      stroke={props.stroke || colors.text}
      lineWidth={5}
      width={500}
      height={150}
      {...props}
    >
      <Code fontSize={props.fontSize || 28} code={"node.getNeighbors()"} />
    </Rect>
  );
};
