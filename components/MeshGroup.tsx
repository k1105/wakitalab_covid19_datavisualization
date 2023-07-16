import { useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import React, { MutableRefObject, RefObject, useRef } from "react";
import { Color, Group, Mesh, MeshBasicMaterial } from "three";

type Props = {
  focusedPrefRef: MutableRefObject<number>;
  beginAtRef: HTMLParagraphElement | null;
  endAtRef: HTMLParagraphElement | null;
  caseCountRef: HTMLParagraphElement | null;
  weeklyCases: WeeklyCase[];
  prefPopulation: PrefPopulation;
  prefLatLon: PrefLatLon[];
  pauseRef: MutableRefObject<boolean>;
  govMeasures: GovMeasure[];
  filteredList: GovMeasure[];
  squareRef: HTMLDivElement | null;
  prefIndexRef: HTMLDivElement | null;
  distance: Distance[];
  progressBarContainerRef: HTMLDivElement | null;
  animate: boolean;
  debugInfoRef: HTMLParagraphElement | null;
  elapsedTime: MutableRefObject<number>;
};

export default function MeshGroup({
  focusedPrefRef,
  beginAtRef,
  endAtRef,
  weeklyCases,
  prefPopulation,
  prefLatLon,
  govMeasures,
  distance,
  caseCountRef,
  pauseRef,
  filteredList,
  squareRef,
  prefIndexRef,
  progressBarContainerRef,
  animate,
  debugInfoRef,
  elapsedTime,
}: Props) {
  const groupRef = useRef<Group>(null);

  const { camera, gl } = useThree();
  // キーフレームに対して設定するオフセット。ここで指定した日数分、ページ読み込み時の再生位置がズレる。
  const offset = 10;
  useFrame((_, delta) => {
    const focusedPrefId = focusedPrefRef.current;
    // Animation
    // 現在のキーフレームとして使用するインデックス
    const current: number = Math.floor(elapsedTime.current);
    // 次のキーフレームとして使用するインデックス
    const next = current + 1;
    // 0~1の値。アニメーションを現在のフレームと次のフレームを補完する際に使用
    const t = elapsedTime.current - current;
    // フォーカスしている都道府県データのxz平面上の座標
    const focus = {
      x: Number(prefLatLon[focusedPrefId].lon) - 135,
      z: 35 - Number(prefLatLon[focusedPrefId].lat),
    };

    camera.lookAt(focus.x, 0, focus.z);
    for (let i = 0; i < 47; i++) {
      //全てのメッシュを一度全て透明度0.25にする
      (
        ((groupRef.current as Group).children[i].children[1] as Mesh)
          .material as MeshBasicMaterial
      ).opacity = 0.5 / (distance[focusedPrefId].distance[i] / 100000) ** 2;
      //画面左下の都道府県名の色を一度全てグレーにセットする
      if (prefIndexRef !== null) {
        (prefIndexRef.children[i] as HTMLParagraphElement).style.color = "#666";
        (
          prefIndexRef.children[i] as HTMLParagraphElement
        ).style.textDecoration = "none";
      }
    }
    //フォーカスされている都道府県名に線を入れる
    if (prefIndexRef !== null) {
      (
        prefIndexRef.children[focusedPrefId] as HTMLParagraphElement
      ).style.textDecoration = "line-through";
    }
    //フォーカスされている都道府県のメッシュを透明度1で上書きする
    (
      ((groupRef.current as Group).children[focusedPrefId].children[1] as Mesh)
        .material as MeshBasicMaterial
    ).opacity = 1;
    //画面左上の正方形を背景色グレーにセットする
    if (squareRef !== null) {
      squareRef.style.background = "#cccccc";
    }
    if (caseCountRef !== null) {
      caseCountRef.innerText = String(
        Math.floor(
          weeklyCases[(Math.floor(elapsedTime.current) + offset) % 147]
            .weekly_average_case[focusedPrefId] * 100
        ) / 100
      );
    }
    //緊急事態宣言やまん防が発令されている都道府県のIDを選択
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
    //filteredListをチェックして、それぞれの色を更新する
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
    if (!pauseRef.current) {
      // Animate Camera
      if (animate) {
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
        camera.position.set(
          focus.x +
            (radius + (2 + radius) * 0.5) * Math.cos(elapsedTime.current / 10),
          radius,
          focus.z +
            (radius + (2 + radius) * 0.5) * Math.sin(elapsedTime.current / 10)
        );
      }
      // Animate Camera

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
        //Three上の球体の色を一度全て白で塗りつぶす
        for (let i = 0; i < 47; i++) {
          // @ts-ignore
          (groupRef.current as Group).children[i].children[0].color = new Color(
            0xffffff
          );
          (
            ((groupRef.current as Group).children[i].children[1] as Mesh)
              .material as MeshBasicMaterial
          ).color = new Color(0xffffff);
        }
        // Three上の球体の色を更新する
        for (let measure of filteredList) {
          if (measure.status == "kinkyu") {
            (groupRef.current as Group).children[
              measure.pref_id
              // @ts-ignore
            ].children[0].color = new Color(0xff5525);
            (
              (
                (groupRef.current as Group).children[measure.pref_id]
                  .children[1] as Mesh
              ).material as MeshBasicMaterial
            ).color = new Color(0xff5525);
          } else {
            (groupRef.current as Group).children[
              measure.pref_id
              // @ts-ignore
            ].children[0].color = new Color(0xffd110);
            (
              (
                (groupRef.current as Group).children[measure.pref_id]
                  .children[1] as Mesh
              ).material as MeshBasicMaterial
            ).color = new Color(0xffd110);
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
      if (debugInfoRef !== null) {
        debugInfoRef.innerText =
          beginAtRef?.innerText + " " + endAtRef?.innerText;
      }
      if (progressBarContainerRef !== null) {
        progressBarContainerRef.style.width =
          String((((elapsedTime.current + offset) % 147) * 200) / 147) + "px";
      }
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
                    opacity={1}
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
