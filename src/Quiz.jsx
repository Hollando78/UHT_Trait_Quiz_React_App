import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./index.css";

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
  return rankings.find(r => ratio <= 1 && ratio >= r.score)?.title || "Initiate";
};

const getShuffledTraitIndexes = (count = 10) => {
  const indexes = Array.from({ length: 32 }, (_, i) => i);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes.slice(0, count);
};

const generateQuestion = (correctIndex) => {
  const choices = new Set([correctIndex]);
  while (choices.size < 4) {
    choices.add(Math.floor(Math.random() * 32));
  }
  return {
    icon: correctIndex + 1,
    correct: correctIndex,
    options: Array.from(choices).sort(() => Math.random() - 0.5)
  };
};

const Quiz = () => {
  const [traitSequence, setTraitSequence] = useState(getShuffledTraitIndexes());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState(generateQuestion(0));
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setQuestion(generateQuestion(traitSequence[currentIndex]));
  }, [currentIndex, traitSequence]);

  const handleAnswer = (index) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.correct) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentIndex >= 9) {
        setShowResult(true);
      } else {
        setCurrentIndex(currentIndex + 1);
        setSelected(null);
      }
    }, 1000);
  };

  const restartQuiz = () => {
    const newSequence = getShuffledTraitIndexes();
    setTraitSequence(newSequence);
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setQuestion(generateQuestion(newSequence[0]));
  };

  return (
    <div className="quiz-wrapper modern-font">
      <div className="quiz-box no-outline">
        {showResult ? (
          <>
            <h2 className="quiz-title">Quiz Complete!</h2>
            <p className="quiz-score">Score: {score} / 10</p>
            <p className="quiz-ranking">You are a <strong>{getRanking(score / 10)}</strong></p>
            <button className="quiz-button" onClick={restartQuiz}>Play Again</button>
          </>
        ) : (
          <>
            <h2 className="quiz-title">Question {currentIndex + 1} / 10</h2>
            <img
              src={`${import.meta.env.BASE_URL}icons/Icon${question.icon}.png`}
              alt="UHT Trait Icon"
              className="quiz-icon large"
            />
            <div className="quiz-grid">
              {question.options.map((i) => (
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`quiz-card fixed-size narrow ${
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
          </>
        )}
      </div>
      <div className="quiz-version">v1.1</div>
    </div>
  );
};

export default Quiz;
