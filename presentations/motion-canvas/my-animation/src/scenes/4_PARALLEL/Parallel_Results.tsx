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
    <Title ref={titleRef} fontSize={75} text="Comparativa de Algoritmos" />
  );
  view.add(
    <Title ref={questionRef} text="¿Cómo se comparan los algoritmos?" y={0} />
  );

  yield* warningBeginSlide(readyRef, "COMPARE BATCH v. FCFS");
  yield* questionRef().fontSize(0, 0.5);
  view.add(
    <BarGraph
      legendProps={{
        x: 100,
      }}
      ref={graphRef}
      metricColors={[colors.red, colors.blue]}
      titleTextProps={{
        text: "Tiempo de ejecución FCFS v. Batch",
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
              metricName: "FCFS",
              value: 0.48,
            },
            {
              metricName: "Batch",
              value: 0.5,
            },
          ],
        },
        {
          categoryName: "4 Hilos",
          data: [
            {
              metricName: "FCFS",
              value: 0.52,
            },
            {
              metricName: "Batch",
              value: 0.6,
            },
          ],
        },
        {
          categoryName: "8 Hilos",
          data: [
            {
              metricName: "FCFS",
              value: 0.51,
            },
            {
              metricName: "Batch",
              value: 0.65,
            },
          ],
        },
      ]}
    />
  );
  yield* all(
    graphRef().scale(1, 0.5),
    titleRef().text("Comparativa de Algoritmos: FCFS v. Batch", 0.5)
  );
  yield* warningBeginSlide(readyRef, "COMPARE FCFS v. Recursive");
  yield* graphRef().scale(0, 0.5);
  view.add(
    <BarGraph
      ref={graphRef}
      metricColors={[colors.red, colors.blue]}
      titleTextProps={{
        text: "Tiempo de ejecución FCFS v. Recursive",
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
              metricName: "FCFS",
              value: 0.48,
            },
            {
              metricName: "Recursive",
              value: 2,
            },
          ],
        },
        {
          categoryName: "4 Hilos",
          data: [
            {
              metricName: "FCFS",
              value: 0.52,
            },
            {
              metricName: "Recursive",
              value: 0.8,
            },
          ],
        },
        {
          categoryName: "8 Hilos",
          data: [
            {
              metricName: "FCFS",
              value: 0.51,
            },
            {
              metricName: "Recursive",
              value: 0.5,
            },
          ],
        },
      ]}
    />
  );
  yield* all(
    graphRef().scale(1, 0.5),
    titleRef().text("Comparativa de Algoritmos: FCFS v. HDA*", 0.5)
  );
  yield* warningBeginSlide(readyRef, "COMPARE FCFS v. HDA*");
  yield* graphRef().scale(0, 0.5);
  view.add(
    <BarGraph
      ref={graphRef}
      metricColors={[colors.red, colors.blue]}
      titleTextProps={{
        text: "Tiempo de ejecución FCFS v. HDA*",
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
              metricName: "FCFS",
              value: 0.48,
            },
            {
              metricName: "HDA*",
              value: 0.49,
            },
          ],
        },
        {
          categoryName: "4 Hilos",
          data: [
            {
              metricName: "FCFS",
              value: 0.52,
            },
            {
              metricName: "HDA*",
              value: 0.14,
            },
          ],
        },
        {
          categoryName: "8 Hilos",
          data: [
            {
              metricName: "FCFS",
              value: 0.51,
            },
            {
              metricName: "HDA*",
              value: 0.09,
            },
          ],
        },
      ]}
    />
  );
  yield* all(
    graphRef().scale(1, 0.5),
    titleRef().text("Comparativa de Algoritmos: FCFS v. HDA*", 0.5)
  );
  yield* readyRef().toggle(0.25);
  yield* beginSlide("END SLIDE");
});
