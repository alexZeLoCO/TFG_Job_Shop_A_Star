import { Ready } from "@components/Ready";
import { Title } from "@components/title";
import { warningBeginSlide } from "@components/WarningBeginSlide";
import {
  Code,
  LezerHighlighter,
  lines,
  makeScene2D,
  Txt,
} from "@motion-canvas/2d";
import { Reference, beginSlide, createRef } from "@motion-canvas/core";
import { parser } from "@lezer/cpp";
import { colors, pureColors } from "@colors";
import { Config } from "Config";
import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";

export default makeScene2D(function* (view) {
  const isDarkTheme: boolean = Config.THEME === "DARK";
  const MyStyle = HighlightStyle.define(
    isDarkTheme
      ? [
          // DARK
          { tag: tags.comment, color: pureColors.brightGrabrightGray },
          { tag: tags.keyword, color: pureColors.purple },
          { tag: tags.operator, color: pureColors.blue },
          { tag: tags.name, color: pureColors.red },
          { tag: tags.number, color: pureColors.red },
          { tag: tags.typeName, color: pureColors.red },
          { tag: tags.punctuation, color: pureColors.blue },
          { tag: tags.propertyName, color: pureColors.yellow },
        ]
      : [
          // LIGHT
          { tag: tags.comment, color: pureColors.darkGray },
          { tag: tags.keyword, color: pureColors.slate },
          { tag: tags.operator, color: pureColors.blue },
          { tag: tags.name, color: pureColors.deepBurgundy },
          { tag: tags.number, color: pureColors.deepBurgundy },
          { tag: tags.typeName, color: pureColors.deepBurgundy },
          { tag: tags.punctuation, color: pureColors.blue },
          { tag: tags.propertyName, color: pureColors.slate },
        ]
  );
  const cppHighlighter = new LezerHighlighter(parser, MyStyle);

  const readyRef: Reference<Ready> = createRef<Ready>();
  view.add(<Ready ref={readyRef} />);

  const titleRef: Reference<Txt> = createRef<Txt>();
  const questionRef: Reference<Txt> = createRef<Txt>();
  view.add(<Title ref={titleRef} text="A*: Abstracción" />);
  view.add(
    <Title
      ref={questionRef}
      y={0}
      text="¿Cómo de reutilizable es el algoritmo A*?"
    />
  );
  yield* warningBeginSlide(readyRef, "SHOW INTERFACE");

  yield* questionRef().fontSize(0, 0.5);
  const codeRef: Reference<Code> = createRef<Code>();
  view.add(
    <Code ref={codeRef} highlighter={cppHighlighter} fill={colors.text} />
  );

  yield* codeRef().code(
    `
#ifndef IASTARSTATE_H
#define IASTARSTATE_H

#include <vector>
public class IAStarState
{
public:
        virtual const std::bool isGoalState() const;
        virtual const std::vector<IAStarState>& getNeighbors() const;

        virtual const unsigned int getGCost() const;
        virtual const unsigned int getHCost() const;
        const unsigned int getFCost() const
        { return this->getGCost() + this->getHCost(); };
};

#endif // IASTARSTATE_H
`,
    0.5
  );

  yield* warningBeginSlide(readyRef, "FOCUS");
  yield* codeRef().selection(lines(8, 12), 0.5);

  yield* readyRef().toggle(0.25);
  yield* beginSlide("END SLIDE");
});
