import { colors } from "@colors";
import { Ready } from "@components/Ready";
import { warningBeginSlide } from "@components/WarningBeginSlide";
import { Circle, Latex, Line, makeScene2D } from "@motion-canvas/2d";
import {
  PossibleVector2,
  Reference,
  all,
  beginSlide,
  createRef,
} from "@motion-canvas/core";
import { createSecureServer } from "http2";

type TexStuffType = {
  texPos: PossibleVector2;
  circlePos: PossibleVector2;
  fontSize: number;
  tex: string;
  texRef: Reference<Latex>;
  circleRef: Reference<Circle>;
  circleFill: string;
};

export default makeScene2D(function* (view) {
  const readyRef: Reference<Ready> = createRef<Ready>();
  view.add(<Ready ref={readyRef} />);

  const lineRef: Reference<Line> = createRef<Line>();
  const limitRefs: Reference<Line>[] = [createRef<Line>(), createRef<Line>()];

  view.add(
    <>
      <Line
        ref={lineRef}
        stroke={colors.text}
        lineWidth={5}
        points={[[0, 0]]}
      />
      <Line
        ref={limitRefs[0]}
        stroke={colors.text}
        lineWidth={5}
        points={[[-1000, 0]]}
      />
      <Line
        ref={limitRefs[1]}
        stroke={colors.text}
        lineWidth={5}
        points={[[1000, 0]]}
      />
    </>
  );

  yield* all(
    lineRef().points(
      [
        [-1100, 0],
        [1100, 0],
      ],
      0.5
    ),
    limitRefs[0]().points(
      [
        [-1000, -100],
        [-1000, 100],
      ],
      0.5
    ),
    limitRefs[1]().points(
      [
        [1000, -100],
        [1000, 100],
      ],
      0.5
    )
  );

  yield* warningBeginSlide(readyRef, "ADD HEURISTICS");
  const texStuff: TexStuffType[] = [
    {
      texPos: [-850, -200],
      circlePos: [-850, 0],
      tex: `{\\color{${colors.text}}0}`,
      fontSize: 75,
      texRef: createRef<Latex>(),
      circleRef: createRef<Circle>(),
      circleFill: colors.blue,
    },
    {
      texPos: [0, -200],
      circlePos: [0, 0],
      tex: `{\\color{${colors.text}}\\max_{0<j<J}(\\sum_{t=J_{j,k}}^T D_{j,t})}`,
      fontSize: 300,
      texRef: createRef<Latex>(),
      circleRef: createRef<Circle>(),
      circleFill: colors.green,
    },
    {
      texPos: [850, -200],
      circlePos: [850, 0],
      tex: `{\\color{${colors.text}}\\sum_{j=0}^J(\\sum_{t=J_{j,k}}^T D_{j,t})}`,
      fontSize: 300,
      texRef: createRef<Latex>(),
      circleRef: createRef<Circle>(),
      circleFill: colors.yellow,
    },
  ];

  view.add(
    <>
      {texStuff.map((currentTexStuff: TexStuffType) => (
        <>
          <Latex
            ref={currentTexStuff.texRef}
            height={0}
            tex={currentTexStuff.tex}
            position={currentTexStuff.texPos}
          />
          <Circle
            ref={currentTexStuff.circleRef}
            size={0}
            fill={currentTexStuff.circleFill}
            position={currentTexStuff.circlePos}
          />
        </>
      ))}
    </>
  );
  yield* all(
    ...texStuff.map((currentTexStuff: TexStuffType) =>
      all(
        currentTexStuff.texRef().height(currentTexStuff.fontSize, 0.5),
        currentTexStuff.circleRef().size(100, 0.5)
      )
    )
  );
  yield* readyRef().toggle(0.5);
  yield* beginSlide("END SLIDE");
});
