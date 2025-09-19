export default function CardButton({ title, value, icon }) {
  return (
    <button
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "15vh 9vw",
        width: "150px",
        height: "100px",
        borderRadius: "15px",
        border: "none",
        backgroundColor: "#ffffffff", 
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
        {title}
      </span>
      <span style={{ fontSize: "20px", fontWeight: "bold" }}>{value}</span>
      {icon && (
        <img
          src={icon}
          alt="icon"
          style={{
            position: "absolute",
            right: "10px",
            bottom: "10px",
            width: "24px",
            height: "24px",
          }}
        />
      )}
    </button>
  );
}