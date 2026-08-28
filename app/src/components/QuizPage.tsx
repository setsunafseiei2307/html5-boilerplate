import { useEffect, useRef, useState } from 'react';
import { QUIZ_QUESTIONS, encodeCorrectness, gradeQuiz } from '../lib/quiz';
import { IconArrow, IconCheck, IconAlert } from './icons';

const CHOICE_KEYS = ['ア', 'イ', 'ウ', 'エ'];

export interface QuizPageProps {
  onFinish: (token: string) => void;
}

export default function QuizPage({ onFinish }: QuizPageProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(() =>
    QUIZ_QUESTIONS.map(() => null)
  );
  const [revealed, setRevealed] = useState(false);
  const promptRef = useRef<HTMLParagraphElement>(null);

  const question = QUIZ_QUESTIONS[index];
  const selected = answers[index];
  const isCorrect = selected === question.answerId;

  useEffect(() => {
    promptRef.current?.focus();
  }, [index]);

  const choose = (choiceId: string) => {
    if (revealed) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = choiceId;
      return next;
    });
    setRevealed(true);
  };

  const next = () => {
    if (index + 1 < QUIZ_QUESTIONS.length) {
      setIndex(index + 1);
      setRevealed(false);
      return;
    }
    const outcome = gradeQuiz(answers);
    onFinish(encodeCorrectness(outcome.correctness));
  };

  const progress = ((index + (revealed ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="quiz">
      <div className="quiz-progress">
        <span className="quiz-progress__count">
          第{index + 1}問 / 全{QUIZ_QUESTIONS.length}問
        </span>
        <div
          className="quiz-progress__track"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={QUIZ_QUESTIONS.length}
          aria-label="回答の進み具合"
        >
          <div className="quiz-progress__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <section className="quiz-card">
        <span className="quiz-card__scene">{question.scene}</span>
        <p className="quiz-card__prompt" ref={promptRef} tabIndex={-1}>
          {question.prompt}
        </p>

        <div className="quiz-choices">
          {question.choices.map((choice, i) => {
            const isAnswer = choice.id === question.answerId;
            const isPicked = selected === choice.id;
            let className = 'choice';
            if (revealed && isAnswer) className += ' choice--correct';
            else if (revealed && isPicked) className += ' choice--wrong';
            else if (revealed) className += ' choice--muted';
            return (
              <button
                type="button"
                className={className}
                key={choice.id}
                disabled={revealed}
                onClick={() => choose(choice.id)}
              >
                <span className="choice__key" aria-hidden>
                  {CHOICE_KEYS[i]}
                </span>
                <span>{choice.label}</span>
              </button>
            );
          })}
        </div>

        {revealed ? (
          <div className="explain">
            <p
              className={`explain__verdict explain__verdict--${isCorrect ? 'ok' : 'ng'}`}
            >
              {isCorrect ? <IconCheck size={17} /> : <IconAlert size={17} />}
              {isCorrect ? '正解' : '惜しい'}
            </p>
            <p className="explain__text">{question.explanation}</p>
          </div>
        ) : null}

        {revealed ? (
          <div className="wizard__actions" style={{ marginTop: 20 }}>
            <button type="button" className="btn btn--accent btn--block" onClick={next}>
              {index + 1 < QUIZ_QUESTIONS.length ? '次の問題へ' : '偏差値を見る'}
              <IconArrow size={17} />
            </button>
          </div>
        ) : (
          <p
            className="lead"
            style={{ marginTop: 18, fontSize: 12.5, textAlign: 'center', opacity: 0.8 }}
          >
            選ぶとその場で答えと理由が出ます。全10問、途中で戻ることはできません。
          </p>
        )}
      </section>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <a className="linkbtn" href="#/">
          やめてトップに戻る
        </a>
      </div>
    </div>
  );
}
