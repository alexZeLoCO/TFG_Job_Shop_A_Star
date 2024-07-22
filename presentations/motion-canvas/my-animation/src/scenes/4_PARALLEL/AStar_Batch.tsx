import { Reference, all, beginSlide, createRef } from "@motion-canvas/core";
import { Layout, Line, makeScene2D } from "@motion-canvas/2d";
import { colors } from "@colors";
import { Title } from "@components/title";
import { State } from "@components/diagrams";
import { Ready } from "@components/Ready";
import { warningBeginSlide } from "@components/WarningBeginSlide";

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

  view.add(<Title text="BATCH SIMULATION" />);

  const readyRef: Reference<Ready> = createRef<Ready>();
  view.add(<Ready ref={readyRef} />);

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

  universe[0][0]().stroke(colors.green);
  universe[nRows - 1][nRows - 1]().stroke(colors.orange);

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
          stroke={colors.orange}
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

  yield* warningBeginSlide(readyRef, "CALCULATE FIRST ITERATON");
  yield* all(
    ...lines
      .slice(0, 3)
      .flatMap((lineGroup: Reference<Line>[], lineGroupIdx: number) =>
        lineGroup[0]().lineWidth(5, 1)
      ),
    ...paths
      .slice(0, 3)
      .map((path: Coordinates[]) =>
        universe[path[1].y][path[1].x]().stroke(colors.cyan, 1)
      )
  );
  yield* warningBeginSlide(readyRef, "CALCULATE SOLUTION");
  yield* all(
    ...lines.flatMap((lineGroup: Reference<Line>[], lineGroupIdx: number) =>
      lineGroup.map((line: Reference<Line>) =>
        line().lineWidth(
          5,
          0.25 +
            (lineGroupIdx % 2 === 0
              ? lineGroupIdx / 8
              : lineGroupIdx / 8 + 0.25)
        )
      )
    ),
    ...paths.flatMap((pathGroup: Coordinates[], pathGroupIdx: number) =>
      pathGroup.map(({ x, y }: Coordinates) =>
        universe[x][y]().stroke(
          x === y && y === 0 ? colors.green : colors.cyan,
          0.25 +
            (pathGroupIdx % 2 === 0
              ? pathGroupIdx / 8
              : pathGroupIdx / 8 + 0.25)
        )
      )
    ),
    universe[nRows - 1][nRows - 1]().stroke(colors.orange, 1)
  );
  yield* readyRef().toggle(0.25);
  yield* beginSlide("END SLIDE");
});
