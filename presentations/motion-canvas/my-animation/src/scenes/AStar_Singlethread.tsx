import { Reference, all, beginSlide, createRef } from "@motion-canvas/core";
import { Layout, Line, makeScene2D } from "@motion-canvas/2d";
import { State } from "./example";

export default makeScene2D(function* (view) {
  var universe: Reference<State>[][] = [];
  var horLayouts: Reference<Layout>[] = [];
  var path: Reference<State>[] = [];
  var lines: Reference<Line>[] = [];
  const nRows: number = 5;

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
      <Line ref={line} stroke="#fcba03" lineWidth={0} />
    ))
  );

  view.add(
    <Layout layout direction="column">
      {universe.map((row: Reference<State>[], idx: number) => {
        return (
          <Layout ref={horLayouts[idx]} layout direction="row">
            {row.map((state: Reference<State>) => (
              <State ref={state} layout margin={40} />
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

  universe[0][0]().stroke("#32a852");
  universe[nRows - 1][nRows - 1]().stroke("#fcba03");

  yield* beginSlide("CALCULATE PATH");
  yield* all(
    ...lines.map((line: Reference<Line>, idx: number) =>
      line().lineWidth(5, 1 + idx)
    ),
    ...path
      .filter((_, idx: number) => idx !== 0 && idx !== nRows - 1)
      .map((state: Reference<State>, idx: number) =>
        state().stroke("#03fcf4", 1 + idx)
      )
  );
  yield* beginSlide("END SLIDE");
});
