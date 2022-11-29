export default function Usage() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          fontSize: "0.8rem",
          color: "#aaa",
          userSelect: "none",
          bottom: "10vh",
          right: "5vw",
        }}
      >
        <p>
          <span style={{ color: "#ff5525" }}>●</span> : 緊急事態宣言発令
        </p>
        <p>
          <span style={{ color: "#ffd110" }}>●</span> : まん延防止等重点措置発令
        </p>
      </div>
      <style jsx>{`
        p {
          margin: 0;
        }
      `}</style>
    </>
  );
}
