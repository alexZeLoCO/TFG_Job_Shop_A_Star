import { makeProject } from "@motion-canvas/core";

import example from "./scenes/example?scene";
import AStar_Singlethread from "./scenes/AStar_Singlethread?scene";
import AStar_Recursive from "./scenes/AStar_Recursive?scene";
import AStar_FCFS from "./scenes/AStar_FCFS?scene";
import AStar_HDA from "./scenes/AStar_HDA?scene";

import { Code, LezerHighlighter } from "@motion-canvas/2d";
import { parser } from "@lezer/cpp";

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [example, AStar_Singlethread, AStar_Recursive, AStar_FCFS, AStar_HDA],
});
