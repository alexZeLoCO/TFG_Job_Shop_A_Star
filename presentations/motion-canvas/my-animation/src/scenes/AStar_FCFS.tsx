import { Reference, all, beginSlide, createRef } from "@motion-canvas/core";
import { Layout, Line, makeScene2D } from "@motion-canvas/2d";
import { State } from "./example";

export type Coordinates = { x: number; y: number };

export default makeScene2D(function* (view) {
  let universe: Reference<State>[][] = [];
  let horLayouts: Reference<Layout>[] = [];
  let paths: Coordinates[][] = [];
  let lines: Reference<Line>[][] = [];
  const nRows: number = 5;

  paths.push([]);
  lines.push([]);
  for (let i = 0; i < nRows; i++) {
    universe.push([]);
    for (let j = 0; j < nRows; j++) {
      universe[i].push(createRef<State>());
    }
    horLayouts.push(createRef<Layout>());
    paths[0].push({ x: i, y: i });
    if (i != 0) lines[0].push(createRef<Line>());
  }

  view.add(
    <Layout layout direction="column">
      {universe.map((row: Reference<State>[], idx: number) => {
        return (
          <Layout
            key={`Layout_${idx * 100}`}
            ref={horLayouts[idx]}
            layout
            direction="row"
          >
            {row.map((state: Reference<State>, stateIdx: number) => (
              <State
                key={`State_${idx * 100 + stateIdx}`}
                ref={state}
                layout
                margin={40}
              />
            ))}
          </Layout>
        );
      })}
    </Layout>
  );

  universe[0][0]().stroke("#32a852");
  universe[nRows - 1][nRows - 1]().stroke("#fcba03");

  paths.push([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ]);

  paths.push([
    { x: 0, y: 0 },
    { x: 0, y: 1 },
  ]);

  paths.push([
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ]);

  paths.push([
    { x: 1, y: 1 },
    { x: 1, y: 2 },
  ]);

  paths.push([
    { x: 2, y: 2 },
    { x: 3, y: 2 },
  ]);

  paths.push([
    { x: 2, y: 2 },
    { x: 2, y: 3 },
  ]);

  paths.push([
    { x: 3, y: 3 },
    { x: 4, y: 3 },
  ]);

  paths.push([
    { x: 3, y: 3 },
    { x: 3, y: 4 },
  ]);

  paths.slice(1).forEach((pathGroup: Coordinates[], i: number) => {
    lines.push([]);
    pathGroup.slice(1).map((_) => lines[i + 1].push(createRef<Line>()));
  });

  view.add(
    lines.flatMap((lineGroup: Reference<Line>[], lineGroupIdx: number) =>
      lineGroup.map((line: Reference<Line>, lineIdx: number) => (
        <Line
          key={`Line_${lineGroupIdx * 100 + lineIdx}`}
          ref={line}
          stroke="#fcba03"
          lineWidth={0}
        />
      ))
    )
  );

  lines.forEach((lineGroup: Reference<Line>[], lineGroupIdx: number) =>
    lineGroup.forEach((line: Reference<Line>, lineIdx: number) => {
      const currentCoords: Coordinates = paths[lineGroupIdx][lineIdx];
      const nextCoords: Coordinates = paths[lineGroupIdx][lineIdx + 1];
      line().points([
        [
          universe[currentCoords.y][currentCoords.x]().position.x(),
          horLayouts[currentCoords.y]().position.y(),
        ],
        [
          universe[nextCoords.y][nextCoords.x]().position.x(),
          horLayouts[nextCoords.y]().position.y(),
        ],
      ]);
    })
  );

  yield* beginSlide("CALCULATE PATH");
  yield* all(
    ...lines.flatMap((lineGroup: Reference<Line>[], lineGroupIdx: number) =>
      lineGroup.map((line: Reference<Line>) =>
        line().lineWidth(
          5,
          1 + (lineGroupIdx % 2 === 0 ? lineGroupIdx : lineGroupIdx + 1)
        )
      )
    ),
    ...paths.flatMap((pathGroup: Coordinates[], pathGroupIdx: number) =>
      pathGroup.map(({ x, y }: Coordinates) =>
        universe[x][y]().stroke(
          x === y && y === 0 ? "#32a852" : "#03fcf4",
          1 + (pathGroupIdx % 2 === 0 ? pathGroupIdx : pathGroupIdx + 1)
        )
      )
    ),
    universe[nRows - 1][nRows - 1]().stroke("#fcba03", 1)
  );
  yield* beginSlide("END SLIDE");
});
