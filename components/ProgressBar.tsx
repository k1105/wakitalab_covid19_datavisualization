import { RefObject } from "react";
import Image from "next/image";

type Props = {
  progressBarContainerRef: RefObject<HTMLDivElement>;
  focusedPrefId: Number;
};

export const ProgressBar = ({
  progressBarContainerRef,
  focusedPrefId,
}: Props) => {
  return (
    <>
      <div className="progress-bar">
        <div ref={progressBarContainerRef} className="bar-container">
          <Image
            alt="name"
            src={"/img/bar/" + String(focusedPrefId) + ".png"}
            width={200}
            height={60}
            style={{ opacity: 0.3 }}
          />
        </div>
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

      <style jsx>{`
        .bar-container {
          background-image: url(${"/img/bar/" +
          String(focusedPrefId) +
          ".png"});
          background-repeat: no-repeat;
          background-size: 200px 60px;
          height: 40px;
          margin-top: -30px;
          mix-blend-mode: difference;
        }
        .progress-bar {
          width: 200px;
          margin: 0 auto;
          margin-top: 20px;
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
      `}</style>
    </>
  );
};
