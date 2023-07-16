import {
  Dispatch,
  SetStateAction,
  RefObject,
  useState,
  MutableRefObject,
  useEffect,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "./ProgressBar";

type Props = {
  focusedPrefId: number;
  setFocusedPrefId: Dispatch<SetStateAction<number>>;
  pauseRef: MutableRefObject<boolean>;
  progressBarContainerRef: RefObject<HTMLDivElement>;
};

export default function TargetSelector({
  focusedPrefId,
  setFocusedPrefId,
  pauseRef,
  progressBarContainerRef,
}: Props) {
  const [pause, setPause] = useState<boolean>(false);

  useEffect(() => {
    pauseRef.current = pause;
  }, [pauseRef, pause]);

  if (typeof document !== "undefined") {
    document.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        setPause(!pause);
      } else if (event.code === "ArrowLeft") {
        setFocusedPrefId((focusedPrefId - 1 + 47) % 47);
      } else if (event.code === "ArrowRight") {
        setFocusedPrefId((focusedPrefId + 1) % 47);
      }
    });
  }
  return (
    <>
      <div className="ui-container">
        <div className="ui">
          <a
            onClick={() => {
              setFocusedPrefId((focusedPrefId - 1 + 47) % 47);
            }}
          >
            <FontAwesomeIcon icon={faBackwardStep} />
          </a>
          <a onClick={() => setPause(!pause)} className="icon-center">
            {pause ? (
              <FontAwesomeIcon icon={faPlay} />
            ) : (
              <FontAwesomeIcon icon={faPause} />
            )}
          </a>
          <a onClick={() => setFocusedPrefId((focusedPrefId + 1) % 47)}>
            <FontAwesomeIcon icon={faForwardStep} />
          </a>
        </div>
        <ProgressBar
          focusedPrefId={focusedPrefId}
          progressBarContainerRef={progressBarContainerRef}
        />
      </div>

      <style jsx>{`
        .ui-container {
          font-size: 1.6rem;
          width: 200px;
          margin-bottom: 200px;
          pointer-events: auto;
        }
        .ui {
          width: fit-content;
          margin: 0 auto;
        }
        .icon-center {
          padding: 0 2rem;
        }

        @media screen and (max-width: 500px) {
          .ui-container {
            position: absolute;
            bottom: 0;
            width: calc(100% - 30px);
            margin-bottom: 50px;
          }
        }
      `}</style>
    </>
  );
}
