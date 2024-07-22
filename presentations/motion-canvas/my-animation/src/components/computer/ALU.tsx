import { colors } from "@colors";
import { NodeProps, TxtProps, Spline, Txt, Node } from "@motion-canvas/2d";

export interface AluProps extends NodeProps {
  fill?: string;
  stroke?: string;
  lineWidth?: number;
  in0TextProps?: TxtProps;
  in1TextProps?: TxtProps;
  outTextProps?: TxtProps;
  in2TextProps?: TxtProps;
}

export class Alu extends Node {
  public constructor(props?: AluProps) {
    super({ ...props });

    this.add(
      <>
        <Spline
          smoothness={0}
          points={[
            [0, 250],
            [200, 250],
            [250, 150],
            [350, 150],
            [400, 250],
            [600, 250],
            [500, 0],
            [100, 0],
            [0, 250],
          ]}
          {...props}
        />
        <Txt
          x={this.x() + 125}
          y={this.y() + 200}
          fill={colors.text}
          {...props?.in0TextProps}
        />
        <Txt
          x={this.x() + 475}
          y={this.y() + 200}
          fill={colors.text}
          {...props?.in1TextProps}
        />
        <Txt
          x={this.x() + 125}
          y={this.y() + 100}
          fill={colors.text}
          {...props?.in2TextProps}
        />
        <Txt
          x={this.x() + 300}
          y={this.y() + 50}
          fill={colors.text}
          {...props?.outTextProps}
        />
      </>
    );
  }
}
