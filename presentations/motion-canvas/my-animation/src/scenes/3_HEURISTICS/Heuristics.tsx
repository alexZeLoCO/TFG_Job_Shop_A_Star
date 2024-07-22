import { colors } from "@colors";
import { State } from "@components/diagrams";
import { Ready } from "@components/Ready";
import { Title } from "@components/title";
import { warningBeginSlide } from "@components/WarningBeginSlide";
import { Layout, Line, makeScene2D, Txt } from "@motion-canvas/2d";
import { all, beginSlide, createRef, Reference } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const questionRef: Reference<Txt> = createRef<Txt>();
  let universe: Reference<State>[][] = [];
  let horLayouts: Reference<Layout>[] = [];
  const nRows: number = 5;

  const readyRef: Reference<Ready> = createRef<Ready>();
  view.add(<Ready ref={readyRef} />);

  view.add(<Title text="Costes y Función Heurística" />);
  view.add(
    <Title
      ref={questionRef}
      fontSize={100}
      y={0}
      text={"¿Cómo se ordena el open set?"}
    />
  );

  yield* warningBeginSlide(readyRef, "ADD NODES");
  yield* questionRef().fontSize(0, 0.5);

  for (let i = 0; i < nRows; i++) {
    universe.push([]);
    for (let j = 0; j < nRows; j++) {
      universe[i].push(createRef<State>());
    }
    horLayouts.push(createRef<Layout>());
  }

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

  universe[0][0]().fill(colors.green);
  universe[nRows - 1][nRows - 1]().fill(colors.orange);
  universe[1][2]().fill(colors.cyan);

  yield* warningBeginSlide(readyRef, "SHOW G PATH");

  const gPath = [
    [0, 0],
    [1, 1],
    [1, 2],
  ];
  const gLine: Reference<Line> = createRef<Line>();
  const gText: Reference<Txt> = createRef<Txt>();

  view.add(
    <Line
      ref={gLine}
      points={gPath.map((point) => [
        universe[point[0]][point[1]]().x(),
        horLayouts[point[0]]().y(),
      ])}
      lineWidth={0}
      stroke={colors.cyan}
    />
  );
  view.add(
    <Txt
      ref={gText}
      fill={colors.cyan}
      text="Recorrido (G)"
      x={-900}
      y={-300}
      fontSize={0}
    />
  );

  yield* all(gLine().lineWidth(5, 0.5), gText().fontSize(75, 0.5));

  yield* warningBeginSlide(readyRef, "SHOW REAL PATH");

  const realPath = [
    [1, 2],
    [2, 2],
    [3, 3],
    [4, 4],
  ];
  const realLine: Reference<Line> = createRef<Line>();
  const realText: Reference<Txt> = createRef<Txt>();

  view.add(
    <Line
      ref={realLine}
      points={realPath.map((point) => [
        universe[point[0]][point[1]]().x(),
        horLayouts[point[0]]().y(),
      ])}
      lineWidth={0}
      stroke={colors.red}
    />
  );
  view.add(
    <Txt
      ref={realText}
      fill={colors.red}
      text="Solución"
      x={-900}
      y={0}
      fontSize={0}
    />
  );

  yield* all(realLine().lineWidth(5, 0.5), realText().fontSize(75, 0.5));

  yield* warningBeginSlide(readyRef, "SHOW H PATH");

  const hPath = [
    [1, 2],
    [4, 4],
  ];
  const hLine: Reference<Line> = createRef<Line>();
  const hText: Reference<Txt> = createRef<Txt>();

  view.add(
    <Line
      ref={hLine}
      points={hPath.map((point) => [
        universe[point[0]][point[1]]().x(),
        horLayouts[point[0]]().y(),
      ])}
      lineWidth={0}
      stroke={colors.purple}
    />
  );
  view.add(
    <Txt
      ref={hText}
      fill={colors.purple}
      text="Estimación (H)"
      x={-900}
      y={300}
      fontSize={0}
    />
  );

  yield* all(hLine().lineWidth(5, 0.5), hText().fontSize(75, 0.5));

  yield* readyRef().toggle(0.25);
  yield* beginSlide("END SLIDE");
});
