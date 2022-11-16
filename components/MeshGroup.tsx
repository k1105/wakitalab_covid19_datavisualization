import {
  ReactThreeFiber,
  useFrame,
  extend,
  useThree,
} from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Text } from "@react-three/drei";
import React, {
  Dispatch,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import { Group } from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Node<OrbitControls, typeof OrbitControls>;
    }
  }
}

type Case = { case: number[]; all: number; date: string };
type PrefLatLon = { pref_name: string; lat: string; lon: string };
type PrefPopulation = { population: number[] };
type Props = {
  focusedPrefId: number;
  setDate: Dispatch<SetStateAction<string>>;
};

extend({ OrbitControls });

export default function MeshGroup({ focusedPrefId, setDate }: Props) {
  const covidCases = useRef<Case[]>();
  const prefLatLon = useRef<PrefLatLon[]>();
  const prefPopulation = useRef<PrefPopulation>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const elapsedTime = useRef<number>(0);
  const groupRef = useRef<Group>(null);

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

  const controls = useRef<OrbitControls>(null);
  const { camera, gl } = useThree();
  const offset = 200;
  useFrame((state, delta) => {
    const current: number = Math.floor(elapsedTime.current);
    const next = current + 1;
    const t = elapsedTime.current - current;
    elapsedTime.current = elapsedTime.current + delta;
    controls.current?.update();
    if (covidCases.current && prefPopulation.current) {
      for (let i = 0; i < 47; i++) {
        const currentSize: number =
          ((covidCases.current as Case[])[current + offset].case[i] /
            prefPopulation.current.population[i]) *
          1000;
        const nextSize: number =
          ((covidCases.current as Case[])[next + offset].case[i] /
            prefPopulation.current.population[i]) *
          1000;
        const size = t * nextSize + (1 - t) * currentSize;
        groupRef.current?.children[i].children[1].scale.set(size, size, size);
        groupRef.current?.children[i].children[0].scale.set(1, 1, 1);
      }
    }
  });

  setInterval(() => {
    typeof covidCases.current == "undefined"
      ? setDate("")
      : setDate(
          covidCases.current[Math.floor(elapsedTime.current) + offset].date
        );
  }, 100);

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <group ref={groupRef}>
          {(() => {
            const meshes = [];
            for (let i = 0; i < 47; i++) {
              const size = 10;
              const pref_name = (prefLatLon.current as PrefLatLon[])[i]
                .pref_name;
              const pref_lon = Number(
                (prefLatLon.current as PrefLatLon[])[i].lon
              );
              const pref_lat = Number(
                (prefLatLon.current as PrefLatLon[])[i].lat
              );
              if (i == focusedPrefId) {
                meshes.push(
                  <group>
                    <Text
                      color={0x000000}
                      position={[pref_lon - 135, 0, 35 - pref_lat]}
                    >
                      {pref_name}
                    </Text>
                    <mesh
                      key={i}
                      position={[pref_lon - 135, 0, 35 - pref_lat]}
                      scale={[size, size, size]}
                    >
                      <sphereGeometry />
                      <meshBasicMaterial
                        color="#00ffff"
                        wireframe={true}
                        transparent={true}
                        opacity={0.5}
                      />
                    </mesh>
                  </group>
                );
              } else {
                meshes.push(
                  <group>
                    <Text
                      color={0x000000}
                      position={[pref_lon - 135, 0, 35 - pref_lat]}
                    >
                      {pref_name}
                    </Text>
                    <mesh
                      key={i}
                      position={[pref_lon - 135, 0, 35 - pref_lat]}
                      scale={[size, size, size]}
                    >
                      <sphereGeometry />
                      <meshBasicMaterial
                        color="#cccccc"
                        wireframe={true}
                        transparent={true}
                        opacity={0.5}
                      />
                    </mesh>
                  </group>
                );
              }
            }
            return meshes;
          })()}
        </group>
      )}
      <orbitControls
        ref={controls}
        args={[camera, gl.domElement]}
        enableDamping
        dampingFactor={0.1}
        rotateSpeed={0.5}
      />
    </>
  );
}
