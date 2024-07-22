import { Img, makeScene2D } from "@motion-canvas/2d";
import { Title } from "@components/title";
import { beginSlide, waitFor } from "@motion-canvas/core";
import logo from "../../media/removed_bg_1-universidad-de-oviedo-22.png";
import qr from "../../media/cityQrCode.png";

export default makeScene2D(function* (view) {
  view.add(<Img x={-1000} y={-500} width={500} src={logo} />);
  view.add(<Img x={0} y={100} width={625} src={qr} />);
  view.add(
    <Title
      y={500}
      x={-1100}
      fontStyle={"italic"}
      fontSize={50}
      text="Autor: "
    />
  );
  view.add(
    <Title
      y={600}
      x={-1100}
      fontStyle={"italic"}
      fontSize={50}
      text="Tutor: "
    />
  );
  view.add(
    <Title y={500} x={-600} fontSize={50} text="Rodríguez López, Alejandro" />
  );
  view.add(
    <Title y={600} x={-600} fontSize={50} text="Palacios Alonso, Juan José" />
  );
  view.add(<Title y={600} x={1000} fontSize={50} text="2024-07-24" />);
  view.add(
    <Title
      textAlign="center"
      x={250}
      y={-450}
      text="Optimización de Algoritmos de
Búsqueda en Grafos:
Implementación y Comparación de Rendimiento
en FPGA"
    />
  );

  yield* waitFor(5);
  yield* beginSlide("PORTADA");
});
