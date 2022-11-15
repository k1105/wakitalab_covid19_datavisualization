import { Canvas } from "@react-three/fiber";
import { extend } from "@react-three/fiber";
import { useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import MeshGroup from "../components/MeshGroup";

extend({ OrbitControls });

export default function Home() {
  const [date, setDate] = useState<string>("");
  return (
    <div id="root">
      <div style={{ position: "absolute", fontSize: "2rem" }}>{date}</div>
      <Canvas>
        <MeshGroup date={date} setDate={setDate} />
      </Canvas>
    </div>
  );
}
