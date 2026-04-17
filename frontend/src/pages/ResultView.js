import React from "react";
import { useParams } from "react-router-dom";

function ResultView() {
  const { id } = useParams();

  return (
    <div>
      <h2>Result Page</h2>
      <p>ID: {id}</p>
    </div>
  );
}

export default ResultView;