// import React from "react";
// import { useNavigate } from "react-router-dom";

// const RightSidebar = ({
//   reactions,
//   selectedReaction,
//   reactionStarted,
//   aiResult,
//   onReactionChange,
//   onStartReaction,
//   onReset,
// }) => {

//   const navigate = useNavigate();

//   return (
//     <div className="right-sidebar">

//       <h3>Reaction Conditions</h3>

//       <select
//         style={{ width: "100%", padding: "8px" }}
//         value={selectedReaction ? reactions.indexOf(selectedReaction) : ""}
//         onChange={(e) => {
//           const index = e.target.value;
//           onReactionChange(reactions[index]);
//         }}
//       >

//         <option value="">
//           {reactions.length === 0
//             ? "Add reactants first"
//             : "Select condition"}
//         </option>

//         {reactions.map((r, index) => (
//           <option key={index} value={index}>
//             {r.conditions.trim()}
//           </option>
//         ))}

//       </select>

//       {reactionStarted && (
//         <div style={{ marginTop: "15px" }}>

//           <h4>Reaction Result</h4>

//           <p>
//             <strong>Reactants:</strong><br/>
//             {selectedReaction?.reactants}
//           </p>

//           <p>
//             <strong>Products:</strong><br/>
//             {aiResult?.products}
//           </p>

//           <p>
//             <strong>Safety:</strong><br/>
//             {aiResult?.observation}
//           </p>

//         </div>
//       )}

//       <div
//         style={{
//           marginTop: "20px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "10px",
//         }}
//       >

//         <button
//           onClick={onStartReaction}
//           style={{
//             backgroundColor: "lightblue",
//             border: "none",
//             height: "30px",
//           }}
//         >
//           Start Reaction
//         </button>

//         <button
//           onClick={onReset}
//           style={{
//             backgroundColor: "lightblue",
//             border: "none",
//             height: "30px",
//           }}
//         >
//           Reset Lab
//         </button>

//         <button
//           onClick={() => navigate("/history")}
//           style={{
//             backgroundColor: "lightblue",
//             border: "none",
//             height: "30px",
//           }}
//         >
//           Experiment History
//         </button>

//       </div>

//     </div>
//   );
// };

// export default RightSidebar;


import React from "react";
import { useNavigate } from "react-router-dom";

const RightSidebar = ({
  reactions,
  selectedReaction,
  reactionStarted,
  aiResult,
  onReactionChange,
  onStartReaction,
  onReset,
}) => {

  const navigate = useNavigate();

  return (
    <div className="right-sidebar">

      <h3>Reaction Conditions</h3>

      <select
        style={{ width: "100%", padding: "8px" }}
        value={selectedReaction ? reactions.indexOf(selectedReaction) : ""}
        onChange={(e) => {
          const index = e.target.value;
          onReactionChange(reactions[index]);
        }}
      >
        <option value="">
          {reactions.length === 0
            ? "Add reactants first"
            : "Select condition"}
        </option>

        {reactions.map((r, index) => (
          <option key={index} value={index}>
            {r.conditions.trim()}
          </option>
        ))}
      </select>

      {reactionStarted && (
        <div style={{ marginTop: "15px" }}>
          <h4>Reaction Result</h4>

          <p>
            <strong>Reactants:</strong><br />
            {selectedReaction?.reactants}
          </p>

          <p>
            <strong>Products:</strong><br />
            {aiResult?.products}
          </p>

          <p>
            <strong>Safety:</strong><br />
            {aiResult?.observation}
          </p>
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <button
          onClick={onStartReaction}
          style={{ backgroundColor: "lightblue", border: "none", height: "30px" }}
        >
          Start Reaction
        </button>

        <button
          onClick={onReset}
          style={{ backgroundColor: "lightblue", border: "none", height: "30px" }}
        >
          Reset Lab
        </button>

        <button
          onClick={() => navigate("/history")}
          style={{ backgroundColor: "lightblue", border: "none", height: "30px" }}
        >
          Experiment History
        </button>

        <button
          onClick={() => navigate("/catalog")}
          style={{ backgroundColor: "lightblue", border: "none", height: "30px" }}
        >
          Reaction Catalog
        </button>
      </div>

    </div>
  );
};

export default RightSidebar;
