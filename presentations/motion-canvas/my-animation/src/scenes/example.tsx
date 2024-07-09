import {
  makeScene2D,
  Circle,
  Rect,
  RectProps,
  Txt,
  Code,
  CircleProps,
} from "@motion-canvas/2d";
import { Reference, all, beginSlide, createRef } from "@motion-canvas/core";

export type State = Circle;

export const State = (props?: CircleProps) => {
  return (
    <Circle
      width={100}
      height={100}
      stroke="#A0A0A0"
      fill="#202020"
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
      fill="#202020"
      lineWidth={5}
      width={1000}
      height={150}
    >
      <Txt fill="#ffffff">Open Set</Txt>
    </Rect>
  );
};

export default makeScene2D(function* (view) {
  const openSet = createRef<OpenSet>();
  const startingState = createRef<State>();
  const processState = createRef<Rect>();

  const neighbors = [
    createRef<State>(),
    createRef<State>(),
    createRef<State>(),
  ];

  view.add(<OpenSet ref={openSet} y={-400} />);
  view.add(<State ref={startingState} y={-400} x={-400} />);

  neighbors.forEach((neighbor: Reference<State>) =>
    view.add(<State ref={neighbor} />)
  );

  view.add(
    <Rect
      ref={processState}
      radius={25}
      fill="#202020FF"
      stroke="#FB9F1AA0"
      lineWidth={5}
      width={500}
      height={150}
    >
      <Code fontSize={28} code={"node->getNeighbors()"} />
    </Rect>
  );

  yield* beginSlide("LOAD STARTING STATE");

  yield* all(
    startingState().position.x(-700, 1).to(0, 2),
    startingState().position.y(0, 3)
  );
  yield* beginSlide("ADD NEIGHBORS TO OPEN SET");
  yield* all(
    ...neighbors.map((neighbor: Reference<State>, idx: number) =>
      neighbor()
        .position.x(0, 1 + idx)
        .to(700, 2)
        .to(-400 + 200 * idx, 2)
    ),
    ...neighbors.map((neighbor: Reference<State>, idx: number) =>
      neighbor()
        .position.y(0, 2 + idx)
        .to(-400, 2)
    )
  );
  yield* beginSlide("END SLIDE");
});
