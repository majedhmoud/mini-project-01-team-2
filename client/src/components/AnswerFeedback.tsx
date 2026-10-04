interface AnswerFeedbackProps {
  correct: boolean;
  message: string;
}

function AnswerFeedback({ correct, message }: AnswerFeedbackProps) {
  return (
    <p
      className={`answer-feedback ${correct ? "success" : "error"}`}
      role="status"
    >
      {message}
    </p>
  );
}

export default AnswerFeedback;
