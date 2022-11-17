import {
  ReactThreeFiber,
  useFrame,
  extend,
  useThree,
} from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Text } from "@react-three/drei";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { Group } from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Node<OrbitControls, typeof OrbitControls>;
    }
  }
}

type WeeklyCase = {
  begin_date: string;
  end_date: string;
  weekly_average_case: number[];
  all: number;
};
type PrefLatLon = { pref_name: string; lat: string; lon: string };
type PrefPopulation = { population: number[] };
type Props = {
  focusedPrefId: number;
  setDate: Dispatch<SetStateAction<string>>;
  weeklyCases: WeeklyCase[];
  prefPopulation: PrefPopulation;
  prefLatLon: PrefLatLon[];
  setCaseCount: Dispatch<SetStateAction<number>>;
};

extend({ OrbitControls });

export default function MeshGroup({
  focusedPrefId,
  setDate,
  weeklyCases,
  prefPopulation,
  prefLatLon,
  setCaseCount,
}: Props) {
  const elapsedTime = useRef<number>(0);
  const groupRef = useRef<Group>(null);

  const controls = useRef<OrbitControls>(null);
  const { camera, gl } = useThree();
  const offset = 140;
  useFrame((state, delta) => {
    const current: number = Math.floor(elapsedTime.current);
    const next = current + 1;
    const t = elapsedTime.current - current;
    elapsedTime.current = elapsedTime.current + delta;
    controls.current?.update();
    if (weeklyCases && prefPopulation) {
      for (let i = 0; i < 47; i++) {
        const currentSize: number =
          ((weeklyCases as WeeklyCase[])[(current + offset) % 147]
            .weekly_average_case[i] /
            prefPopulation.population[i]) *
          1000;
        const nextSize: number =
          ((weeklyCases as WeeklyCase[])[(next + offset) % 147]
            .weekly_average_case[i] /
            prefPopulation.population[i]) *
          1000;
        const size = t * nextSize + (1 - t) * currentSize;
        groupRef.current?.children[i].children[1].scale.set(size, size, size);
        groupRef.current?.children[i].children[0].scale.set(1, 1, 1);
      }
    }
  });

  setInterval(() => {
    setDate(
      weeklyCases[(Math.floor(elapsedTime.current) + offset) % 147].begin_date
    );
    setCaseCount(
      weeklyCases[(Math.floor(elapsedTime.current) + offset) % 147]
        .weekly_average_case[focusedPrefId]
    );
  }, 1000);

  return (
    <>
      <group ref={groupRef}>
        {(() => {
          const meshes = [];
          for (let i = 0; i < 47; i++) {
            const size = 10;
            const pref_name = (prefLatLon as PrefLatLon[])[i].pref_name;
            const pref_lon = Number((prefLatLon as PrefLatLon[])[i].lon);
            const pref_lat = Number((prefLatLon as PrefLatLon[])[i].lat);
            if (i == focusedPrefId) {
              meshes.push(
                <group>
                  <Text
                    fontSize={0.07}
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
                    fontSize={0.07}
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
