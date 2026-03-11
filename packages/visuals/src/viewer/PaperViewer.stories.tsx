import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { QuestionRecord } from '../types';
import { QuestionContainer } from './QuestionContainer';
import questionsData from '../data/questions-ks1-2023.json';

const questions = questionsData as QuestionRecord[];
const paper1 = questions.filter((q) => q.exam_source_id === 1).sort((a, b) => a.id - b.id);
const paper2 = questions.filter((q) => q.exam_source_id === 2).sort((a, b) => a.id - b.id);

const meta: Meta<typeof PaperViewer> = {
  title: 'Visualizer/PaperViewer',
  component: PaperViewer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof PaperViewer>;

function PaperViewer({
  questions: qs,
  title,
  showAnswer: initialShowAnswer = false,
  withNotes = true,
}: {
  questions: QuestionRecord[];
  title: string;
  showAnswer?: boolean;
  withNotes?: boolean;
}) {
  const [showAnswer, setShowAnswer] = useState(initialShowAnswer);
  const [notesByQuestionId, setNotesByQuestionId] = useState<Record<number, string>>({});

  const handleNotesChange = (id: number) => (value: string) => {
    setNotesByQuestionId((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{title}</h1>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={showAnswer}
            onChange={(e) => setShowAnswer(e.target.checked)}
          />
          Show answers
        </label>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {qs.map((q) => (
          <QuestionContainer
            key={q.id}
            question={q}
            showAnswer={showAnswer}
            notes={withNotes ? notesByQuestionId[q.id] ?? '' : undefined}
            onNotesChange={withNotes ? handleNotesChange(q.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export const Paper1: Story = {
  render: () => (
    <PaperViewer
      questions={paper1}
      title="KS1 2023 · Paper 1 (Arithmetic)"
      withNotes
    />
  ),
};

export const Paper2: Story = {
  render: () => (
    <PaperViewer
      questions={paper2}
      title="KS1 2023 · Paper 2 (Reasoning)"
      withNotes
    />
  ),
};

function PaperTabsView() {
  const [active, setActive] = useState<'p1' | 'p2'>('p1');
  const current = active === 'p1' ? paper1 : paper2;
  const title = active === 'p1' ? 'KS1 2023 · Paper 1 (Arithmetic)' : 'KS1 2023 · Paper 2 (Reasoning)';

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', gap: 8, padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <button
          type="button"
          onClick={() => setActive('p1')}
          style={{
            padding: '8px 16px',
            fontWeight: active === 'p1' ? 600 : 400,
            background: active === 'p1' ? '#eff6ff' : 'transparent',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Paper 1
        </button>
        <button
          type="button"
          onClick={() => setActive('p2')}
          style={{
            padding: '8px 16px',
            fontWeight: active === 'p2' ? 600 : 400,
            background: active === 'p2' ? '#eff6ff' : 'transparent',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Paper 2
        </button>
      </div>
      <PaperViewer questions={current} title={title} withNotes />
    </div>
  );
}

export const Paper1VsPaper2: Story = {
  render: () => <PaperTabsView />,
};
