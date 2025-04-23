import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

const traits = [
  "Physical object",
  "Man-made / synthetic",
  "Biological or biologically-inspired",
  "Fixed/static",
  "Structural",
  "Perceptible",
  "Material form",
  "Passive",
  "Purposeful / intentional",
  "Emits output / produces effect",
  "Processes or regulates logic/signals",
  "Transforms or modifies internal state",
  "Interacts with humans directly",
  "Part of a larger system",
  "Autonomous in function",
  "System-critical",
  "Symbolic / representational",
  "Communicative",
  "Logical / rule-based",
  "Hierarchical / modular",
  "Behavior-guiding",
  "Self-referential / meta-conceptual",
  "Temporal",
  "Contextual abstraction",
  "Socially / culturally constructed",
  "Defined by a group/system",
  "Linked to identity or role",
  "Regulated / governed",
  "Teachable / transmissible",
  "Visible",
  "Context-sensitive",
  "Widely known"
];

const rankings = [
  { score: 0.9, title: "Meta-Modeller" },
  { score: 0.7, title: "Trait Whisperer" },
  { score: 0.4, title: "Semantic Seedling" },
  { score: 0, title: "Initiate" }
];

const getRanking = (score) => {
  const ratio = score;
  return rankings.find(r => ratio >= r.score)?.title || "Initiate";
};

const getRandomTraitIndex = () => Math.floor(Math.random() * 32);

const generateQuestion = () => {
  const correctIndex = getRandomTraitIndex();
  const choices = new Set([correctIndex]);
  while (choices.size < 4) {
    choices.add(getRandomTraitIndex());
  }
  return {
    icon: correctIndex + 1,
    correct: correctIndex,
    options: Array.from(choices).sort(() => Math.random() - 0.5)
  };
};

const Quiz = () => {
  const [question, setQuestion] = useState(generateQuestion());
  const [score, setScore] = useState(0);
  const [questionNum, setQuestionNum] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.correct) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (questionNum >= 10) {
        setShowResult(true);
      } else {
        setQuestion(generateQuestion());
        setQuestionNum(questionNum + 1);
        setSelected(null);
      }
    }, 1000);
  };

  const restartQuiz = () => {
    setScore(0);
    setQuestionNum(1);
    setQuestion(generateQuestion());
    setSelected(null);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="quiz-container text-center">
        <h2 className="quiz-title">Quiz Complete!</h2>
        <p className="quiz-score">Score: {score} / 10</p>
        <p className="quiz-ranking">Ranking: <span className="quiz-rank">{getRanking(score / 10)}</span></p>
        <button className="quiz-button" onClick={restartQuiz}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Question {questionNum} / 10</h2>
      <img
        src={`https://universalhex.org/icons/Icon${question.icon}.png`}
        alt="UHT Trait Icon"
        className="quiz-icon"
      />
      <div className="quiz-grid">
        {question.options.map((i) => (
          <motion.div
            whileTap={{ scale: 0.95 }}
            key={i}
            onClick={() => handleAnswer(i)}
            className={`quiz-card ${
              selected !== null
                ? i === question.correct
                  ? "correct"
                  : i === selected
                  ? "incorrect"
                  : "disabled"
                : ""
            }`}
          >
            {traits[i] || "(Unknown)"}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
