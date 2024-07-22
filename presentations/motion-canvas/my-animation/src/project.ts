import { makeProject } from "@motion-canvas/core";

import { Code, LezerHighlighter } from "@motion-canvas/2d";
import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { parser } from "@lezer/javascript";
import { pureColors } from "./colors";

import Title from "./scenes/0_INTRO/Title?scene";
import Intro from "./scenes/0_INTRO/Intro?scene";
import Index from "./scenes/0_INTRO/Index?scene";

import JSP from "./scenes/1_JSP/JSP?scene";

import example from "./scenes/2_ASTAR/example?scene";
import Polymorphism from "./scenes/2_ASTAR/Polymorphism?scene";

import Heuristics from "./scenes/3_HEURISTICS/Heuristics?scene";
import Heuristics_Results from "./scenes/3_HEURISTICS/Heuristics_Results?scene";
import JSP_Optimal from "./scenes/3_HEURISTICS/JSP_Optimal?scene";
import JSP_Fast from "./scenes/3_HEURISTICS/JSP_Fast?scene";
import Plano from "./scenes/3_HEURISTICS/Plano?scene";

import AStar_Batch from "./scenes/4_PARALLEL/AStar_Batch?scene";
import AStar_FCFS from "./scenes/4_PARALLEL/AStar_FCFS?scene";
import AStar_HDA from "./scenes/4_PARALLEL/AStar_HDA?scene";
import AStar_Recursive from "./scenes/4_PARALLEL/AStar_Recursive?scene";
import AStar_Singlethread from "./scenes/4_PARALLEL/AStar_Singlethread?scene";
import Parallel_Results from "./scenes/4_PARALLEL/Parallel_Results?scene";

import Arch from "./scenes/5_FPGA/Arch?scene";
import FPGA_Results from "scenes/5_FPGA/FPGA_Results?scene";

import Conclusiones from "scenes/6_CLOSING/Conclusiones?scene";
import Alt_Title from "scenes/6_CLOSING/Alt_Title?scene";

import { Config } from "Config";

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

Code.defaultHighlighter = new LezerHighlighter(parser, MyStyle);

export default makeProject({
  scenes: [
    Title,
    Intro,
    Index,
    JSP,
    example,
    Polymorphism,
    Heuristics,
    JSP_Optimal,
    JSP_Fast,
    Plano,
    Heuristics_Results,
    AStar_Singlethread,
    AStar_Recursive,
    AStar_Batch,
    AStar_FCFS,
    AStar_HDA,
    Parallel_Results,
    Arch,
    FPGA_Results,
    Conclusiones,
    Alt_Title,
  ],
});
