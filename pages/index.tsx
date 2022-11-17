import { Canvas } from "@react-three/fiber";
import { extend } from "@react-three/fiber";
import { useState, useRef, useMemo } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import MeshGroup from "../components/MeshGroup";

extend({ OrbitControls });

type Case = { case: number[]; all: number; date: string };
type PrefLatLon = { pref_name: string; lat: string; lon: string };
type PrefPopulation = { population: number[] };

export default function Home() {
  const [date, setDate] = useState<string>("");
  const [focusedPrefId, setFocusedPrefId] = useState<number>(15);
  const covidCases = useRef<Case[]>();
  const prefLatLon = useRef<PrefLatLon[]>();
  const prefPopulation = useRef<PrefPopulation>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [caseCount, setCaseCount] = useState<number>(0);

  useMemo(() => {
    const getJson = async () => {
      prefLatLon.current = await fetch("/data/pref_lat_lon.json").then((data) =>
        data.json()
      );
      covidCases.current = await fetch("/data/casesMin.json").then((data) =>
        data.json()
      );
      prefPopulation.current = await fetch("/data/pref_population.json").then(
        (data) => data.json()
      );
    };
    getJson().then(() => {
      setIsLoading(false);
    });
  }, []);
  return (
    <div id="root">
      <button onClick={() => setFocusedPrefId((focusedPrefId + 1) % 47)}>
        Next
      </button>
      <button onClick={() => setFocusedPrefId((focusedPrefId - 1 + 47) % 47)}>
        Prev
      </button>
      <div style={{ position: "absolute", fontSize: "1.5rem" }}>
        <p>
          <strong>
            {typeof prefLatLon.current == "undefined"
              ? ""
              : prefLatLon.current[focusedPrefId].pref_name}
          </strong>
        </p>
        <p>{date}</p>
        <p>{caseCount}</p>
      </div>
      <Canvas>
        {isLoading ? (
          <></>
        ) : (
          <MeshGroup
            focusedPrefId={focusedPrefId}
            setDate={setDate}
            prefLatLon={prefLatLon.current as PrefLatLon[]}
            prefPopulation={prefPopulation.current as PrefPopulation}
            covidCases={covidCases.current as Case[]}
            setCaseCount={setCaseCount}
          />
        )}
      </Canvas>
    </div>
  );
}
