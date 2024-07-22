import {
  Bezier,
  Code,
  Line,
  makeScene2D,
  Rect,
  Spline,
  Txt,
} from "@motion-canvas/2d";
import {
  Reference,
  all,
  beginSlide,
  createRef,
  sequence,
} from "@motion-canvas/core";
import { NeighborsFunction, OpenSet, State } from "@components/diagrams";
import { Title } from "@components/title";
import { colors } from "@colors";
import { Ready } from "@components/Ready";
import { warningBeginSlide } from "@components/WarningBeginSlide";

export default makeScene2D(function* (view) {
  const questionRef: Reference<Txt> = createRef<Txt>();
  const startingStateRef: Reference<State> = createRef<State>();
  const titleRef: Reference<Txt> = createRef<Txt>();
  view.add(<Title ref={titleRef} text="Algoritmo A*" />);
  view.add(
    <Title
      ref={questionRef}
      y={0}
      fontSize={100}
      text={"¿Cómo obtiene A* la solución?"}
    />
  );

  const splineRefs: Reference<Bezier>[] = [
    createRef<Bezier>(),
    createRef<Bezier>(),
  ];
  const lineRef: Reference<Line> = createRef<Line>();
  view.add(
    <>
      <Spline
        ref={splineRefs[0]}
        lineWidth={0}
        stroke={colors.blue}
        points={[
          [-400, -400],
          [-900, -400],
          [-900, -200],
          [0, -200],
          [0, 0],
        ]}
      />
      <Spline
        ref={splineRefs[1]}
        lineWidth={0}
        stroke={colors.blue}
        points={[
          [0, 0],
          [0, 200],
          [-900, 200],
          [-900, 400],
          [-400, 400],
        ]}
      />
      <Line
        ref={lineRef}
        lineWidth={0}
        stroke={colors.blue}
        points={[
          [500, 400],
          [900, 400],
          [900, 0],
          [900, -400],
          [500, -400],
        ]}
      />
    </>
  );

  const readyRef: Reference<Ready> = createRef<Ready>();
  view.add(<Ready ref={readyRef} />);

  yield* warningBeginSlide(readyRef, "ADD OPEN SET");
  yield* questionRef().fontSize(0, 0.5);
  view.add(<OpenSet y={-400} />);

  yield* warningBeginSlide(readyRef, "ADD IS GOAL FUNCTION");
  view.add(
    <Rect
      radius={25}
      fill={colors.alternativeBackground}
      stroke={colors.text}
      lineWidth={5}
      width={750}
      height={150}
    >
      <Code fontSize={80} code={"node.isGoal()"} />
    </Rect>
  );
  yield* splineRefs[0]().lineWidth(5, 0.5);

  yield* warningBeginSlide(readyRef, "ADD NEIGHBORS FUNCTION");
  view.add(<NeighborsFunction fontSize={80} width={1000} y={400} />);
  yield* splineRefs[1]().lineWidth(5, 0.5);
  yield* lineRef().lineWidth(5, 0.5);

  yield* warningBeginSlide(readyRef, "ADD INITIAL STATE");
  view.add(
    <State ref={startingStateRef} y={-400} x={-400} fill={colors.green} />
  );

  yield* warningBeginSlide(readyRef, "CHECK STATE");
  yield* all(
    titleRef().text("Algoritmo A*: Comprobar objetivo", 0.5),
    sequence(
      0.25,
      startingStateRef().position.x(-900, 0.5),
      startingStateRef().position.y(-200, 0.5),
      startingStateRef().position.x(0, 0.5),
      startingStateRef().position.y(0, 0.5)
    )
  );

  yield* warningBeginSlide(readyRef, "GET NEIGHBORS");
  yield* all(
    titleRef().text("Algoritmo A*: Obtener sucesores", 0.5),
    sequence(
      0.25,
      startingStateRef().position.y(200, 0.5),
      startingStateRef().position.x(-900, 0.5),
      startingStateRef().position.y(400, 0.5),
      startingStateRef().position.x(0, 0.5)
    )
  );

  yield* warningBeginSlide(readyRef, "INSERT NEIGHBORS");
  const neighbors: Reference<State>[][] = [];
  neighbors.push([
    createRef<State>(),
    createRef<State>(),
    createRef<State>(),
    createRef<State>(),
  ]);
  view.add(
    neighbors[0].map((stateRef: Reference<State>, idx: number) => (
      <State key={`Neighbor_${0 + idx}`} ref={stateRef} y={400} />
    ))
  );
  yield* all(
    startingStateRef().size(0, 0.5),
    titleRef().text("Algoritmo A*: Insertar sucesores", 0.5),
    sequence(
      0.25,
      ...neighbors[0].map((stateRef: Reference<State>, idx: number) =>
        sequence(
          0.25,
          stateRef().position.x(900, 0.5),
          stateRef().position.y(-400, 0.5),
          stateRef().position.x(-400 + idx * 150, 0.5)
        )
      )
    )
  );

  yield* warningBeginSlide(readyRef, "REPEAT UNTIL GOAL");
  yield* sequence(
    0.25,
    titleRef().text("Algoritmo A*: Repetir hasta objetivo", 0.5),
    all(
      ...neighbors[0]
        .slice(1)
        .map((stateRef: Reference<State>, stateIdx: number) =>
          stateRef().x(-400 + stateIdx * 150, 0.25)
        ),
      sequence(
        0.25,
        neighbors[0][0]().position.x(-900, 0.5),
        neighbors[0][0]().position.y(-200, 0.5),
        neighbors[0][0]().position.x(0, 0.5),
        neighbors[0][0]().position.y(0, 0.5)
      )
    )
  );
  yield* sequence(
    0.25,
    neighbors[0][0]().position.y(200, 0.5),
    neighbors[0][0]().position.x(-900, 0.5),
    neighbors[0][0]().position.y(400, 0.5),
    neighbors[0][0]().position.x(0, 0.5)
  );
  neighbors.push([
    createRef<State>(),
    createRef<State>(),
    createRef<State>(),
    createRef<State>(),
  ]);
  view.add(
    neighbors[1].map((stateRef: Reference<State>, idx: number) => (
      <State key={`Neighbor_${1 + idx}`} ref={stateRef} y={400} />
    ))
  );
  neighbors[1][1]().fill(colors.orange);

  yield* all(
    neighbors[0][0]().size(0, 0.5),
    sequence(
      0.25,
      ...neighbors[1].map((stateRef: Reference<State>, idx: number) =>
        sequence(
          0.25,
          stateRef().position.x(900, 0.5),
          stateRef().position.y(-400, 0.5),
          stateRef().position.x(-400 + idx * 150 + 3 * 150, 0.5)
        )
      ),
      all(
        neighbors[0][1]().x(-400 + 4 * 150, 0.5),
        neighbors[1][1]().x(-400, 0.5)
      )
    )
  );

  yield* all(
    sequence(
      0.25,
      neighbors[0][0]().position.x(-900, 0.5),
      neighbors[0][0]().position.y(-200, 0.5),
      neighbors[0][0]().position.x(0, 0.5),
      neighbors[0][0]().position.y(0, 0.5)
    )
  );
  yield* sequence(
    0.25,
    neighbors[1][1]().position.x(-900, 0.5),
    neighbors[1][1]().position.y(-200, 0.5),
    neighbors[1][1]().position.x(0, 0.5),
    neighbors[1][1]().position.y(0, 0.5)
  );
  yield* neighbors[1][1]().position.x(-900, 0.5);

  yield* readyRef().toggle(0.25);
  yield* beginSlide("END SLIDE");
});
