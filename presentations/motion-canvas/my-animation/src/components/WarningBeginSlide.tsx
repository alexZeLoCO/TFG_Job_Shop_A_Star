import { beginSlide, Reference } from "@motion-canvas/core";
import { Ready } from "./Ready";

export function* warningBeginSlide(
  readyRef: Reference<Ready>,
  slideName: string
) {
  yield* readyRef().toggle(0.25);
  yield* beginSlide(slideName);
  yield* readyRef().toggle(0.25);
}
