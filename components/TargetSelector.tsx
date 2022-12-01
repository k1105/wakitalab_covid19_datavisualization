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

type Props = {
  focusedPrefId: number;
  setFocusedPrefId: Dispatch<SetStateAction<number>>;
  sliderRef: RefObject<HTMLInputElement>;
  pauseRef: MutableRefObject<boolean>;
};

export default function TargetSelector({
  focusedPrefId,
  setFocusedPrefId,
  sliderRef,
  pauseRef,
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
        <div className="slider">
          <input
            type="range"
            name=""
            ref={sliderRef}
            min="0"
            max="146"
            step="0.01"
            list="tickmarks"
          />
          <datalist id="tickmarks">
            <option value="0" label="2020 / 01"></option>
            <option value="17" label="2020 / 07"></option>
            <option value="33" label="2020 / 12"></option>
            <option value="50" label="2021 / 06"></option>
            <option value="66" label="2021 / 11"></option>
            <option value="83" label="2022 / 05"></option>
            <option value="100" label="2022 / 11"></option>
          </datalist>
        </div>
      </div>

      <style jsx>{`
        .ui-container {
          font-size: 1.6rem;
          width: 200px;
          margin-bottom: 200px;
        }
        .ui {
          width: fit-content;
          margin: 0 auto;
        }
        .icon-center {
          padding: 0 2rem;
        }
        .slider {
          width: 200px;
          margin: 0 auto;
          margin-top: 20px;
        }

        input {
          display: block;
          width: 100%;
        }

        datalist {
          display: flex;
          flex-direction: column;
          writing-mode: vertical-lr;
          font-size: 0.5rem;
          width: 100%;
          justify-content: space-between;
          color: #aaa;
          margin-top: 20px;
          user-select: none;
        }

        @media screen and (-webkit-min-device-pixel-ratio: 0) {
          input[type="range"] {
            -webkit-appearance: none;
            background-color: #333;
            overflow: hidden;
            height: 5px;
          }

          input[type="range"]::-webkit-slider-thumb {
            width: 10px;
            -webkit-appearance: none;
            height: 20px;
            cursor: ew-resize;
            background: #fff;
          }
        }
      `}</style>
    </>
  );
}
