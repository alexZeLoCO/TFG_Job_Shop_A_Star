import { colors, pureColors } from "@colors";
import { BarGraph } from "@components/graphs/BarGraph";
import { Ready } from "@components/Ready";
import { Title } from "@components/title";
import { warningBeginSlide } from "@components/WarningBeginSlide";
import { makeScene2D, Txt } from "@motion-canvas/2d";
import { beginSlide, createRef, Reference } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const titleRef: Reference<Txt> = createRef<Txt>();
  const questionRef: Reference<Txt> = createRef<Txt>();
  const graphRef: Reference<BarGraph> = createRef<BarGraph>();
  view.add(
    <Title ref={titleRef} fontSize={75} text="Comparativa de Heurísticos" />
  );
  view.add(
    <Title
      ref={questionRef}
      text="¿Cómo se comparan los dos heurísticos?"
      y={0}
    />
  );

  const readyRef: Reference<Ready> = createRef<Ready>();
  view.add(<Ready ref={readyRef} y={-200} x={100} />);

  yield* warningBeginSlide(readyRef, "COMPARE 8T");
  yield* questionRef().fontSize(0, 0.5);
  const rMultiplier: number = 100;
  view.add(
    <Txt
      position={[-900, -400]}
      fontSize={50}
      fill={colors.text}
      text={`(Tiempo de ejecución x${rMultiplier})`}
    />
  );
  view.add(
    <BarGraph
      ref={graphRef}
      metricColors={[colors.red, colors.blue, colors.yellow, colors.purple]}
      titleTextProps={{ text: "8 HILOS", fill: colors.text }}
      width={2000}
      height={800}
      scale={0}
      position={[-1000, 500]}
      axisStroke={colors.blue}
      data={[
        {
          categoryName: "Batch Solver",
          data: [
            {
              metricName: "(M) Lento",
              value: 450,
            },
            {
              metricName: "(M) Rápido",
              value: 475,
            },
            {
              metricName: "(R) Lento",
              value: 4.25 * rMultiplier,
            },
            {
              metricName: "(R) Rápido",
              value: 0.3 * rMultiplier,
            },
          ],
        },
        {
          categoryName: "FCFS Solver",
          data: [
            {
              metricName: "(M) Lento",
              value: 475,
            },
            {
              metricName: "(M) Rápido",
              value: 500,
            },
            {
              metricName: "(R) Lento",
              value: 4 * rMultiplier,
            },
            {
              metricName: "(R) Rápido",
              value: 0.1 * rMultiplier,
            },
          ],
        },
        {
          categoryName: "HDA* Solver",
          data: [
            {
              metricName: "(M) Lento",
              value: 475,
            },
            {
              metricName: "(M) Rápido",
              value: 600,
            },
            {
              metricName: "(R) Lento",
              value: 0.6 * rMultiplier,
            },
            {
              metricName: "(R) Rápido",
              value: 0.1 * rMultiplier,
            },
          ],
        },
        {
          categoryName: "Recursive Solver",
          data: [
            {
              metricName: "(M) Lento",
              value: 450,
            },
            {
              metricName: "(M) Rápido",
              value: 475,
            },
            {
              metricName: "(R) Lento",
              value: 3 * rMultiplier,
            },
            {
              metricName: "(R) Rápido",
              value: 0.1 * rMultiplier,
            },
          ],
        },
      ]}
    />
  );
  yield* graphRef().scale(1, 0.5);
  yield* warningBeginSlide(readyRef, "COMPARE 1T");
  yield* graphRef().scale(0, 0.5);
  graphRef().remove();
  view.add(
    <BarGraph
      ref={graphRef}
      metricColors={[colors.red, colors.blue, colors.yellow, colors.purple]}
      titleTextProps={{ text: "1 HILO", fill: colors.text }}
      width={2000}
      height={800}
      scale={0}
      position={[-1000, 500]}
      axisStroke={colors.blue}
      data={[
        {
          categoryName: "Batch Solver",
          data: [
            {
              metricName: "(M) Lento",
              value: 450,
            },
            {
              metricName: "(M) Rápido",
              value: 475,
            },
            {
              metricName: "(R) Lento",
              value: 3 * rMultiplier,
            },
            {
              metricName: "(R) Rápido",
              value: 0.01 * rMultiplier,
            },
          ],
        },
        {
          categoryName: "FCFS Solver",
          data: [
            {
              metricName: "(M) Lento",
              value: 450,
            },
            {
              metricName: "(M) Rápido",
              value: 475,
            },
            {
              metricName: "(R) Lento",
              value: 2.75 * rMultiplier,
            },
            {
              metricName: "(R) Rápido",
              value: 0.01 * rMultiplier,
            },
          ],
        },
        {
          categoryName: "HDA* Solver",
          data: [
            {
              metricName: "(M) Lento",
              value: 450,
            },
            {
              metricName: "(M) Rápido",
              value: 475,
            },
            {
              metricName: "(R) Lento",
              value: 2.5 * rMultiplier,
            },
            {
              metricName: "(R) Rápido",
              value: 0.01 * rMultiplier,
            },
          ],
        },
        {
          categoryName: "Recursive Solver",
          data: [
            {
              metricName: "(M) Lento",
              value: 450,
            },
            {
              metricName: "(M) Rápido",
              value: 475,
            },
            {
              metricName: "(R) Lento",
              value: 11 * rMultiplier,
            },
            {
              metricName: "(R) Rápido",
              value: 0.01 * rMultiplier,
            },
          ],
        },
      ]}
    />
  );
  yield* graphRef().scale(1, 0.5);
  yield* warningBeginSlide(readyRef, "RANDOM SOLVER");
  yield* graphRef().scale(0, 0.5);
  graphRef().remove();
  view.add(
    <BarGraph
      ref={graphRef}
      metricColors={[pureColors.blue, pureColors.red, pureColors.green]}
      titleTextProps={{ text: "Makespan", fill: colors.text }}
      width={2000}
      height={800}
      scale={0}
      position={[-1000, 500]}
      axisStroke={colors.blue}
      data={[
        {
          categoryName: "Algoritmos",
          data: [
            {
              metricName: "Óptimo / Lento",
              value: 700,
            },
            {
              metricName: "Rápido",
              value: 800,
            },
            {
              metricName: "Random",
              value: 1050,
            },
          ],
        },
      ]}
    />
  );
  yield* graphRef().scale(1, 0.5);
  yield* readyRef().toggle(0.25);
  yield* beginSlide("END SLIDE");
});
