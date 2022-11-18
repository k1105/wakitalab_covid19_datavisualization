import { Canvas } from "@react-three/fiber";
import { extend } from "@react-three/fiber";
import { useState, useRef, useMemo } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import MeshGroup from "../components/MeshGroup";

extend({ OrbitControls });

type WeeklyCase = {
  begin_date: string;
  end_date: string;
  weekly_average_case: number[];
  all: number;
};
type PrefLatLon = { pref_name: string; lat: string; lon: string };
type PrefPopulation = { population: number[] };
type GovMeasure = {
  status: "kinkyu" | "manbou";
  begin_at: string;
  end_at: string;
  pref_id: number;
};

export default function Home() {
  const [focusedPrefId, setFocusedPrefId] = useState<number>(15);
  const weeklyCases = useRef<WeeklyCase[]>();
  const prefLatLon = useRef<PrefLatLon[]>();
  const prefPopulation = useRef<PrefPopulation>();
  const govMeasures = useRef<GovMeasure[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const beginAtRef = useRef<HTMLParagraphElement>(null);
  const endAtRef = useRef<HTMLParagraphElement>(null);
  const caseCountRef = useRef<HTMLParagraphElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const [pause, setPause] = useState<boolean>(false);

  useMemo(() => {
    const getJson = async () => {
      prefLatLon.current = await fetch("/data/pref_lat_lon.json").then((data) =>
        data.json()
      );
      weeklyCases.current = await fetch("/data/weekly_cases.json").then(
        (data) => data.json()
      );
      prefPopulation.current = await fetch("/data/pref_population.json").then(
        (data) => data.json()
      );
      govMeasures.current = await fetch("/data/gov_measure.json").then((data) =>
        data.json()
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
      <div>
        <button onClick={() => setPause(!pause)}>
          {pause ? "Play" : "Pause"}
        </button>
      </div>

      <div style={{ position: "absolute", fontSize: "1.5rem" }}>
        <p>
          <strong>
            {typeof prefLatLon.current == "undefined"
              ? ""
              : prefLatLon.current[focusedPrefId].pref_name}
          </strong>
        </p>
        <small>From:</small>
        <p ref={beginAtRef}></p>
        <small>To:</small>
        <p ref={endAtRef}></p>
        <small>Average (week):</small>
        <p ref={caseCountRef}></p>

        <input type="range" name="" ref={sliderRef} min="0" max="146" />
      </div>
      <Canvas>
        {isLoading ? (
          <></>
        ) : (
          <MeshGroup
            focusedPrefId={focusedPrefId}
            beginAtRef={beginAtRef.current}
            endAtRef={endAtRef.current}
            prefLatLon={prefLatLon.current as PrefLatLon[]}
            prefPopulation={prefPopulation.current as PrefPopulation}
            weeklyCases={weeklyCases.current as WeeklyCase[]}
            govMeasures={govMeasures.current as GovMeasure[]}
            caseCountRef={caseCountRef.current}
            sliderRef={sliderRef.current}
            pause={pause}
          />
        )}
      </Canvas>
    </div>
  );
}
