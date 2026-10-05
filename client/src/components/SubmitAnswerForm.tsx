import { ChangeEvent, useState } from "react";

interface SubmitAnswerFormProps {
  onSubmit: (answer: string) => void;
}

export function SubmitAnswerForm({ onSubmit }: SubmitAnswerFormProps) {
  const [answer, setAnswer] = useState("");

  function handleAnswerChange(event: ChangeEvent<HTMLInputElement>) {
    setAnswer(event.target.value);
  }

  async function handleAnswerSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      onSubmit(answer);
      setAnswer("");
    } catch (error) {}
  }

  return (
    <form onSubmit={handleAnswerSubmit}>
      <input
        placeholder="Enter your answer..."
        value={answer}
        onChange={handleAnswerChange}
      />
      <button type="submit">Submit Answer</button>
    </form>
  );
}
