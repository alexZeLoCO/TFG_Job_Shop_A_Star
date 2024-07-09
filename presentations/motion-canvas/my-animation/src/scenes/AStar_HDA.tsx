import { Reference, all, beginSlide, createRef } from "@motion-canvas/core";
import { Code, Layout, Line, makeScene2D, Rect } from "@motion-canvas/2d";
import { OpenSet, State } from "./example";
import { colors } from "../colors";

export type Coordinates = { x: number; y: number };

export default makeScene2D(function* (view) {
  const openSetsXPos: number = -400;
  const getNeighborsBoxXPos: number = openSetsXPos + 1000;
  const lineEndLimit: number = getNeighborsBoxXPos + 450;
  const lineStartLimit: number = -1100;
  const openSetsYPos: number[] = [-600, -200, 200, 600];
  const openSetsColors: string[] = [
    colors.orange,
    colors.green,
    colors.cyan,
    colors.red,
  ];

  const startingState: Reference<State> = createRef<State>();
  const nextStates: Reference<State>[][] = [
    [
      createRef<State>(),
      createRef<State>(),
      createRef<State>(),
      createRef<State>(),
    ],
    [createRef<State>(), createRef<State>()],
  ];

  view.add(
    <Layout>
      {openSetsYPos.map((openSetYPos: number, idx: number) => {
        const offset: number = 0;
        return (
          <>
            <Line
              lineWidth={5}
              stroke={openSetsColors[idx]}
              points={[
                [lineStartLimit, openSetYPos],
                [lineEndLimit, openSetYPos],
              ]}
            />
            <OpenSet
              key={`OpenSet_${openSetYPos}`}
              stroke={openSetsColors[idx]}
              x={openSetsXPos}
              y={openSetYPos}
            />
            <Rect
              x={getNeighborsBoxXPos}
              y={openSetYPos}
              radius={25}
              fill="#202020"
              stroke={openSetsColors[idx]}
              lineWidth={5}
              width={500}
              height={150}
            >
              <Code fontSize={28} code={"node->getNeighbors()"} />
            </Rect>
          </>
        );
      })}
    </Layout>
  );

  view.add(
    <State
      ref={startingState}
      stroke={openSetsColors[0]}
      x={openSetsXPos + 400}
      y={openSetsYPos[0]}
    />
  );

  view.add(
    <>
      <State
        ref={nextStates[0][0]}
        stroke={openSetsColors[0]}
        x={getNeighborsBoxXPos}
        y={openSetsYPos[0]}
      />
      <State
        ref={nextStates[0][1]}
        stroke={openSetsColors[1]}
        x={getNeighborsBoxXPos}
        y={openSetsYPos[0]}
      />
      <State
        ref={nextStates[0][2]}
        stroke={openSetsColors[2]}
        x={getNeighborsBoxXPos}
        y={openSetsYPos[0]}
      />
      <State
        ref={nextStates[0][3]}
        stroke={openSetsColors[0]}
        x={getNeighborsBoxXPos}
        y={openSetsYPos[0]}
      />
    </>
  );

  view.add(
    openSetsYPos.map((openSetYPos: number, idx: number) => {
      return (
        <Rect
          key={`GetNeighborsRect_${idx + 1}`}
          x={getNeighborsBoxXPos}
          y={openSetYPos}
          radius={25}
          fill="#202020"
          stroke={openSetsColors[idx]}
          lineWidth={5}
          width={500}
          height={150}
        >
          <Code fontSize={28} code={"node->getNeighbors()"} />
        </Rect>
      );
    })
  );

  yield* beginSlide("START SLIDE");
  yield* startingState().position.x(getNeighborsBoxXPos, 1);
  yield* all(
    ...nextStates[0].map((nextStateRef: Reference<State>) =>
      nextStateRef().position.x(lineEndLimit, 1)
    )
  );

  // TODO: Fix the timing on these bastards

  yield* all(
    nextStates[0][0]().position.y(-400, 1),
    nextStates[0][1]().position.y(-400, 1),
    nextStates[0][2]().position.y(0, 1),
    nextStates[0][3]().position.y(-400, 1)
  );
  yield* all(
    nextStates[0][0]().position.x(lineStartLimit, 1),
    nextStates[0][1]().position.x(lineStartLimit, 1),
    nextStates[0][2]().position.x(lineStartLimit, 1),
    nextStates[0][3]().position.x(lineStartLimit, 1)
  );
  yield* all(
    nextStates[0][0]().position.y(openSetsYPos[0], 1),
    nextStates[0][1]().position.y(openSetsYPos[1], 1),
    nextStates[0][2]().position.y(openSetsYPos[2], 1),
    nextStates[0][3]().position.y(openSetsYPos[0], 1)
  );
  yield* all(
    nextStates[0][0]().position.x(openSetsXPos + 400, 1),
    nextStates[0][1]().position.x(openSetsXPos + 400, 1),
    nextStates[0][2]().position.x(openSetsXPos + 400, 1),
    nextStates[0][3]().position.x(openSetsXPos + 200, 1)
  );
});
