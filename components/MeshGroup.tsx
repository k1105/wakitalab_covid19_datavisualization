import {
  ReactThreeFiber,
  useFrame,
  extend,
  useThree,
} from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Text } from "@react-three/drei";
import React, { useRef } from "react";
import { Group } from "three";
import * as THREE from "three";

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
type GovMeasure = {
  status: "kinkyu" | "manbou";
  begin_at: string;
  end_at: string;
  pref_id: number;
};
type Props = {
  focusedPrefId: number;
  beginAtRef: HTMLParagraphElement | null;
  endAtRef: HTMLParagraphElement | null;
  caseCountRef: HTMLParagraphElement | null;
  sliderRef: HTMLInputElement | null;
  weeklyCases: WeeklyCase[];
  prefPopulation: PrefPopulation;
  prefLatLon: PrefLatLon[];
  pause: boolean;
  govMeasures: GovMeasure[];
};

extend({ OrbitControls });

export default function MeshGroup({
  focusedPrefId,
  beginAtRef,
  endAtRef,
  weeklyCases,
  prefPopulation,
  prefLatLon,
  govMeasures,
  caseCountRef,
  sliderRef,
  pause,
}: Props) {
  const elapsedTime = useRef<number>(0);
  const groupRef = useRef<Group>(null);
  const filteredList = useRef<GovMeasure[]>();

  const controls = useRef<OrbitControls>(null);
  const { camera, gl } = useThree();
  const offset = 100;
  useFrame((state, delta) => {
    if (!pause) {
      // Animation
      const current: number = Math.floor(elapsedTime.current);
      const next = current + 1;
      const t = elapsedTime.current - current;

      elapsedTime.current = elapsedTime.current + delta;

      if (weeklyCases && prefPopulation && govMeasures) {
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
          // groupRef.current?.children[i].children[0].scale.set(1, 1, 1);
          const pref_lon = Number((prefLatLon as PrefLatLon[])[i].lon);
          const pref_lat = Number((prefLatLon as PrefLatLon[])[i].lat);
          groupRef.current?.children[i].children[0].position.set(
            pref_lon - 135,
            size + 0.1,
            35 - pref_lat
          );
        }

        filteredList.current = govMeasures.filter((item, index) => {
          const measure_begin_at = new Date(item.begin_at.replace("/", "-"));
          const measure_end_at = new Date(item.end_at.replace("/", "-"));
          const week_begin_at = new Date(
            weeklyCases[(current + offset) % 147].begin_date.replace("/", "-")
          );
          const week_end_at = new Date(
            weeklyCases[(current + offset) % 147].end_date.replace("/", "-")
          );

          if (measure_end_at > week_begin_at && week_end_at > measure_begin_at)
            return true;
        });

        for (let i = 0; i < 47; i++) {
          (groupRef.current as Group).children[i].children[0].color =
            new THREE.Color("white");
          (
            (groupRef.current as Group).children[i].children[1] as THREE.Mesh
          ).material.color = new THREE.Color("white");
        }

        //console.log(filteredList);
        for (let measure of filteredList.current) {
          if (measure.status == "kinkyu") {
            (groupRef.current as Group).children[
              measure.pref_id
            ].children[0].color = new THREE.Color(0xff5525);
            (groupRef.current as Group).children[
              measure.pref_id
            ].children[1].material.color = new THREE.Color(0xff5525);
          } else {
            (groupRef.current as Group).children[
              measure.pref_id
            ].children[0].color = new THREE.Color(0xffd110);
            (groupRef.current as Group).children[
              measure.pref_id
            ].children[1].material.color = new THREE.Color(0xffd110);
          }

          // groupRef.current?.children[
          //   measure.pref_id
          // ].children[0].material.color.setHex("#ff0000");
        }

        (groupRef.current as Group).children[
          focusedPrefId
        ].children[1].material.color = new THREE.Color("aqua");
      }

      // Update Ref for DOM

      if (beginAtRef !== null) {
        beginAtRef.innerText = weeklyCases[(current + offset) % 147].begin_date;
      }

      if (endAtRef !== null) {
        endAtRef.innerText = weeklyCases[(current + offset) % 147].end_date;
      }

      if (sliderRef !== null) {
        sliderRef.value = String((elapsedTime.current + offset) % 147);
      }
    }

    controls.current?.update();

    if (caseCountRef !== null) {
      caseCountRef.innerText = String(
        Math.floor(
          weeklyCases[(Math.floor(elapsedTime.current) + offset) % 147]
            .weekly_average_case[focusedPrefId] * 100
        ) / 100
      );
    }
  });

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

            meshes.push(
              <group>
                <Text
                  fontSize={0.07}
                  color={0xffffff}
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
                    color="gray"
                    wireframe={true}
                    transparent={true}
                    opacity={0.5}
                  />
                </mesh>
              </group>
            );
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
