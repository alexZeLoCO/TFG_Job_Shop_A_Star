import { colors } from "@colors";
import { Ready } from "@components/Ready";
import { Title } from "@components/title";
import { makeScene2D, Txt } from "@motion-canvas/2d";
import {
  all,
  beginSlide,
  createRef,
  Reference,
  sequence,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const contents: string[] = [
    "Job Shop Scheduling Problem (JSP)",
    "Algoritmo A*",
    "Funciones heurísticas",
    "Estrategias de paralelismo",
    "FPGA",
    "Conclusiones y cierre",
  ];

  view.add(<Title text="Contenidos" fontSize={100} x={-900} y={-600} />);
  const textRef: Reference<Txt> = createRef<Txt>();
  const readyRef: Reference<Ready> = createRef<Ready>();

  view.add(
    <Txt ref={textRef} fontSize={60} x={-600} y={-200} fill={colors.text} />
  );
  view.add(<Ready ref={readyRef} />);
  yield* readyRef().toggle(0.25);

  yield* all(
    readyRef().toggle(0.25),
    sequence(
      0.5,
      ...[...contents, ""].map((_: string, limitContentIdx: number) =>
        textRef().text(
          contents
            .slice(0, limitContentIdx)
            .map(
              (content: string, contentIdx: number) =>
                `${contentIdx + 1}.\t${content}`
            )
            .join("\n"),
          1
        )
      )
    )
  );
  yield* readyRef().toggle(0.25);

  yield* beginSlide("PORTADA");
});
