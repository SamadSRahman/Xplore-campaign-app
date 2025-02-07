import React from "react";
import styles from "./SampleQuestions.module.css";
export default function SampleQuestions({ onClick }) {
  const questions = [
    "Tell me about ADAS in the IONIQ 5.",
    "Which company manufactures the IONIQ 5?",
    "Where can more details about the IONIQ 5 be found?",
  ];
  return (
    <div className={styles.container}>
      {questions.map((ques) => (
        <div
          className={styles.question}
          key={ques}
          onClick={() => onClick(ques)}
        >
          {ques}
        </div>
      ))}
    </div>
  );
}
