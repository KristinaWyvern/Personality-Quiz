import React, { useState, useEffect, useMemo  } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Question from "./components/Question";
import Results from "./components/Results";
import UserForm from "./components/UserForm";
import { UserProvider } from "./components/UserContext";

const questions = [
  {
    question: "Which color do you prefer?",
    options: ["Red", "Blue", "Green", "Yellow"],
  },
  {
    question: "Which place seems more beautiful to you?",
    options: ["Ocean", "Vulcano","Sky", "Forest"],
  },
  {
    question: "What's your favorite time of year?",
    options: ["Spring", "Summer", "Autumn", "Winter"],
  },
  {
    question: "What do you usually snack on?",
    options: ["Coffe", "Fruit", "Pancakes", "Eggs"],
  },
  {
    question: "What do you like to do before bedtime?",
    options: ["Walking", "Reading", "Watching-movies", "Sports"],
  },
];

const keywords = {
  Fire: "fire",
  Water: "water",
  Earth: "earth",
  Air: "air",
};

const elements = {
  // Color
  "Red": "Fire",
  "Blue": "Water",
  "Green": "Earth",
  "Yellow": "Air",
  // Place 
  "Vulcano": "Fire",
  "Ocean": "Water",
  "Forest": "Earth",
  "Sky": "Air",
  // Time of year
  "Summer": "Fire",
  "Autumn": "Water",
  "Winter": "Earth",
  "Spring": "Air",
  // Snack
  "Coffe": "Fire",
  "Eggs": "Water",
  "Fruit": "Earth",
  "Pancakes": "Air",
  // Bedtime
  "Sports": "Fire",
  "Reading": "Water",
  "Watching-movies": "Earth",
  "Walking": "Air",
};

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState("");
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(false);   

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }
  function resetQuiz() {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setElement("");
    setArtwork(null);
  }

  const determineElement = useMemo(() => {    
    const counts = {};
    answers.forEach((answer) =>{
      const el = elements[answer];
      counts[el] = (counts[el] || 0) + 1;
    })    
    return counts;
  }, [answers]);

  const fetchArtwork = async (keyword) => {
    setLoading(true);
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}`);
    const data = await response.json();
    setLoading(false);

    const randomIndex = Math.floor(Math.random() * data.objectIDs.length);
    const objectID = data.objectIDs[randomIndex];
    const artworkResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
    const artwork = await artworkResponse.json();

    if (!artwork.primaryImage) {
      setLoading(false);
      return 
    }
    setArtwork(artwork);
  };

  useEffect(() => {
    if (currentQuestionIndex === questions.length) {
      const selectedElement = Object.keys(determineElement).reduce((a, b) => determineElement[a] > determineElement[b] ? a : b);
      setElement(selectedElement);
      fetchArtwork(keywords[selectedElement]);
    }
  }, [currentQuestionIndex]);

  return (
    <UserProvider>
      <Header />
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route
          path="/quiz"
          element={
            currentQuestionIndex < questions.length ? (
              <Question
                question={questions[currentQuestionIndex].question}
                options={questions[currentQuestionIndex].options}
                onAnswer={handleAnswer}
              />
            ) : (
              <Results element={element} artwork={artwork} resetQuiz={resetQuiz} />
            )
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;