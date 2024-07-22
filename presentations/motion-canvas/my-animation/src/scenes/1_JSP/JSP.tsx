import { makeScene2D, Code, lines, Txt, Line, Rect } from "@motion-canvas/2d";
import { Title } from "@components/title";
import {
  Reference,
  createRef,
  beginSlide,
  all,
  DEFAULT,
  sequence,
} from "@motion-canvas/core";
import { colors } from "@colors";
import { State } from "@components/diagrams";
import { Ready } from "@components/Ready";
import { warningBeginSlide } from "@components/WarningBeginSlide";

export type Task = {
  duration: number;
  qualifiedWorker: number;
};

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

  const readyRef: Reference<Ready> = createRef<Ready>();
  view.add(<Ready ref={readyRef} />);

  const questionRef: Reference<Txt> = createRef<Txt>();
  const titleRef: Reference<Txt> = createRef<Txt>();
  const subRef: Reference<Txt> = createRef<Txt>();
  const codeJobsRef: Reference<Code> = createRef<Code>();
  view.add(
    <Title
      ref={questionRef}
      y={0}
      fontSize={100}
      text={"¿Qué recibe el JSP?"}
    />
  );
  view.add(<Title ref={titleRef} text={"Job Shop Scheduling Problem (JSP)"} />);
  view.add(<Title ref={subRef} text={""} y={-500} fontSize={60} />);

  yield* warningBeginSlide(readyRef, "SHOW DATA INPUT");

  view.add(<Code y={100} ref={codeJobsRef} />);

  yield* all(
    codeJobsRef().code(
      `
type Task = {
  duration: number,
  qualifiedWorker: number
};
`,
      0.5
    ),
    questionRef().fontSize(0, 0.5)
  );

  yield* warningBeginSlide(readyRef, "JOBS");
  yield* codeJobsRef().code.append(
    `
const jobs: Task[][] = [
  [
    ({duration: 2, qualifiedWorker: 0}),
    ({duration: 5, qualifiedWorker: 1}),
    ({duration: 1, qualifiedWorker: 2})
  ], [
    ({duration: 3, qualifiedWorker: 1}),
    ({duration: 3, qualifiedWorker: 2}),
    ({duration: 3, qualifiedWorker: 0})
  ]
];
`,
    0.5
  );

  yield* warningBeginSlide(readyRef, "JOB 0");
  yield* all(
    subRef().text("", 0.25).to("Job 0", 0.25),
    codeJobsRef().selection(lines(7, 11), 0.5),
    titleRef().text("Job Shop Scheduling Problem (JSP): Trabajos (Jobs)", 0.5)
  );
  yield* warningBeginSlide(readyRef, "JOB 1");
  yield* all(
    subRef().text("", 0.25).to("Job 1", 0.25),
    codeJobsRef().selection(lines(11, 15), 0.5)
  );

  yield* warningBeginSlide(readyRef, "Task 1,0");
  yield* all(
    subRef().text("", 0.25).to("Task 1,0", 0.25),
    codeJobsRef().selection(lines(12), 0.5),
    titleRef().text("Job Shop Scheduling Problem (JSP): Tareas (Tasks)", 0.5)
  );
  yield* warningBeginSlide(readyRef, "Task 0,2");
  yield* all(
    subRef().text("", 0.25).to("Task 0,2", 0.25),
    codeJobsRef().selection(lines(10), 0.5)
  );

  yield* warningBeginSlide(readyRef, "CLEAR SELECTION");
  yield* all(subRef().text("", 0.5), codeJobsRef().selection(DEFAULT, 0.5));

  yield* warningBeginSlide(readyRef, "NEXT QUESTION");
  yield* codeJobsRef().code("", 0.5);
  questionRef().text("¿Qué retorna el JSP?");
  yield* questionRef().fontSize(100, 0.5);

  yield* warningBeginSlide(readyRef, "SIMPLIFY JOBS");
  yield* questionRef().fontSize(0, 0.5);
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

  yield* readyRef().position([0, -150], 0.25);
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
    titleRef().text("Job Shop Scheduling Problem (JSP): Soluciones", 0.5),
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
    codeJobsRef().x(-800, 0.5)
  );

  yield* warningBeginSlide(readyRef, "OPTIMAL SOLUTION");
  yield* all(
    subRef().text("Solución óptima", 0.5),
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

  yield* warningBeginSlide(readyRef, "OTHER SOLUTION");
  yield* all(
    subRef().text("Otra solución", 0.5),
    rectTaskRefs[0][0]().x(-800, 0.5),
    rectTaskRefs[1][0]().x(-500, 0.5),
    rectTaskRefs[0][1]().x(-100, 0.5),
    rectTaskRefs[1][1]().x(350, 0.5),
    rectTaskRefs[0][2]().x(900, 0.5),
    rectTaskRefs[1][2]().x(700, 0.5),
    codeScheduleRef().code(
      `
// SCHEDULE - PLANIFICACIÓN
[
  [(0), (5), (16)],
  [(2), (10), (13)]
]
`,
      0.5
    )
  );

  yield* warningBeginSlide(readyRef, "NEXT QUESTION");
  questionRef().text("¿Cómo obtiene los estados sucesores?");
  yield* all(
    ...rectTaskRefs.flatMap((taskRefs: Reference<Rect>[]) =>
      taskRefs.map((taskRef: Reference<Rect>) => taskRef().size(0, 0.5))
    ),
    codeScheduleRef().code(
      `
// SCHEDULE - PLANIFICACIÓN
[
  [(-1), (-1), (-1)],
  [(-1), (-1), (-1)]
]
`,
      0.5
    ),
    ...toBeRemovedTexts.map((toBeRemovedText: Reference<Txt>) =>
      toBeRemovedText().fontSize(0, 0.5)
    ),
    xAxisRef().lineWidth(0, 0.5),
    xAxisRef().endArrow(false, 0.5),
    yAxisRef().lineWidth(0, 0.5),
    yAxisRef().endArrow(false, 0.5),
    titleRef().text("Job Shop Scheduling Problem (JSP): Sucesores", 0.5),
    subRef().text("", 0.5),
    readyRef().position([0, 0], 0.5)
  );
  yield* questionRef().fontSize(100, 0.5);

  yield* warningBeginSlide(readyRef, "NEIGHBORS GENERATION");
  yield* questionRef().fontSize(0, 0.5);
  const lineRefs: Reference<Line>[] = [createRef<Line>(), createRef<Line>()];
  view.add(
    <>
      <Line
        ref={lineRefs[0]}
        points={[
          [0, 0],
          [-400, 400],
        ]}
        stroke={colors.cyan}
      />
      <Line
        ref={lineRefs[1]}
        points={[
          [0, 0],
          [400, 400],
        ]}
        stroke={colors.cyan}
      />
    </>
  );
  const startingStateRef: Reference<State> = createRef<State>();
  view.add(
    <State ref={startingStateRef} fill={colors.green} width={0} height={0} />
  );
  yield* all(
    startingStateRef().width(200, 0.5),
    startingStateRef().height(200, 0.5)
  );

  yield* warningBeginSlide(readyRef, "CALCULATE NEIGHBORS");
  const neighbors: Reference<State>[] = [
    createRef<State>(),
    createRef<State>(),
  ];
  view.add(
    <>
      <State ref={neighbors[0]} x={-400} y={400} width={0} height={0} />
      <State ref={neighbors[1]} x={400} y={400} width={0} height={0} />
    </>
  );

  yield* all(
    sequence(
      0.25,
      all(lineRefs[0]().lineWidth(5, 0.25), lineRefs[1]().lineWidth(5, 0.25)),
      all(
        neighbors[0]().width(200, 0.25),
        neighbors[0]().height(200, 0.25),
        neighbors[1]().width(200, 0.25),
        neighbors[1]().height(200, 0.25)
      )
    )
  );

  yield* warningBeginSlide(readyRef, "FIRST NEIGHBOR");

  const regex = "\\(0\\)";
  yield* codeScheduleRef().code(
    `
// SCHEDULE - PLANIFICACIÓN
[
  [(0), (-1), (-1)],
  [(-1), (-1), (-1)]
]
`,
    0.25
  );
  yield* all(
    codeScheduleRef().selection(codeScheduleRef().findFirstRange(regex), 0.5),
    neighbors[1]().opacity(0.2, 0.5),
    lineRefs[1]().opacity(0.25, 0.5)
  );

  yield* warningBeginSlide(readyRef, "SECOND NEIGHBOR");

  yield* codeScheduleRef().code(
    `
// SCHEDULE - PLANIFICACIÓN
[
  [(-1), (-1), (-1)],
  [(0), (-1), (-1)]
]
`,
    0.25
  );
  yield* all(
    codeScheduleRef().selection(codeScheduleRef().findFirstRange(regex), 0.5),
    neighbors[1]().opacity(1, 0.5),
    lineRefs[1]().opacity(1, 0.5),
    neighbors[0]().opacity(0.2, 0.5),
    lineRefs[0]().opacity(0.25, 0.5)
  );

  yield* readyRef().toggle(0.25);
  yield* beginSlide("END SLIDE");
});
