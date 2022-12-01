import {
  RefObject,
  useState,
  LegacyRef,
  MutableRefObject,
  useEffect,
} from "react";
import PrefectureIndex from "./prefectureIndex";
import TargetSelector from "./TargetSelector";

type Props = {
  beginAtRef: RefObject<HTMLParagraphElement>;
  endAtRef: RefObject<HTMLParagraphElement>;
  caseCountRef: RefObject<HTMLParagraphElement>;
  prefName: { names: string[] };
  focusedPrefRef: MutableRefObject<number>;
  sliderRef: RefObject<HTMLInputElement>;
  squareRef: LegacyRef<HTMLDivElement>;
  prefIndexRef: LegacyRef<HTMLDivElement>;
  pauseRef: MutableRefObject<boolean>;
};

export default function Information({
  prefName,
  beginAtRef,
  endAtRef,
  caseCountRef,
  focusedPrefRef,
  sliderRef,
  pauseRef,
  squareRef,
  prefIndexRef,
}: Props) {
  const [focusedPrefId, setFocusedPrefId] = useState<number>(15);
  useEffect(() => {
    focusedPrefRef.current = focusedPrefId;
  }, [focusedPrefId, focusedPrefRef]);
  return (
    <>
      <div className="container">
        <div
          ref={squareRef}
          style={{
            width: "200px",
            height: "200px",
            backgroundColor: "#ccc",
            marginBottom: "10px",
            padding: "5px",
          }}
        ></div>
        <p className="title">
          <strong>{prefName.names[focusedPrefId]}</strong>
        </p>

        <div className="case">
          <p ref={caseCountRef}></p>
          <small>Average number of cases</small>
        </div>
        <TargetSelector
          pauseRef={pauseRef}
          focusedPrefId={focusedPrefId}
          setFocusedPrefId={setFocusedPrefId}
          sliderRef={sliderRef}
        />
      </div>
      <div className="footer">
        <div className="date">
          <small>From:</small>
          <p ref={beginAtRef}></p>
        </div>
        <div className="date">
          <small>To:</small>
          <p ref={endAtRef}></p>
        </div>
        <PrefectureIndex prefName={prefName} prefIndexRef={prefIndexRef} />
      </div>

      <style jsx>{`
        .container {
          position: absolute;
          z-index: 10;
          left: 4vw;
          top: 10vh;
        }

        .footer {
          position: absolute;
          z-index: 9;
          left: 4vw;
          bottom: 5vh;
        }
        .title {
          font-size: 2.4rem;
          margin-top: 0;
          margin-bottom: 10px;
        }
        .date {
          display: inline-block;
          width: 160px;
          user-select: none;
        }
        .date > p {
          margin-top: 1px;
          font-size: 1.8rem;
        }
        .date > small {
          font-size: 1.2rem;
        }

        .case {
          font-size: 1.8rem;
          margin-bottom: 30px;
        }

        .case > p {
          margin-top: 1px;
          margin-bottom: 0px;
        }
        .case > small {
          margin-top: 1px;
          font-size: 1rem;
          color: #ccc;
        }
      `}</style>
    </>
  );
}
