export default function ProductVisualization({ aiResult, reactionStarted }) {

  if (!reactionStarted || !aiResult) return null;

  const observation = aiResult.observation?.toLowerCase() || "";

  let state = null;

  if (observation.includes("gas")) state = "gas";
  else if (observation.includes("precipitate") || observation.includes("solid")) state = "solid";
  else if (observation.includes("liquid") || observation.includes("solution")) state = "liquid";

  return (
    <div className="beaker">

      <h3>Beaker Result</h3>

      <p>
        <strong>Products:</strong> {aiResult.products}
      </p>

      {state === "gas" && (
        <div className="gas-effect">💨 Gas bubbles</div>
      )}

      {state === "solid" && (
        <div className="solid-effect">🧂 Solid precipitate</div>
      )}

      {state === "liquid" && (
        <div className="liquid-effect">🧪 Liquid formed</div>
      )}

    </div>
  );
}