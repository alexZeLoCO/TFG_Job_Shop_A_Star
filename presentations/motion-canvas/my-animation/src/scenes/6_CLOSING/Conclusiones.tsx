import { colors } from "@colors";
import { Ready } from "@components/Ready";
import { Title } from "@components/title";
import { makeScene2D, Txt } from "@motion-canvas/2d";
import {
  beginSlide,
  createRef,
  Reference,
  sequence,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const contents: string[] = [
    "El algoritmo A* es adaptable a una variedad de problemas.",
    "La selección del heurístico es el principal factor que determinará el rendimiento.",
    "El paralelismo puede beneficiar al algoritmo A* si está diseñado correctamente.",
    "El manejo del open set es el principal problema del A*.",
    "El uso de HLS para transpilar una implementación existente de A* no es práctica.",
  ];
  const textRef: Reference<Txt> = createRef<Txt>();

  const readyRef: Reference<Ready> = createRef<Ready>();
  view.add(<Ready ref={readyRef} />);

  view.add(<Title text="Conclusiones" />);
  view.add(
    <Txt ref={textRef} fontSize={60} x={-1200} y={-250} fill={colors.text} />
  );

  yield* sequence(
    0.5,
    ...[...contents, ""].map((_: string, limitContentIdx: number) =>
      textRef().text(
        contents
          .slice(0, limitContentIdx)
          .map(
            (content: string, contentIdx: number) =>
              `${contentIdx + 1}.\t${content}`
          )
          .join("\n\n"),
        1
      )
    )
  );
  yield* readyRef().toggle(0.25);
  yield* beginSlide("END SLIDE");
});
