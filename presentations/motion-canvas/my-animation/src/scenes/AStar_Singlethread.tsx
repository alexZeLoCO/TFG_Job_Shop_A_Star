import { Reference, all, beginSlide, createRef } from "@motion-canvas/core";
import { Layout, Line, makeScene2D, Txt } from "@motion-canvas/2d";
import { Title } from "../components/title";
import { State } from "../components/diagrams";
import { colors } from "../colors";

export default makeScene2D(function* (view) {
  let universe: Reference<State>[][] = [];
  let horLayouts: Reference<Layout>[] = [];
  let path: Reference<State>[] = [];
  let lines: Reference<Line>[] = [];
  const nRows: number = 5;

  view.add(<Title text="A* SINGLETHREAD SIMULATION" />);

  for (let i = 0; i < nRows; i++) {
    universe.push([]);
    for (let j = 0; j < nRows; j++) {
      universe[i].push(createRef<State>());
    }
    horLayouts.push(createRef<Layout>());
    path.push(universe[i][i]);
    if (i != 0) lines.push(createRef<Line>());
  }

  view.add(
    lines.map((line: Reference<Line>, i: number) => (
      <Line key={`line_${i}`} ref={line} stroke={colors.orange} lineWidth={0} />
    ))
  );

  view.add(
    <Layout layout direction="column">
      {universe.map((row: Reference<State>[], layoutIdx: number) => {
        return (
          <Layout
            key={`layout_${layoutIdx}`}
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

  lines.forEach((line: Reference<Line>, i: number) =>
    line().points([
      [path[i]().x(), horLayouts[i]().y()],
      [path[i + 1]().x(), horLayouts[i + 1]().y()],
    ])
  );

  universe[0][0]().stroke(colors.green);
  universe[nRows - 1][nRows - 1]().stroke(colors.orange);

  yield* beginSlide("CALCULATE PATH");
  yield *
    all(
      ...lines.map((line: Reference<Line>, idx: number) =>
        line().lineWidth(5, idx / 2)
      ),
      ...path
        .filter((_, idx: number) => idx !== 0 && idx !== nRows - 1)
        .map((state: Reference<State>, idx: number) =>
          state().stroke(colors.cyan, idx / 2)
        )
    );
  yield* beginSlide("END SLIDE");
});
