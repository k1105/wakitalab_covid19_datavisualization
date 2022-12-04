import { LegacyRef } from "react";

type Props = {
  prefName: { names: string[] };
  prefIndexRef: LegacyRef<HTMLDivElement>;
};

export default function PrefectureIndex({ prefName, prefIndexRef }: Props) {
  return (
    <>
      <div ref={prefIndexRef}>
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
      <style jsx>{`
        div {
          display: flex;
          font-size: 0.8rem;
          height: 200px;
          width: 700px;
          margin-right: 50px;
          flex-direction: column;
          flex-wrap: wrap;
          color: #aaa;
          user-select: none;
        }

        @media screen and (max-width: 500px) {
          div {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
