export default function Usage() {
  return (
    <>
      <div>
        <p>
          <span style={{ color: "#ff5525" }}>●</span> : 緊急事態宣言発令
        </p>
        <p>
          <span style={{ color: "#ffd110" }}>●</span> : まん延防止等重点措置発令
        </p>
      </div>
      <style jsx>{`
        div {
          position: absolute;
          font-size: 0.8rem;
          color: #aaa;
          user-select: none;
          bottom: 10vh;
          right: 5vw;
        }
        p {
          margin: 0;
        }

        @media screen and (max-width: 500px) {
          div {
            left: 20px;
            bottom: 25vh;
            font-size: 0.6rem;
          }
        }
      `}</style>
    </>
  );
}
