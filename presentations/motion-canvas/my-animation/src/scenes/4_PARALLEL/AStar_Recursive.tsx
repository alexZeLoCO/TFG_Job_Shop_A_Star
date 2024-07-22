import { Reference, all, beginSlide, createRef } from "@motion-canvas/core";
import { Layout, Line, makeScene2D } from "@motion-canvas/2d";
import { colors } from "@colors";
import { State } from "@components/diagrams";
import { Title } from "@components/title";
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

  view.add(<Title text="RECURSIVE SIMULATION" />);

  const readyRef: Reference<Ready> = createRef<Ready>();
  view.add(<Ready ref={readyRef} />);

  view.add(
    <Layout layout direction="column">
      {universe.map((row: Reference<State>[], layoutIdx: number) => {
        return (
          <Layout
            key={`Layout_${layoutIdx}`}
            ref={horLayouts[layoutIdx]}
            layout
            direction="row"
          >
            {row.map((state: Reference<State>, stateIdx: number) => (
              <State
                key={`State_${layoutIdx}_${stateIdx}`}
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
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 3, y: 2 },
    { x: 4, y: 3 },
    { x: 4, y: 4 },
  ]);

  paths.push([
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 1, y: 3 },
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 4, y: 4 },
  ]);

  paths.slice(1).forEach((pathGroup: Coordinates[], i: number) => {
    lines.push([]);
    pathGroup.slice(1).map((_) => lines[i + 1].push(createRef<Line>()));
  });

  view.add(
    lines.flatMap((lineGroup: Reference<Line>[], lineGroupIdx: number) =>
      lineGroup.map((line: Reference<Line>, lineIdx: number) => (
        <Line
          key={`line_${lineGroupIdx * 10 + lineIdx}`}
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

  yield* warningBeginSlide(readyRef, "CALCULATE FIRST ITERATION");
  yield* all(
    ...lines.flatMap((lineGroup: Reference<Line>[]) =>
      lineGroup[0]().lineWidth(5, 0.25)
    ),
    ...paths.flatMap((pathGroup: Coordinates[]) =>
      universe[pathGroup[1].y][pathGroup[1].x]().stroke(colors.cyan, 0.25)
    )
  );
  yield* warningBeginSlide(readyRef, "CALCULATE SOLUTION");
  yield* all(
    ...lines.flatMap((lineGroup: Reference<Line>[]) =>
      lineGroup.map((line: Reference<Line>, i: number) =>
        line().lineWidth(5, i / 4 + 0.25)
      )
    ),
    ...paths.flatMap((pathGroup: Coordinates[]) =>
      pathGroup
        .filter((_, idx: number) => idx !== 0 && idx !== pathGroup.length - 1)
        .map(({ x, y }: Coordinates, idx: number) =>
          universe[y][x]().stroke(colors.cyan, idx / 4 + 0.25)
        )
    )
  );
  yield* readyRef().toggle(0.25);
  yield* beginSlide("END SLIDE");
});
