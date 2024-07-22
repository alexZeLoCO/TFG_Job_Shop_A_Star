import { Code, lines, makeScene2D } from "@motion-canvas/2d";
import { all, beginSlide, createRef } from "@motion-canvas/core";
import { colors } from "@colors";

export default makeScene2D(function* (view) {
  const badCodeRef = createRef<Code>();

  const goodCodeRef = createRef<Code>();

  view.add(
    <Code
      fill={colors.text}
      fontSize={55}
      ref={badCodeRef}
      code={`
void blur(
  float* in_imageStart,
  const unsigned int in_imageSize,
  float* out_imageStart)
{
  for (unsigned int idx = 1 ; idx < in_imageSize - 1 ; idx++)
  {
    const float *currentPixel = in_imageStart + idx;
    const float leftPixel = *(currentPixel - 1) * 0.3;
    const float middlePixel = *(currentPixel + 0) * 0.3;
    const float rightPixel = *(currentPixel + 1) * 0.3;
        
    *(out_imageStart + idx) = leftPixel + middlePixel + rightPixel;
  }
}
`}
    />
  );

  yield* beginSlide("REMOVE FUNCTION HEAD");

  yield* all(
    badCodeRef().code.remove(lines(1, 5), 0.5),
    badCodeRef().code.remove(lines(14), 0.5)
  );

  yield* beginSlide("FORMAT FUNCTION BODY");

  yield* all(
    badCodeRef().code(
      `
for (
  unsigned int idx = 1 ;
  idx < in_imageSize - 1 ;
  idx++
) {
  const float *currentPixel = (
    in_imageStart + idx);
  const float leftPixel = *(
    currentPixel - 1);
  const float middlePixel = *(
    currentPixel + 0);
  const float rightPixel = *(
    currentPixel + 1);
    
  *(out_imageStart + idx) = (
    leftPixel +
    middlePixel +
    rightPixel) * 0.3;
}`,
      0.5
    ),
    badCodeRef().x(-700, 0.5)
  );

  view.add(
    <Code
      fill={colors.text}
      ref={goodCodeRef}
      code={`
for (
  unsigned int idx = 1;
  idx < in_imageSize - 1;
  idx++
) {
  const float *currentPixel = (
    in_imageStart + idx);
  const float leftPixel = *(
    currentPixel - 1);
  const float middlePixel = *(
    currentPixel + 0);
  const float rightPixel = *(
    currentPixel + 1);
    
  *(out_imageStart + idx) = (
    leftPixel +
    middlePixel +
    rightPixel) * 0.3;
}`}
      x={-700}
      fontSize={55}
    />
  );

  yield* beginSlide("DUPLICATE CODE");

  yield* goodCodeRef().x(500, 0.5);

  yield* beginSlide("REMOVE FOR LOOP");

  yield* goodCodeRef().code(
    `
for (
  unsigned int idx = 1;
  idx < in_imageSize - 1;
  idx++
) {

  /*
   * ...
   */
    
}`,
    0.5
  );

  yield* beginSlide("PRELOAD LEFT & MIDDLE");

  yield* goodCodeRef().code(
    `
float* leftPixel = (
  in_imageStart + 0);
float* middlePixel = (
  in_imageStart + 1);
for (
  unsigned int idx = 1;
  idx < in_imageSize - 1;
  idx++
) {

  /*
   * ...
   */
    
}`,
    0.5
  );

  yield* beginSlide("READ CURRENT PIXEL");

  yield* goodCodeRef().code(
    `
float* leftPixel = (
  in_imageStart + 0);
float* middlePixel = (
  in_imageStart + 1);
for (
  unsigned int idx = 1;
  idx < in_imageSize - 1;
  idx++
) {
  const float* rightPixel = *(
    in_imageStart + idx + 1);

  /*
   * ...
   */
  
}`,
    0.5
  );

  yield* beginSlide("WRITE OUTPUT");

  yield* goodCodeRef().code(
    `
float* leftPixel = (
  in_imageStart + 0);
float* middlePixel = (
  in_imageStart + 1);
for (
  unsigned int idx = 1;
  idx < in_imageSize - 1;
  idx++
) {
  const float* rightPixel = *(
    in_imageStart + idx + 1);
  *(out_imageStart + idx) = (
    *leftPixel +
    *middlePixel +
    *rightPixel) * 0.3;

  /*
   * ...
   */
  
}`,
    0.5
  );

  yield* beginSlide("UPDATE LEFT & MIDDLE");

  yield* goodCodeRef().code(
    `
float* leftPixel = (
  in_imageStart + 0);
float* middlePixel = (
  in_imageStart + 1);
for (
  unsigned int idx = 1;
  idx < in_imageSize - 1;
  idx++
) {
  const float* rightPixel = *(
    in_imageStart + idx + 1);
  *(out_imageStart + idx) = (
    *leftPixel +
    *middlePixel +
    *rightPixel) * 0.3;
  leftPixel = middlePixel;
  middlePixel = rightPixel;
}`,
    0.5
  );

  /*
  view.add(
    <Rect
      ref={goodCodeRefRect}
      radius={50}
      width={2500}
      height={1000}
      fill={colors.alternativeBackground}
    >
      <Code
        fontSize={45}
        ref={goodCodeRef}
        code={`
void blur(
    float* in_imageStart,
    const unsigned int in_imageSize,
    float* out_imageStart)
{
    float leftPixel = *(in_imageStart) * 0.3;
    float middlePixel = *(in_imageStart + 1) * 0.3;
    for (unsigned int idx = 1 ; idx < in_imageSize - 1 ; idx++)
    {
        const float rightPixel = *(in_imageStart + idx) * 0.3;
        
        *(out_imageStart + idx) = leftPixel + middlePixel + rightPixel;

        leftPixel = middlePixel;
        middlePixel = rightPixel;
    }
}
`}
      />
    </Rect>
  );

  yield* all(
    goodCodeRef().fontSize(25, 1),
    goodCodeRefRect().x(700, 1),
    goodCodeRefRect().y(-450, 1),
    goodCodeRefRect().width(1200, 1),
    goodCodeRefRect().height(500, 1)
  );
  */

  yield* beginSlide("END SLIDE");
});
