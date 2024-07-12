import { Img, makeScene2D } from "@motion-canvas/2d";
import { Title } from "../components/title";
import { beginSlide } from "@motion-canvas/core";
import logo from "../media/removed_bg_1-universidad-de-oviedo-22.png";

export default makeScene2D(function* (view) {
  view.add(<Img x={-1000} y={-500} width={500} src={logo} />);
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
  view.add(
    <Title
      textAlign="center"
      x={1}
      y={1}
      text="Optimización de Algoritmos de
Búsqueda en Grafos:
Implementación y Comparación de Rendimiento
en FPGA"
    />
  );

  yield* beginSlide("PORTADA");
});
