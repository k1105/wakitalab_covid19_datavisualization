import { Canvas } from "@react-three/fiber";
import { extend } from "@react-three/fiber";
import { useState, useRef, useMemo } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Information from "../components/Information";
import MeshGroup from "../components/MeshGroup";

extend({ OrbitControls });

export default function Home() {
  /**
   * json file
   */
  const weeklyCases = useRef<WeeklyCase[]>();
  const prefLatLon = useRef<PrefLatLon[]>();
  const prefPopulation = useRef<PrefPopulation>();
  const govMeasures = useRef<GovMeasure[]>();
  const prefName = useRef<{ names: string[] }>();

  /**
   * UI State
   */
  const [focusedPrefId, setFocusedPrefId] = useState<number>(15);
  const [pause, setPause] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * UI Ref
   */
  const beginAtRef = useRef<HTMLParagraphElement>(null);
  const endAtRef = useRef<HTMLParagraphElement>(null);
  const caseCountRef = useRef<HTMLParagraphElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const prefIndexRef = useRef<HTMLDivElement>(null);

  const filteredList = useRef<GovMeasure[]>([]);

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
      prefName.current = await fetch("/data/pref_name.json").then((data) =>
        data.json()
      );
    };

    getJson().then(() => {
      setIsLoading(false);
    });
  }, []);
  return (
    <div id="root">
      <Information
        focusedPrefName={
          typeof prefLatLon.current == "undefined"
            ? ""
            : prefLatLon.current[focusedPrefId].pref_name
        }
        prefName={
          typeof prefName.current == "undefined"
            ? { names: [] }
            : prefName.current
        }
        beginAtRef={beginAtRef}
        endAtRef={endAtRef}
        caseCountRef={caseCountRef}
        setFocusedPrefId={setFocusedPrefId}
        focusedPrefId={focusedPrefId}
        setPause={setPause}
        pause={pause}
        sliderRef={sliderRef}
        filteredList={filteredList.current}
        squareRef={squareRef}
        prefIndexRef={prefIndexRef}
      />
      {isLoading ? (
        <>
          <p style={{ color: "white" }}>Loading...</p>
        </>
      ) : (
        <Canvas>
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
            filteredList={filteredList.current}
            squareRef={squareRef.current}
            prefIndexRef={prefIndexRef.current}
          />
        </Canvas>
      )}
    </div>
  );
}
