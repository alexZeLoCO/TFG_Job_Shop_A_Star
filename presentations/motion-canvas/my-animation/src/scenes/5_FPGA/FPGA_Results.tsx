import { colors } from "@colors";
import { BarGraph } from "@components/graphs/BarGraph";
import { Ready } from "@components/Ready";
import { Title } from "@components/title";
import { warningBeginSlide } from "@components/WarningBeginSlide";
import { makeScene2D, Txt } from "@motion-canvas/2d";
import { Reference, createRef, beginSlide, all } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const titleRef: Reference<Txt> = createRef<Txt>();
  const questionRef: Reference<Txt> = createRef<Txt>();
  const graphRef: Reference<BarGraph> = createRef<BarGraph>();

  const readyRef: Reference<Ready> = createRef<Ready>();
  view.add(<Ready ref={readyRef} />);

  view.add(
    <Title ref={titleRef} fontSize={75} text="Comparativa de Arquitecturas" />
  );
  view.add(
    <Title
      ref={questionRef}
      text="¿Cómo se comparan las arquitecturas?"
      y={0}
    />
  );

  yield* warningBeginSlide(readyRef, "COMPARE x86 v. FPGA");
  yield* questionRef().fontSize(0, 0.5);
  view.add(
    <BarGraph
      legendProps={{
        y: 200,
      }}
      ref={graphRef}
      metricColors={[colors.blue, colors.red, colors.yellow, colors.green]}
      titleTextProps={{
        text: "Speedup FPGA v. x86",
        fill: colors.text,
      }}
      width={2000}
      height={800}
      scale={0}
      position={[-1000, 500]}
      axisStroke={colors.blue}
      data={[
        {
          categoryName: "1 Hilo",
          data: [
            {
              metricName: "Batch",
              value: 0.4,
            },
            {
              metricName: "FCFS",
              value: 0.4,
            },
            {
              metricName: "HDA*",
              value: 0.4,
            },
            {
              metricName: "Recursive",
              value: 1.6,
            },
          ],
        },
        {
          categoryName: "4 Hilos",
          data: [
            {
              metricName: "Batch",
              value: 0.45,
            },
            {
              metricName: "FCFS",
              value: 0.41,
            },
            {
              metricName: "HDA*",
              value: 0.1,
            },
            {
              metricName: "Recursive",
              value: 0.75,
            },
          ],
        },
        {
          categoryName: "8 Hilos",
          data: [
            {
              metricName: "Batch",
              value: 0.5,
            },
            {
              metricName: "FCFS",
              value: 0.4,
            },
            {
              metricName: "HDA*",
              value: 0.08,
            },
            {
              metricName: "Recursive",
              value: 0.4,
            },
          ],
        },
      ]}
    />
  );
  yield* all(
    graphRef().scale(1, 0.5),
    titleRef().text("Comparativa de Arquitecturas: FPGA v. x86", 0.5)
  );
  yield* readyRef().toggle(0.25);
  yield* beginSlide("END SLIDE");
});
