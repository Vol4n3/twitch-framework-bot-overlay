import "../style.scss";
import { Scene2d } from "jcv-ts-utils";
import { Carroue } from "./object/carroue-item";

const container = document.getElementById("scene");
if (container) {
  const scene = new Scene2d(container);
  const roue = new Carroue(0, scene.height / 2);
  scene.addItem(roue);
  roue.launch();
  roue.onStop = (choice) => console.log(choice);
}
