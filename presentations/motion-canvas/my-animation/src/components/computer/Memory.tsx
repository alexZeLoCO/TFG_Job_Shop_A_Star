import { RectProps, TxtProps, Txt, Rect } from "@motion-canvas/2d";

export interface MemoryProps extends RectProps {
  textProps?: TxtProps;
}

export class Memory extends Rect {
  public constructor(props?: MemoryProps) {
    super({ ...props });

    this.add(<Txt {...props?.textProps} />);
  }
}
