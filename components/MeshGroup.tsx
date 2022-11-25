import { useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import React, { LegacyRef, useRef } from "react";
import { Group } from "three";
import * as THREE from "three";

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
  filteredList: GovMeasure[];
  squareRef: HTMLDivElement | null;
  prefIndexRef: HTMLDivElement | null;
};

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
  filteredList,
  squareRef,
  prefIndexRef,
}: Props) {
  const elapsedTime = useRef<number>(0);
  const groupRef = useRef<Group>(null);

  const { camera, gl } = useThree();
  const offset = 10;
  useFrame((_, delta) => {
    console.log("hoge");
    // Animation
    const current: number = Math.floor(elapsedTime.current);
    const next = current + 1;
    const t = elapsedTime.current - current;
    const focus = {
      x: Number(prefLatLon[focusedPrefId].lon) - 135,
      z: 35 - Number(prefLatLon[focusedPrefId].lat),
    };
    const radius =
      (1 - t) *
        ((weeklyCases as WeeklyCase[])[(current + offset) % 147]
          .weekly_average_case[focusedPrefId] /
          prefPopulation.population[focusedPrefId]) *
        1000 +
      t *
        ((weeklyCases as WeeklyCase[])[(next + offset) % 147]
          .weekly_average_case[focusedPrefId] /
          prefPopulation.population[focusedPrefId]) *
        1000;
    camera.lookAt(focus.x, 0, focus.z);

    for (let i = 0; i < 47; i++) {
      (
        ((groupRef.current as Group).children[i].children[1] as THREE.Mesh)
          .material as THREE.MeshBasicMaterial
      ).opacity = 0.25;

      if (prefIndexRef !== null) {
        (prefIndexRef.children[i] as HTMLParagraphElement).style.color = "#666";
        (
          prefIndexRef.children[i] as HTMLParagraphElement
        ).style.textDecoration = "none";
      }
    }

    if (prefIndexRef !== null) {
      (
        prefIndexRef.children[focusedPrefId] as HTMLParagraphElement
      ).style.textDecoration = "line-through";
    }

    (
      (
        (groupRef.current as Group).children[focusedPrefId]
          .children[1] as THREE.Mesh
      ).material as THREE.MeshBasicMaterial
    ).opacity = 1;

    if (squareRef !== null) {
      squareRef.style.background = "#cccccc";
    }

    filteredList = govMeasures.filter((item, _) => {
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

    for (let measure of filteredList) {
      if (measure.pref_id == focusedPrefId && squareRef !== null) {
        if (measure.status == "kinkyu") {
          squareRef.style.background = "#ff5525";
        } else {
          squareRef.style.background = "#ffd110";
        }
      }
      if (prefIndexRef !== null) {
        if (measure.status == "kinkyu") {
          (
            prefIndexRef.children[measure.pref_id] as HTMLParagraphElement
          ).style.color = "#ff5525";
        } else {
          (
            prefIndexRef.children[measure.pref_id] as HTMLParagraphElement
          ).style.color = "#ffd110";
        }
      }
    }

    if (!pause) {
      // camera.position.set(
      //   focus.x +
      //     (radius + (2 + radius) * 0.5) * Math.cos(elapsedTime.current / 10),
      //   radius,
      //   focus.z +
      //     (radius + (2 + radius) * 0.5) * Math.sin(elapsedTime.current / 10)
      // );

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
          const pref_lon = Number((prefLatLon as PrefLatLon[])[i].lon);
          const pref_lat = Number((prefLatLon as PrefLatLon[])[i].lat);
          groupRef.current?.children[i].children[0].position.set(
            pref_lon - 135,
            size + 0.1,
            35 - pref_lat
          );
        }

        for (let i = 0; i < 47; i++) {
          // @ts-ignore
          (groupRef.current as Group).children[i].children[0].color =
            new THREE.Color(0xffffff);
          (
            ((groupRef.current as Group).children[i].children[1] as THREE.Mesh)
              .material as THREE.MeshBasicMaterial
          ).color = new THREE.Color(0xffffff);
        }

        if (squareRef !== null) {
          squareRef.style.background = "#cccccc";
        }

        for (let measure of filteredList) {
          if (measure.pref_id == focusedPrefId && squareRef !== null) {
            if (measure.status == "kinkyu") {
              squareRef.style.background = "#ff5525";
            } else {
              squareRef.style.background = "#ffd110";
            }
          }
          if (measure.status == "kinkyu") {
            (groupRef.current as Group).children[
              measure.pref_id
              // @ts-ignore
            ].children[0].color = new THREE.Color(0xff5525);
            (
              (
                (groupRef.current as Group).children[measure.pref_id]
                  .children[1] as THREE.Mesh
              ).material as THREE.MeshBasicMaterial
            ).color = new THREE.Color(0xff5525);
          } else {
            (groupRef.current as Group).children[
              measure.pref_id
              // @ts-ignore
            ].children[0].color = new THREE.Color(0xffd110);
            (
              (
                (groupRef.current as Group).children[measure.pref_id]
                  .children[1] as THREE.Mesh
              ).material as THREE.MeshBasicMaterial
            ).color = new THREE.Color(0xffd110);
          }
        }
      }

      // Update Ref for DOM

      if (beginAtRef !== null) {
        beginAtRef.innerText =
          weeklyCases[(current + offset) % 147].begin_date + "- ";
      }

      if (endAtRef !== null) {
        endAtRef.innerText = weeklyCases[(current + offset) % 147].end_date;
      }

      if (sliderRef !== null) {
        sliderRef.value = String((elapsedTime.current + offset) % 147);
      }
    }
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
            const pref_name = prefLatLon[i].pref_name;
            const pref_lon = Number(prefLatLon[i].lon);
            const pref_lat = Number(prefLatLon[i].lat);

            meshes.push(
              <group key={`pref${i}`}>
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
                    opacity={0.3}
                  />
                </mesh>
              </group>
            );
          }
          return meshes;
        })()}
      </group>

      <OrbitControls />
    </>
  );
}
