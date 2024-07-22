import {
  Circle,
  Code,
  LezerHighlighter,
  Line,
  lines,
  makeScene2D,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  beginSlide,
  createRef,
  DEFAULT,
  Reference,
  sequence,
} from "@motion-canvas/core";
import { colors } from "@colors";
import { Title } from "@components/title";

export default makeScene2D(function* (view) {
  const codeJobsRef: Reference<Code> = createRef<Code>();
  const codeScheduleRef: Reference<Code> = createRef<Code>();

  const titleRef: Reference<Txt> = createRef<Txt>();
  view.add(
    <Title
      ref={titleRef}
      text={"Job Shop Scheduling Problem (JSP): Jobs"}
      x={-400}
      y={-600}
    />
  );

  view.add(
    <Code
      ref={codeJobsRef}
      code={`
type Task = {
  duration: number;
  qualifiedWorker: number;
};

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
`}
    />
  );

  yield* beginSlide("JOB 0");
  yield* codeJobsRef().selection(lines(7, 11), 0.5);
  yield* beginSlide("JOB 1");
  yield* codeJobsRef().selection(lines(11, 15), 0.5);

  yield* beginSlide("Task 1,0");
  yield* codeJobsRef().selection(lines(12), 0.5);

  yield* beginSlide("Starting state");
  yield* all(
    codeJobsRef().selection(DEFAULT, 0.5),
    codeJobsRef().x(-600, 1),
    titleRef().x(-300, 1),
    titleRef().text("Job Shop Scheduling Problem (JSP): Schedule", 1)
  );
  view.add(
    <Code
      ref={codeScheduleRef}
      x={-600}
      code={`
type Task = {
  duration: number;
  qualifiedWorker: number;
};

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
`}
    />
  );

  yield* all(
    codeScheduleRef().code(
      `
type Schedule = number[][];

const schedule: Schedule = [
  [ (-1), (-1), (-1) ],
  [ (-1), (-1), (-1) ]
];
`,
      1
    ),
    codeScheduleRef().x(600, 1),
    codeScheduleRef().y(-325, 1)
  );

  const circleRef: Reference<Circle> = createRef<Circle>();
  const circleChildrenRefs: Reference<Circle>[] = [
    createRef<Circle>(),
    createRef<Circle>(),
  ];

  const lineChildrenRefs: Reference<Line>[] = [
    createRef<Line>(),
    createRef<Line>(),
  ];

  view.add(
    <Circle
      ref={circleRef}
      size={200}
      fill={colors.alternativeBackground}
      stroke={colors.green}
      lineWidth={5}
      x={600}
    />
  );

  yield* beginSlide("GET CHILD 0");

  view.add(
    <Circle
      ref={circleChildrenRefs[0]}
      size={200}
      fill={colors.background}
      stroke={colors.cyan}
      lineWidth={0}
      x={300}
      y={400}
    />
  );

  view.add(
    <Line
      ref={lineChildrenRefs[0]}
      points={[
        [600, 100],
        [300, 300],
      ]}
      lineWidth={0}
      stroke={colors.cyan}
    />
  );

  yield* codeScheduleRef().code(
    `
type Schedule = number[][];

const schedule: Schedule = [
  [ (0), (-1), (-1) ],
  [ (-1), (-1), (-1) ]
];
`,
    1
  );
  yield* codeScheduleRef().selection(
    codeScheduleRef().findAllRanges(/\(0\)/gi),
    0.5
  );
  yield* all(
    lineChildrenRefs[0]().lineWidth(5, 0.5),
    circleChildrenRefs[0]().fill(colors.alternativeBackground, 0.5),
    circleChildrenRefs[0]().lineWidth(5, 0.5)
  );

  yield* beginSlide("GET CHILD 1");

  yield* sequence(
    1,
    codeScheduleRef().selection(DEFAULT, 0.5),
    codeScheduleRef().code(
      `
type Schedule = number[][];

const schedule: Schedule = [
  [ (-1), (-1), (-1) ],
  [ (-1), (-1), (-1) ]
];
`,
      1
    )
  );

  view.add(
    <Circle
      ref={circleChildrenRefs[1]}
      size={200}
      fill={colors.background}
      stroke={colors.cyan}
      lineWidth={0}
      x={900}
      y={400}
    />
  );

  view.add(
    <Line
      ref={lineChildrenRefs[1]}
      points={[
        [600, 100],
        [900, 300],
      ]}
      lineWidth={0}
      stroke={colors.cyan}
    />
  );

  yield* codeScheduleRef().code(
    `
type Schedule = number[][];

const schedule: Schedule = [
  [ (-1), (-1), (-1) ],
  [ (0), (-1), (-1) ]
];
`,
    1
  );
  yield* codeScheduleRef().selection(
    codeScheduleRef().findAllRanges(/\(0\)/gi),
    0.5
  );
  yield* all(
    lineChildrenRefs[1]().lineWidth(5, 0.5),
    circleChildrenRefs[1]().fill(colors.alternativeBackground, 0.5),
    circleChildrenRefs[1]().lineWidth(5, 0.5)
  );

  yield* beginSlide("END SLIDE");
});
