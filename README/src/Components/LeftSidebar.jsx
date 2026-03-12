import React, { useState, useEffect } from "react";
import materialsData from "../Data/materials_kb.json";

const LeftSidebar = ({ onDragStart = () => {} }) => { // ← لو مش متمرر، يبقى dummy function
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(materialsData);

  useEffect(() => {
    setFiltered(
      materialsData.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  return (
    <div className="left-sidebar">
      <input
        type="text"
        placeholder="Search material..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {filtered.map((mat) => (
        <div
          key={mat.id}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("application/json", JSON.stringify(mat));
            onDragStart(mat); // ← لو مفيش function متمررة، مش هيكسر الكود
          }}
          style={{
            padding: "6px",
            border: "1px solid #fff",
            marginBottom: "6px",
            cursor: "grab",
            borderRadius: "5px",
          }}
        >
          {mat.name}
        </div>
      ))}
    </div>
  );
};

export default LeftSidebar;