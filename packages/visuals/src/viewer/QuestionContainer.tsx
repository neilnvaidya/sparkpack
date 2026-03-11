import type { QuestionRecord } from '../types';
import { QuestionVisual } from './QuestionVisual';
import './question-container.css';

export interface QuestionContainerProps {
  question: QuestionRecord;
  sourceLabel?: string;
  showAnswer?: boolean;
  notes?: string;
  onNotesChange?: (value: string) => void;
  className?: string;
}

export function QuestionContainer({
  question,
  sourceLabel,
  showAnswer = false,
  notes = '',
  onNotesChange,
  className = '',
}: QuestionContainerProps) {
  const label = sourceLabel ?? (question.exam_source_id === 1 ? `Paper 1 · Q${question.id}` : question.exam_source_id === 2 ? `Paper 2 · Q${question.id - 25}` : `Q${question.id}`);

  return (
    <article className={`sp-question-container ${className}`.trim()} data-question-id={question.id}>
      <div className="sp-question-container__header">
        <span>{label}</span>
        <span>·</span>
        <span>{question.marks} mark{question.marks !== 1 ? 's' : ''}</span>
        {question.difficulty && question.difficulty !== 'core' && (
          <>
            <span>·</span>
            <span>{question.difficulty}</span>
          </>
        )}
      </div>
      <p className="sp-question-container__text">{question.question_text}</p>
      <div className="sp-question-container__visual">
        {question.visual_type !== 'none' && question.visual_config != null && (
          <QuestionVisual
            visualType={question.visual_type}
            visualConfig={question.visual_config}
          />
        )}
      </div>
      <div className="sp-question-container__footer">
        {showAnswer && question.primary_answer != null && (
          <div className="sp-question-container__answer">
            Answer: {question.primary_answer}
          </div>
        )}
        {onNotesChange && (
          <textarea
            className="sp-question-container__notes"
            placeholder="Notes…"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            aria-label={`Notes for question ${question.id}`}
          />
        )}
      </div>
    </article>
  );
}
