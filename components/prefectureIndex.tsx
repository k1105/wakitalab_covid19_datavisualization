import { LegacyRef } from "react";

type Props = {
  prefName: { names: string[] };
  prefIndexRef: LegacyRef<HTMLDivElement>;
};

export default function PrefectureIndex({ prefName, prefIndexRef }: Props) {
  return (
    <>
      <div
        ref={prefIndexRef}
        style={{
          display: "flex",
          fontSize: "0.8rem",
          height: "200px",
          width: "700px",
          marginRight: "50px",
          flexDirection: "column",
          flexWrap: "wrap",
          color: "#aaa",
          userSelect: "none",
        }}
      >
        {(() => {
          const prefNames = [];
          for (const name of prefName.names) {
            prefNames.push(
              <p key={name} style={{ margin: "5px" }}>
                {name}
              </p>
            );
          }
          return prefNames;
        })()}
      </div>
    </>
  );
}
