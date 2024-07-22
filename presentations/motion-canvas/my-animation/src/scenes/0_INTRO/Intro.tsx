import { colors } from "@colors";
import { Ready } from "@components/Ready";
import { Title } from "@components/title";
import { Layout, makeScene2D, Txt, TxtProps } from "@motion-canvas/2d";
import {
  beginSlide,
  createRef,
  Reference,
  sequence,
} from "@motion-canvas/core";

const Text = (props: TxtProps) => (
  <Txt fontSize={75} marginBottom={50} fill={colors.text} {...props} />
);

export default makeScene2D(function* (view) {
  const texts: string[] = [
    "Problemas de complejidad alta",
    "Algoritmos de búsqueda (A*)",
    "Coste computacional alto",
    "Problema clásico (Job Shop Scheduling)",
    "Heurísticos, paralelismo y FPGA",
  ];
  const layoutRef: Reference<Layout> = createRef<Layout>();
  const textRefs: Reference<Txt>[] = texts.map(() => createRef<Txt>());
  view.add(<Title text="Introducción" fontSize={100} x={-900} y={-600} />);
  view.add(<Layout ref={layoutRef} layout direction="column" />);

  const readyRef: Reference<Ready> = createRef<Ready>();
  view.add(<Ready ref={readyRef} />);
  yield* readyRef().toggle(0.25);

  layoutRef().add(
    textRefs.map((textRef: Reference<Txt>, textRefIdx: number) => (
      <Text
        key={`Text_${textRefIdx + 1}`}
        ref={textRef}
        text={texts[textRefIdx]}
        opacity={0}
      />
    ))
  );

  yield* readyRef().toggle(0.25);
  yield* sequence(
    0.5,
    ...textRefs.map((textRef: Reference<Txt>) => textRef().opacity(1, 0.5))
  );
  yield* readyRef().toggle(0.25);

  yield* beginSlide("END SLIDE");
});
