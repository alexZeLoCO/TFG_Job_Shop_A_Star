import { pureColors } from "@colors";
import { NodeProps, Node, Txt } from "@motion-canvas/2d";
import { all, createRef, Reference, waitFor } from "@motion-canvas/core";
import { Config } from "Config";

export interface ReadyProps extends NodeProps {}

export class Ready extends Node {
  private status: boolean = false;

  private readonly txtRef: Reference<Txt> = createRef<Txt>();
  public constructor(props?: ReadyProps) {
    super({ ...props });

    this.add(
      <Txt
        ref={this.txtRef}
        text={this.status ? "RDY" : "ANM"}
        position={[1000, 600]}
        fill={this.status ? pureColors.green : pureColors.orange}
        fontSize={75}
      />
    );
  }

  public *toggle(duration: number) {
    const newStatus: boolean = !this.status;
    yield* all(
      this.txtRef().text(newStatus ? "RDY" : "ANM", duration),
      this.txtRef().fill(
        newStatus ? pureColors.green : pureColors.orange,
        duration
      )
    );
    if (newStatus) yield* waitFor(Config.WAIT);
    this.status = newStatus;
  }
}
