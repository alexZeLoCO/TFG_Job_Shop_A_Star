import { colors } from "@colors";
import { Ready } from "@components/Ready";
import { Title } from "@components/title";
import { warningBeginSlide } from "@components/WarningBeginSlide";
import { Code, Latex, Line, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import { Reference, createRef, all, beginSlide } from "@motion-canvas/core";
import { Task } from "scenes/1_JSP/JSP";

export default makeScene2D(function* (view) {
  const jobs: Task[][] = [
    [
      { duration: 2, qualifiedWorker: 0 },
      { duration: 5, qualifiedWorker: 1 },
      { duration: 1, qualifiedWorker: 2 },
    ],
    [
      { duration: 3, qualifiedWorker: 1 },
      { duration: 3, qualifiedWorker: 2 },
      { duration: 3, qualifiedWorker: 0 },
    ],
  ];

  const yAxisRef: Reference<Line> = createRef<Line>();
  const xAxisRef: Reference<Line> = createRef<Line>();
  const rectTaskRefs: Reference<Rect>[][] = jobs.map((job: Task[]) =>
    job.map(() => createRef<Rect>())
  );
  const jobYPositions: number[] = [150, 400];
  const jobXPositions: number = -1000;
  const workerColorCodes: string[] = [colors.green, colors.red, colors.yellow];
  const toBeRemovedTexts: Reference<Txt>[] = [
    createRef<Txt>(),
    createRef<Txt>(),
    createRef<Txt>(),
  ];

  const titleRef: Reference<Txt> = createRef<Txt>();
  const subRef: Reference<Txt> = createRef<Txt>();
  const codeJobsRef: Reference<Code> = createRef<Code>();

  const readyRef: Reference<Ready> = createRef<Ready>();
  view.add(<Ready ref={readyRef} y={-100} />);

  view.add(<Title ref={titleRef} text={"Funciones Heurísticas"} />);
  view.add(<Title ref={subRef} text={""} y={-500} fontSize={60} />);
  view.add(<Code ref={codeJobsRef} />);

  view.add(
    <>
      <Line
        ref={yAxisRef}
        endArrow
        arrowSize={16}
        points={[[jobXPositions, 600]]}
        stroke={colors.text}
        lineWidth={5}
      />
      <Line
        ref={xAxisRef}
        endArrow
        arrowSize={16}
        points={[[jobXPositions, 600]]}
        stroke={colors.text}
        lineWidth={5}
      />
      <Txt
        fill={colors.text}
        ref={toBeRemovedTexts[0]}
        text="J0"
        x={-1100}
        y={jobYPositions[0]}
        fontSize={100}
        rotation={45}
      />
      <Txt
        fill={colors.text}
        ref={toBeRemovedTexts[1]}
        text="J1"
        x={-1100}
        y={jobYPositions[1]}
        fontSize={100}
        rotation={45}
      />
      <Txt
        fill={colors.text}
        ref={toBeRemovedTexts[2]}
        text="T"
        x={1100}
        y={600}
        fontSize={100}
      />
    </>
  );

  view.add(
    rectTaskRefs.flatMap((jobRefs: Reference<Rect>[], jobIdx: number) =>
      jobRefs.map((rectRef: Reference<Rect>, taskIdx: number) => (
        <Rect
          key={`Rect_${jobIdx * 10 + taskIdx}`}
          ref={rectRef}
          fill={workerColorCodes[jobs[jobIdx][taskIdx].qualifiedWorker]}
          width={jobs[jobIdx][taskIdx].duration * 100}
          height={100}
          y={jobYPositions[jobIdx]}
          x={-2300}
        />
      ))
    )
  );

  const codeScheduleRef: Reference<Code> = createRef<Code>();
  view.add(
    <Code
      ref={codeScheduleRef}
      y={-300}
      x={400}
      code={`
// SCHEDULE - PLANIFICACIÓN
[
  [(-1), (-1), (-1)],
  [(-1), (-1), (-1)]
]
`}
    />
  );

  yield* all(
    yAxisRef().points(
      [
        [-1000, 700],
        [-1000, 0],
      ],
      0.5
    ),
    xAxisRef().points(
      [
        [-1100, 600],
        [1000, 600],
      ],
      0.5
    ),
    codeJobsRef().code(
      `
// JOBS - TRABAJOS
[
  [(2, 0), (5, 1), (1, 2)],
  [(3, 1), (3, 2), (3, 0)]
]
`,
      0.5
    ),
    codeJobsRef().y(-300, 0.5),
    codeJobsRef().x(-800, 0.5),
    subRef().text("Heurístico Rápido (cota superior)", 0.5),
    rectTaskRefs[0][0]().x(-800, 0.5),
    rectTaskRefs[1][0]().x(-750, 0.5),

    rectTaskRefs[0][1]().x(-325, 0.5),
    rectTaskRefs[1][1]().x(-425, 0.5),

    rectTaskRefs[0][2]().x(0, 0.5),
    rectTaskRefs[1][2]().x(-100, 0.5),
    codeScheduleRef().code(
      `
// SCHEDULE - PLANIFICACIÓN
[
  [(0), (3), (8)],
  [(0), (3), (6)]
]
`,
      0.5
    )
  );

  yield* warningBeginSlide(readyRef, "HALF STATE");

  yield* all(
    codeScheduleRef().code(
      `
// SCHEDULE - PLANIFICACIÓN
[
  [(0), (-1), (-1)],
  [(0), (-1), (-1)]
]
`,
      0.5
    ),
    ...rectTaskRefs[0]
      .slice(1)
      .map((rectTaskRef: Reference<Rect>) => rectTaskRef().opacity(0, 0.5)),
    ...rectTaskRefs[1]
      .slice(1)
      .map((rectTaskRef: Reference<Rect>) => rectTaskRef().opacity(0, 0.5))
  );

  yield* warningBeginSlide(readyRef, "CALCULATE SUMS");

  const texRefs: Reference<Latex>[] = [
    createRef<Latex>(),
    createRef<Latex>(),
    createRef<Latex>(),
    createRef<Latex>(),
  ];
  yield view.add(
    <>
      <Latex
        ref={texRefs[0]}
        y={jobYPositions[0]}
        height={0}
        fill={"#00000000"}
        tex={`{\\color{${colors.text}}5 + 1 = 6}`}
      />
      <Latex
        ref={texRefs[1]}
        y={jobYPositions[1]}
        height={0}
        fill={"#00000000"}
        tex={`{\\color{${colors.text}}3 + 3 = 6}`}
      />
    </>
  );
  yield* all(texRefs[0]().height(50, 0.5), texRefs[1]().height(50, 0.5));

  yield* warningBeginSlide(readyRef, "CALCULATE SUM");

  yield view.add(
    <Latex
      ref={texRefs[2]}
      y={(jobYPositions[1] + jobYPositions[0]) / 2}
      height={0}
      fill={"#00000000"}
      tex={`{\\color{${colors.text}}6 + 6 = 12}`}
    />
  );
  texRefs[0]().remove();
  texRefs[1]().remove();
  yield* texRefs[2]().height(75, 0.5);

  yield* warningBeginSlide(readyRef, "SHOW HEURISTIC");

  view.add(
    <Latex
      ref={texRefs[3]}
      y={(jobYPositions[0] + jobYPositions[1]) / 2}
      x={200}
      height={0}
      fill={"#00000000"}
      tex={`{\\color{${colors.text}}\\sum_{j=0}^J(\\sum_{t=J_{j,k}}^T D_{j,t})}`}
    />
  );
  texRefs[2]().remove();
  yield* texRefs[3]().height(300, 0.5);

  yield* readyRef().toggle(0.25);
  yield* beginSlide("END SLIDE");
});
