import { Canvas } from "@react-three/fiber";
import { extend } from "@react-three/fiber";
import { useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import MeshGroup from "../components/MeshGroup";

extend({ OrbitControls });

export default function Home() {
  const [date, setDate] = useState<string>("");
  const [focusedPrefId, setFocusedPrefId] = useState<number>(15);
  return (
    <div id="root">
      <button onClick={() => setFocusedPrefId((focusedPrefId + 1) % 47)}>
        Next
      </button>
      <div style={{ position: "absolute", fontSize: "2rem" }}>{date}</div>
      <Canvas>
        <MeshGroup focusedPrefId={focusedPrefId} setDate={setDate} />
      </Canvas>
    </div>
  );
}
