import { colors } from "@colors";
import {
  initial,
  Line,
  Node,
  NodeProps,
  Rect,
  signal,
  Txt,
  TxtProps,
} from "@motion-canvas/2d";
import { createSignal, SimpleSignal } from "@motion-canvas/core";

export type Metric = {
  metricName: string;
  value: number;
  minValue?: number;
  maxValue?: number;
};

export type Category = {
  categoryName: string;
  data: Metric[];
};

export interface BarGraphProps extends NodeProps {
  width?: number;
  height?: number;
  axisStroke?: string;
  titleTextProps?: TxtProps;
  data: Category[];
  metricColors: string[];
  legendProps?: TxtProps;
}

export class BarGraph extends Node {
  private readonly defaultWidth = 600;
  private barWidth = 40;
  private barMargin = 10;
  private categoryWidth = 0;
  private categoryMargin = this.barMargin;

  @initial([])
  @signal()
  public readonly data: SimpleSignal<Category[]> = createSignal();
  private heightRatio: number = 1;

  private nMetrics: number = 0;
  private nCategories: number = 0;

  @signal()
  public readonly height = createSignal(this.defaultWidth);
  @signal()
  public readonly width = createSignal(this.defaultWidth);

  public constructor(props?: BarGraphProps) {
    super({ ...props });

    this.data(props?.data || []);
    this.nCategories = this.data().length;
    this.nMetrics = this.nCategories === 0 ? 0 : this.data()[0].data.length;

    this.height(props ? props.height ?? this.defaultWidth : this.defaultWidth);
    this.width(props ? props.width ?? this.defaultWidth : this.defaultWidth);

    this.categoryWidth = (this.width() / this.nCategories) * 0.9;
    this.categoryMargin = (this.width() / this.nCategories) * 0.1;

    this.barWidth = (this.categoryWidth / this.nMetrics) * 0.9;
    this.barMargin = (this.categoryWidth / this.nMetrics) * 0.1;

    this.heightRatio = this.getHeightRatio();

    let legendPosition = [
      this.width(),
      -1 * this.height() - 75 * this.nMetrics,
    ];
    if (props?.legendProps?.x)
      legendPosition[0] = legendPosition[0] + props.legendProps.x; // Ignore this error...
    if (props?.legendProps?.y)
      legendPosition[1] = legendPosition[1] + props.legendProps.y; // Ignore this error...
    this.add(
      <>
        <Txt
          fontSize={75}
          fill={colors.text}
          position={[this.width() / 2, -1 * this.height() - 100]}
          {...props?.titleTextProps}
        />
        {props!.metricColors.map((metricColor: string, metricIdx: number) => (
          <Txt
            fontSize={75}
            key={`LegendMetric_${props?.titleTextProps?.text}_${metricIdx + 1}`}
            fill={metricColor}
            text={this.data()[0].data[metricIdx].metricName}
            position={[legendPosition[0], legendPosition[1] + metricIdx * 75]}
          />
        ))}
        <Line
          endArrow
          arrowSize={16}
          points={[
            [0, 0],
            [0, -1 * this.height()],
          ]}
          stroke={props ? props.axisStroke : colors.text}
          lineWidth={5}
        />
        <Line
          endArrow
          arrowSize={16}
          points={[
            [0, 0],
            [this.width(), 0],
          ]}
          stroke={props ? props.axisStroke : colors.text}
          lineWidth={5}
        />
      </>
    );
    for (let categoryIdx = 0; categoryIdx < this.data().length; categoryIdx++) {
      const categoryXPos: number =
        this.categoryMargin / 2 +
        categoryIdx * (this.categoryWidth + this.categoryMargin);
      this.add(
        <Txt
          fontSize={75}
          position={[categoryXPos + this.categoryWidth / 2, 100]}
          text={this.data()[categoryIdx].categoryName}
          fill={colors.text}
        />
      );
      for (
        let metricIdx = 0;
        metricIdx < this.data()[categoryIdx].data.length;
        metricIdx++
      ) {
        const xPosition: number =
          categoryXPos +
          this.barMargin / 2 +
          metricIdx * (this.barWidth + this.barMargin) +
          this.barWidth / 2;
        const height: number =
          this.heightRatio * this.data()[categoryIdx].data[metricIdx].value;
        this.add(
          <>
            <Rect
              position={[xPosition, -height / 2 - 2]}
              width={this.barWidth - this.barMargin}
              height={height}
              // stroke={props!.metricColors[metricIdx]}
              // lineWidth={20}
              fill={props!.metricColors[metricIdx]}
            />
            <Txt
              fontSize={75}
              position={[xPosition, -height + 50]}
              text={this.data()[categoryIdx].data[metricIdx].value.toString()}
              fill={colors.text}
            />
          </>
        );
      }
    }
  }

  private getHeightRatio() {
    if (this.data().length === 0 || this.data()[0].data.length === 0)
      return this.defaultWidth;
    let localMaxValue: number | undefined = undefined;
    for (const element of this.data()) {
      const readings: number[] = element.data.map((e) => e.value);
      for (const element of readings)
        if (!localMaxValue || localMaxValue < element) localMaxValue = element;
    }
    this.heightRatio = localMaxValue ? this.height() / localMaxValue : 1;
    return this.heightRatio;
  }
}
