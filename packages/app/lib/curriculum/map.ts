/**
 * Curriculum map – the UK National Curriculum laid out for navigation:
 * subject → year (grouped by key stage) → topics in programme-of-study
 * order. Topics point at a content pack when one exists; `packId: null`
 * marks a topic that is on the map but not yet built.
 */

import type { KeyStage, Subject } from './schema'

export interface TopicRef {
  topicId: string
  title: string
  packId: string | null
}

export interface YearEntry {
  year: number
  keyStage: KeyStage
  topics: TopicRef[]
}

export interface SubjectEntry {
  subject: Subject
  label: string
  blurb: string
  years: YearEntry[]
}

export const CURRICULUM_MAP: SubjectEntry[] = [
  {
    subject: 'maths',
    label: 'Mathematics',
    blurb:
      'Number, calculation, fractions, measurement, geometry and statistics, following the programmes of study year by year.',
    years: [
      {
        year: 2,
        keyStage: 'KS1',
        topics: [
          { topicId: 'number-place-value', title: 'Number and Place Value', packId: null },
          { topicId: 'addition-subtraction', title: 'Addition and Subtraction', packId: 'maths-y2-addition-subtraction' },
          { topicId: 'multiplication-division', title: 'Multiplication and Division', packId: null },
          { topicId: 'fractions', title: 'Fractions', packId: null },
          { topicId: 'measurement', title: 'Measurement', packId: null },
          { topicId: 'geometry-shapes', title: 'Geometry: Properties of Shapes', packId: null },
          { topicId: 'geometry-position-direction', title: 'Geometry: Position and Direction', packId: null },
          { topicId: 'statistics', title: 'Statistics', packId: null },
        ],
      },
      {
        year: 3,
        keyStage: 'KS2',
        topics: [
          { topicId: 'number-place-value', title: 'Number and Place Value', packId: 'maths-y3-number-place-value' },
          { topicId: 'addition-subtraction', title: 'Addition and Subtraction', packId: 'maths-y3-addition-subtraction' },
          { topicId: 'multiplication-division', title: 'Multiplication and Division', packId: 'maths-y3-multiplication-division' },
          { topicId: 'fractions', title: 'Fractions', packId: 'maths-y3-fractions' },
          { topicId: 'measurement', title: 'Measurement', packId: 'maths-y3-measurement' },
          { topicId: 'geometry-shapes', title: 'Geometry: Properties of Shapes', packId: 'maths-y3-geometry-shapes' },
          { topicId: 'statistics', title: 'Statistics', packId: 'maths-y3-statistics' },
        ],
      },
    ],
  },
  {
    subject: 'science',
    label: 'Science',
    blurb:
      'Biology, chemistry and physics topics, taught through the units set out in the programmes of study.',
    years: [
      {
        year: 2,
        keyStage: 'KS1',
        topics: [
          { topicId: 'living-things-habitats', title: 'Living Things and Their Habitats', packId: null },
          { topicId: 'plants', title: 'Plants', packId: null },
          { topicId: 'animals-including-humans', title: 'Animals, Including Humans', packId: 'science-y2-animals-including-humans' },
          { topicId: 'everyday-materials', title: 'Uses of Everyday Materials', packId: null },
        ],
      },
      {
        year: 3,
        keyStage: 'KS2',
        topics: [
          { topicId: 'plants', title: 'Plants', packId: 'science-y3-plants' },
          { topicId: 'animals-including-humans', title: 'Animals, Including Humans', packId: 'science-y3-animals-including-humans' },
          { topicId: 'rocks', title: 'Rocks', packId: 'science-y3-rocks' },
          { topicId: 'light', title: 'Light', packId: 'science-y3-light' },
          { topicId: 'forces-magnets', title: 'Forces and Magnets', packId: 'science-y3-forces-magnets' },
        ],
      },
    ],
  },
  {
    subject: 'english',
    label: 'English',
    blurb:
      'Spelling, grammar and punctuation, and reading comprehension, following the lower and upper Key Stage 2 programmes of study.',
    years: [
      {
        year: 3,
        keyStage: 'KS2',
        topics: [
          { topicId: 'spelling', title: 'Spelling', packId: 'english-y3-spelling' },
          { topicId: 'grammar-punctuation', title: 'Grammar and Punctuation', packId: 'english-y3-grammar-punctuation' },
          { topicId: 'reading-comprehension', title: 'Reading Comprehension', packId: 'english-y3-reading-comprehension' },
        ],
      },
    ],
  },
]

export function getSubjectEntry(subject: string): SubjectEntry | null {
  return CURRICULUM_MAP.find((s) => s.subject === subject) ?? null
}
