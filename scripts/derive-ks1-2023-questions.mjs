#!/usr/bin/env node
/**
 * Derive question records from the KS1 2023 seed data (mirrors scripts/seed-ks1-2023-sats.sql).
 * Writes packages/visuals/src/data/questions-ks1-2023.json for the paper viewer.
 * Run: node scripts/derive-ks1-2023-questions.mjs (or npm run derive-questions)
 */

import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outPath = join(root, 'packages/visuals/src/data/questions-ks1-2023.json');

const questions = [
  // Paper 1 (id 1–25), all answer_box
  ...[
    [1, 6, 1, '3 + 6 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '9'],
    [2, 30, 1, '12 + 2 + 2 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '16'],
    [3, 8, 1, '13 − 7 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '6'],
    [4, 33, 1, '10 × 4 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '40'],
    [5, 30, 1, '35 + 5 + 5 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '45'],
    [6, 30, 1, '22 + 20 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '42'],
    [7, 33, 1, '3 × 5 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '15'],
    [8, 30, 1, '10 + 60 + 20 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '90'],
    [9, 29, 1, '79 − 6 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '73'],
    [10, 29, 1, '9 + 32 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '41'],
    [11, 33, 1, '11 × 2 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '22'],
    [12, 33, 1, '6 ÷ 2 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '3'],
    [13, 33, 1, '24 ÷ 2 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '12'],
    [14, 30, 1, '32 + 46 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '78'],
    [15, 37, 1, '½ of 60 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '30'],
    [16, 29, 1, '45 − 13 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '32'],
    [17, 29, 1, '94 − 40 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '54'],
    [18, 30, 1, '14 + 77 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '91'],
    [19, 32, 1, '? − 5 = 3', 'short_answer', 'core', 1, 'none', null, 'answer_box', '8'],
    [20, 32, 1, '11 + ? = 77', 'short_answer', 'core', 1, 'none', null, 'answer_box', '66'],
    [21, 37, 1, '½ of 42 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '21'],
    [22, 37, 1, '¼ of 28 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '7'],
    [23, 29, 1, '41 − 15 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '26'],
    [24, 29, 1, '67 − 58 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '9'],
    [25, 29, 1, '82 − 63 = ', 'short_answer', 'core', 1, 'none', null, 'answer_box', '19'],
  ].map(([id, objective_id, exam_source_id, question_text, question_type, difficulty, marks, visual_type, visual_config, answer_style, primary_answer]) => ({
    id,
    objective_id,
    exam_source_id,
    question_text,
    question_type,
    difficulty,
    marks,
    visual_type,
    visual_config,
    answer_style,
    primary_answer,
  })),
  // Paper 2 (id 26–56)
  ...[
    [26, 3, 2, 'Circle the number that is 2 less than the number on the dice.', 'short_answer', 'core', 1, 'dice', { value: 5, number_options: [2, 3, 4, 5, 6] }, 'built_in', '3'],
    [27, 23, 2, 'Write the value marked on the number line.', 'short_answer', 'core', 1, 'number_line', { min: 50, max: 70, interval: 5, labelled: [50, 60, 70], blank: [55] }, 'answer_box', '55'],
    [28, 1, 2, 'Count all the objects. Write your answer.', 'short_answer', 'core', 1, 'count_objects', { groups: [{ object: 'apple', count: 3 }, { object: 'apple', count: 2 }] }, 'answer_box', '5'],
    [29, 8, 2, 'How many of the fruits shown are not oranges?', 'short_answer', 'core', 1, 'count_objects', { groups: [{ object: 'orange', count: 2 }, { object: 'apple', count: 4 }] }, 'answer_box', '4'],
    [30, 25, 2, 'Match the words to the correct numerals: ninety-nine, sixteen, forty-three', 'short_answer', 'core', 1, 'matching_pairs', { left: ['ninety-nine', 'sixteen', 'forty-three'], right: ['61', '99', '16', '34', '43'], correct: { 'ninety-nine': '99', 'sixteen': '16', 'forty-three': '43' }, example_pair: 'ninety-nine' }, 'built_in', '99, 16, 43'],
    [31, 53, 2, 'Complete the block chart to show 4 ducks.', 'short_answer', 'core', 1, 'block_chart', { title: 'Animals in a pond', rows: [{ label: 'duck', value: 4, given: false }, { label: 'frog', value: 3, given: true }, { label: 'fish', value: 6, given: true }] }, 'built_in', '4'],
    [32, 47, 2, 'Tick the two shapes with the same number of sides.', 'short_answer', 'core', 1, 'shape_grid', { shapes: ['square', 'rhombus', 'triangle', 'pentagon'], task: 'select_matching_sides' }, 'built_in', 'square and rhombus'],
    [33, 48, 2, 'Classify each object as cuboid, cone or cylinder.', 'short_answer', 'core', 1, 'shape_classify', { objects: ['box', 'tin_can', 'cereal_box', 'party_hat'], categories: ['cuboid', 'cylinder', 'cuboid', 'cone'], correct: { box: 'cuboid', tin_can: 'cylinder', cereal_box: 'cuboid', party_hat: 'cone' } }, 'built_in', 'box: cuboid, tin_can: cylinder, cereal_box: cuboid, party_hat: cone'],
    [34, 44, 2, "Match each race time to the child's finishing position.", 'short_answer', 'core', 1, 'matching_pairs', { left: ['10 minutes', '11 minutes', '13 minutes', '15 minutes'], right: ['1st', '2nd', '3rd', '4th'], correct: { '10 minutes': '1st', '11 minutes': '2nd', '13 minutes': '3rd', '15 minutes': '4th' }, layout: 'compact' }, 'built_in', '10 minutes: 1st, 11 minutes: 2nd, 13 minutes: 3rd, 15 minutes: 4th'],
    [35, 24, 2, 'Write the correct sign: 21○12, 48○64, 55○55', 'short_answer', 'core', 1, 'option_fill', { options: ['<', '>', '='], rows: [{ type: 'comparison', left: 21, right: 12 }, { type: 'comparison', left: 48, right: 64 }, { type: 'comparison', left: 55, right: 55 }], correct: ['>', '<', '='] }, 'built_in', '>, <, ='],
    [36, 23, 2, 'Write the missing numbers on the number line (50 to 70).', 'short_answer', 'core', 1, 'number_line', { min: 50, max: 70, interval: 5, labelled: [50, 60, 70], blank: [55, 65] }, 'built_in', '55, 65'],
    [37, 29, 2, 'Ben wants 15 blocks, has 9. How many more does he need?', 'short_answer', 'core', 1, 'none', null, 'answer_box', '6'],
    [38, 29, 2, 'Match all pairs of numbers that add to 20.', 'short_answer', 'core', 1, 'matching_pairs', { left: ['5', '7', '4', '9'], right: ['15', '13', '16', '11'], correct: { '5': '15', '7': '13', '4': '16', '9': '11' } }, 'built_in', '5+15, 7+13, 4+16, 9+11'],
    [39, 53, 2, 'Complete the tally chart (robin=3, blue tit=?, sparrow=10).', 'short_answer', 'core', 1, 'tally_chart', { title: 'Birds in the garden', rows: [{ label: 'robin', value: 3 }, { label: 'blue tit', value: 5, blank: 'count' }, { label: 'sparrow', value: 10 }] }, 'built_in', '5'],
    [40, 36, 2, '6 teams, 5 children each. How many children altogether?', 'short_answer', 'core', 1, 'none', null, 'answer_box', '30'],
    [41, 22, 2, 'Kemi shows 56, adds 2 more tens. What is her new number?', 'short_answer', 'core', 1, 'none', null, 'answer_box', '76'],
    [42, 27, 2, 'Ben has 26 cards, Sita has 32. How many altogether?', 'short_answer', 'core', 1, 'none', null, 'answer_box', '58'],
    [43, 35, 2, 'Write +/−/×/÷: 8○2=16, 30○10=3, 7○6=13', 'short_answer', 'core', 2, 'option_fill', { options: ['+', '−', '×', '÷'], rows: [{ type: 'operator', left: 8, right: 2, result: 16 }, { type: 'operator', left: 30, right: 10, result: 3 }, { type: 'operator', left: 7, right: 6, result: 13 }], correct: ['×', '÷', '+'] }, 'built_in', '×, ÷, +'],
    [44, 21, 2, 'Continue: 7+3=10, 17+3=20, ?+3=30, ?+3=?', 'short_answer', 'core', 1, 'number_pattern', { variant: 'equations', rows: [{ first: 7, op: '+', second: 3, result: 10 }, { first: 17, op: '+', second: 3, result: 20 }, { first: null, op: '+', second: 3, result: 30 }, { first: null, op: '+', second: 3, result: null }], title: 'Continue the pattern' }, 'built_in', '27, 40'],
    [45, 33, 2, '3 groups of 3 marbles. Circle two correct calculations.', 'short_answer', 'core', 1, 'object_array', { groups: 3, items_per_group: 3, object: 'marble' }, 'built_in', '3×3, 3+3+3'],
    [46, 37, 2, 'Given ¼ of 8=2, find ²⁄₄ of 8 and ³⁄₄ of 8.', 'short_answer', 'core', 1, 'none', null, 'answer_box', '4, 6'],
    [47, 41, 2, 'How much more money does Ben have than Sita?', 'short_answer', 'core', 1, 'coin_display', { sets: { ben: ['50p', '20p', '10p', '5p'], sita: ['20p', '10p', '2p', '1p'] } }, 'answer_box', '52p'],
    [48, 37, 2, "Picture shows ½ of Sam's cars. How many altogether?", 'short_answer', 'core', 1, 'fraction_of_set', { fraction: '1/2', items_shown: 4, object: 'car' }, 'answer_box', '8'],
    [49, 32, 2, '□+□=20 and □×□=? (same two numbers)', 'short_answer', 'core', 1, 'none', null, 'answer_box', '4 and 5, 20'],
    [50, 43, 2, 'Book costs £17, pays with four £5 notes. Change?', 'short_answer', 'core', 1, 'none', null, 'answer_box', '£3'],
    [51, 27, 2, '24 sandwiches, 9 children eat 2 each. How many left?', 'short_answer', 'core', 2, 'none', null, 'answer_box', '6'],
    [52, 52, 2, 'Arrow moves ¼ turn anti-clockwise. Tick new position.', 'short_answer', 'core', 1, 'spinner', { sections: 4, labels: ['A', 'B', 'C', 'D'], arrow_start: 'A', turn_direction: 'anti-clockwise', turn_amount: '1/4' }, 'built_in', 'B'],
    [53, 43, 2, 'Card=32g, gift=47g, total=100g. How much does the letter weigh?', 'short_answer', 'core', 2, 'weight_scale', { items: [{ label: 'card', grams: 32 }, { label: 'gift', grams: 47 }, { label: 'letter', grams: null }], total: 100 }, 'answer_box', '21g'],
    [54, 22, 2, '_3 + 2_ = 50. Write the missing digits.', 'short_answer', 'core', 1, 'missing_digits', { segments: [{ type: 'blank', digits: 1 }, { type: 'number', value: 3 }, { type: 'symbol', char: '+' }, { type: 'number', value: 2 }, { type: 'blank', digits: 1 }, { type: 'symbol', char: '=' }, { type: 'number', value: 50 }] }, 'built_in', '2, 7'],
    [55, 32, 2, 'Circle calculations that check 16−4=12.', 'short_answer', 'core', 1, 'calculation_choices', { options: ['4+12', '12+4', '16-4', '12-4', '16-12'] }, 'built_in', '4+12, 12+4'],
    [56, 21, 2, 'Pattern +5: 2,7,12,17,22. Write the next even number.', 'short_answer', 'core', 1, 'number_pattern', { variant: 'sequence', items: [2, 7, 12, 17, 22], title: 'Pattern +5', rule: '+5 each time' }, 'answer_box', '32'],
  ].map(([id, objective_id, exam_source_id, question_text, question_type, difficulty, marks, visual_type, visual_config, answer_style, primary_answer]) => ({
    id,
    objective_id,
    exam_source_id,
    question_text,
    question_type,
    difficulty,
    marks,
    visual_type,
    visual_config,
    answer_style,
    primary_answer,
  })),
];

const records = questions.map((q) => ({
  id: q.id,
  question_text: q.question_text,
  question_type: q.question_type,
  difficulty: q.difficulty,
  marks: q.marks,
  visual_type: q.visual_type,
  visual_config: q.visual_config,
  answer_style: q.answer_style,
  primary_answer: q.primary_answer,
  exam_source_id: q.exam_source_id,
  objective_id: q.objective_id,
}));

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(records, null, 2), 'utf8');
console.log('Wrote', outPath, `(${records.length} questions)`);
