import { colors, pureColors } from "@colors";
import { Alu } from "@components/computer/ALU";
import { Memory } from "@components/computer/Memory";
import { Ready } from "@components/Ready";
import { Title } from "@components/title";
import { warningBeginSlide } from "@components/WarningBeginSlide";
import { Line, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import { all, beginSlide, createRef, Reference } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const titleRef: Reference<Txt> = createRef<Txt>();
  const questionRef: Reference<Txt> = createRef<Txt>();

  const readyRef: Reference<Ready> = createRef<Ready>();
  view.add(<Ready ref={readyRef} />);

  view.add(
    <Title
      ref={questionRef}
      y={0}
      fontSize={75}
      text="¿Cómo es la arquitectura de una CPU?"
    />
  );
  yield* warningBeginSlide(readyRef, "ARCH CPU");
  yield* questionRef().fontSize(0, 0.5);
  const aluRef: Reference<Alu> = createRef<Alu>();
  const memRefs: Reference<Memory>[] = [
    createRef<Memory>(),
    createRef<Memory>(),
    createRef<Memory>(),
  ];
  view.add(<Title ref={titleRef} text="Arqutectura: CPU" />);
  view.add(
    <>
      <Alu
        ref={aluRef}
        position={[-200, -150]}
        fill={pureColors.alternateBackground}
        stroke={pureColors.red}
        lineWidth={5}
        in0TextProps={{ text: "IN0", fill: colors.text }}
        in1TextProps={{ text: "IN1", fill: colors.text }}
        in2TextProps={{ text: "OP", fill: colors.text }}
        outTextProps={{ text: "OUT", fill: colors.text }}
      />
      <Memory
        ref={memRefs[0]}
        position={[-400, 400]}
        size={[1000, 100]}
        stroke={pureColors.orange}
        lineWidth={5}
        textProps={{ text: "MEMORIA RAM", fill: colors.text }}
      />
      <Memory
        ref={memRefs[1]}
        position={[-750, 200]}
        size={[500, 100]}
        stroke={pureColors.purple}
        lineWidth={5}
        textProps={{ text: "INSTRUCCIONES", fill: colors.text }}
      />
      <Memory
        ref={memRefs[2]}
        position={[-100, 200]}
        size={[500, 100]}
        stroke={pureColors.blue}
        lineWidth={5}
        textProps={{ text: "DATOS", fill: colors.text }}
      />
    </>
  );
  const lineRefs: Reference<Line>[] = [
    createRef<Line>(),
    createRef<Line>(),
    createRef<Line>(),
    createRef<Line>(),
    createRef<Line>(),
    createRef<Line>(),
  ];
  view.add(
    <>
      <Line
        ref={lineRefs[0]}
        stroke={pureColors.orange}
        lineWidth={5}
        points={[
          [-400, 350],
          [-400, 300],
          [-750, 300],
          [-750, 250],
        ]}
      />
      <Line
        ref={lineRefs[1]}
        stroke={pureColors.orange}
        lineWidth={5}
        points={[
          [-400, 350],
          [-400, 300],
          [-100, 300],
          [-100, 250],
        ]}
      />
      <Line
        ref={lineRefs[2]}
        stroke={pureColors.blue}
        lineWidth={5}
        points={[
          [-100, 150],
          [-100, 50],
          [-300, 50],
          [-300, -50],
        ]}
      />
      <Line
        ref={lineRefs[3]}
        stroke={pureColors.blue}
        lineWidth={5}
        points={[
          [-100, 150],
          [-100, 50],
          [100, 50],
          [100, -50],
        ]}
      />
      <Line
        ref={lineRefs[4]}
        stroke={pureColors.purple}
        lineWidth={5}
        points={[
          [-750, 150],
          [-750, -200],
          [-350, -200],
        ]}
      />
      <Line
        ref={lineRefs[5]}
        stroke={pureColors.red}
        lineWidth={5}
        points={[
          [-100, -300],
          [-100, -500],
          [300, -500],
          [300, 600],
          [-400, 600],
          [-400, 450],
        ]}
      />
    </>
  );

  yield* warningBeginSlide(readyRef, "NEXT QUESTION");
  yield* all(
    aluRef().scale(0, 0.5),
    ...memRefs.map((memRef: Reference<Memory>) => memRef().scale(0, 0.5)),
    ...lineRefs.map((lineRef: Reference<Line>) => lineRef().scale(0, 0.5))
  );
  aluRef().remove();
  memRefs.map((memRef: Reference<Memory>) => memRef().remove());
  lineRefs.map((lineRef: Reference<Line>) => lineRef().remove());

  questionRef().text("¿Cómo es la arquitectura de una FPGA?");
  yield* questionRef().fontSize(75, 0.5);
  yield* titleRef().text("Arquitectura: FPGA", 0.5);

  yield* warningBeginSlide(readyRef, "ARCH FPGA");
  yield* questionRef().fontSize(0, 0.5);

  const aluRefs: Reference<Alu>[] = [
    createRef<Alu>(),
    createRef<Alu>(),
    createRef<Alu>(),
  ];

  view.add(
    <>
      <Alu
        ref={aluRefs[0]}
        position={[-200, -150]}
        fill={pureColors.alternateBackground}
        stroke={pureColors.red}
        lineWidth={5}
        in0TextProps={{ text: "IN0", fill: colors.text }}
        in1TextProps={{ text: "IN1", fill: colors.text }}
        outTextProps={{ text: "OUT", fill: colors.text }}
      />
      <Alu
        ref={aluRefs[0]}
        position={[100, 100]}
        fill={pureColors.alternateBackground}
        stroke={pureColors.red}
        lineWidth={5}
        in0TextProps={{ text: "IN0", fill: colors.text }}
        in1TextProps={{ text: "IN1", fill: colors.text }}
        outTextProps={{ text: "OUT", fill: colors.text }}
      />
      <Alu
        ref={aluRefs[0]}
        position={[-450, 100]}
        fill={pureColors.alternateBackground}
        stroke={pureColors.red}
        lineWidth={5}
        in0TextProps={{ text: "IN0", fill: colors.text }}
        in1TextProps={{ text: "IN1", fill: colors.text }}
        outTextProps={{ text: "OUT", fill: colors.text }}
      />
    </>
  );

  const fpgaLineRefs: Reference<Line>[] = [
    createRef<Line>(),
    createRef<Line>(),
    createRef<Line>(),
    createRef<Line>(),
    createRef<Line>(),
    createRef<Line>(),
    createRef<Line>(),
    createRef<Line>(),
  ];
  view.add(
    <>
      <Line
        ref={fpgaLineRefs[0]}
        stroke={pureColors.red}
        lineWidth={5}
        points={[
          [-400, 450],
          [-400, 700],
        ]}
      />
      <Line
        ref={fpgaLineRefs[0]}
        stroke={pureColors.red}
        lineWidth={5}
        points={[
          [-800, 450],
          [-800, 700],
        ]}
      />
      <Line
        ref={fpgaLineRefs[0]}
        stroke={pureColors.red}
        lineWidth={5}
        points={[
          [300, 450],
          [300, 700],
        ]}
      />
      <Line
        ref={fpgaLineRefs[0]}
        stroke={pureColors.red}
        lineWidth={5}
        points={[
          [700, 450],
          [700, 700],
        ]}
      />
      <Line
        ref={fpgaLineRefs[0]}
        stroke={pureColors.red}
        lineWidth={5}
        points={[
          [500, 200],
          [500, 100],
          [100, 100],
          [100, -50],
        ]}
      />
      <Line
        ref={fpgaLineRefs[0]}
        stroke={pureColors.red}
        lineWidth={5}
        points={[
          [-600, 200],
          [-600, 100],
          [-300, 100],
          [-300, -50],
        ]}
      />
      <Line
        ref={fpgaLineRefs[0]}
        stroke={pureColors.red}
        lineWidth={5}
        points={[
          [-100, -300],
          [-100, -500],
        ]}
      />
    </>
  );

  view.add(<Rect size={100} fill={pureColors.blue} position={[-450, 100]} />);
  view.add(<Rect size={100} fill={pureColors.blue} position={[300, 100]} />);

  yield* readyRef().toggle(0.25);
  yield* beginSlide("END SLIDE");
});
