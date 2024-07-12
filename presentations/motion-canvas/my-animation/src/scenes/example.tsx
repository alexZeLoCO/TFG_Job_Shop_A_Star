import { makeScene2D, Rect } from "@motion-canvas/2d";
import { Reference, all, beginSlide, createRef } from "@motion-canvas/core";
import { NeighborsFunction, OpenSet, State } from "../components/diagrams";

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

  view.add(<NeighborsFunction ref={processState} />);

  yield* beginSlide("LOAD STARTING STATE");

  yield* all(
    startingState().position.x(-700, 1).to(0, 2),
    startingState().position.y(0, 3)
  );
  yield* beginSlide("ADD NEIGHBORS TO OPEN SET");
  yield *
    all(
      ...neighbors.map((neighbor: Reference<State>, idx: number) =>
        neighbor()
          .position.x(0, idx / 2 + 1)
          .to(700, idx / 2 + 1.5)
          .to(-400 + 200 * idx, idx / 2 + 2)
      ),
      ...neighbors.map((neighbor: Reference<State>, idx: number) =>
        neighbor()
          .position.y(0, idx / 2 + 1.5)
          .to(-400, idx / 2 + 2)
      )
    );
  yield* beginSlide("END SLIDE");
});
