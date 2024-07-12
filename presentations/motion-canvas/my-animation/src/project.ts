import { makeProject } from "@motion-canvas/core";

import example from "./scenes/example?scene";
import AStar_Singlethread from "./scenes/AStar_Singlethread?scene";
import AStar_Recursive from "./scenes/AStar_Recursive?scene";
import AStar_FCFS from "./scenes/AStar_FCFS?scene";
import AStar_Batch from "./scenes/AStar_Batch?scene";
import AStar_HDA from "./scenes/AStar_HDA?scene";
import Title from "./scenes/Title?scene";
import FPGA_II from "./scenes/FPGA_II?scene";

import { Code, LezerHighlighter } from "@motion-canvas/2d";
import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { parser } from "@lezer/cpp";
import { colors } from "./colors";

const MyStyle = HighlightStyle.define([
  { tag: tags.keyword, color: colors.purple },
  { tag: tags.operator, color: colors.purple },
  { tag: tags.name, color: colors.blue },
  { tag: tags.number, color: colors.yellow },
  { tag: tags.typeName, color: colors.purple },
  { tag: tags.punctuation, color: colors.text },
  { tag: tags.propertyName, color: colors.blue },
]);

Code.defaultHighlighter = new LezerHighlighter(parser, MyStyle);
// Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [
    Title,
    example,
    AStar_Singlethread,
    AStar_Batch,
    AStar_Recursive,
    AStar_FCFS,
    AStar_HDA,
    FPGA_II,
  ],
});
