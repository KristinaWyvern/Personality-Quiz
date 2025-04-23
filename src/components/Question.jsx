import React from "react";

export default function Question({ question, options, onAnswer }) {
  return (
    <div className="card">
      <h2>{question}</h2>
      {options.map(function (option) {
        return (          
          <button
            className= {'b'+option} 
            key={option}
            onClick={function () {
              onAnswer(option);
            }}
          >
            {/* {question == "Which color do you prefer?" && '' ||question != "Which color do you prefer?" && option} */}
          </button>
        );
      })}
    </div>
  );
}