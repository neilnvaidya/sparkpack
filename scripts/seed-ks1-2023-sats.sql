-- Seed KS1 2023 SATs: exam_sources, questions, answers, question_objectives.
-- Run once against the Supabase DB (schema already applied).
-- If your visual_type enum does not yet include new types, run once:
--   ALTER TYPE visual_type ADD VALUE 'block_chart';
--   ALTER TYPE visual_type ADD VALUE 'option_fill';
--   ALTER TYPE visual_type ADD VALUE 'missing_digits';
--   ALTER TYPE visual_type ADD VALUE 'calculation_choices';
--   ALTER TYPE visual_type ADD VALUE 'item_list';
--   ALTER TYPE visual_type ADD VALUE 'number_pattern';
-- Questions use explicit id 1–25 (Paper 1) and 26–56 (Paper 2) so answers and question_objectives can reference them.
-- If your questions table does not have answer_style yet: ALTER TABLE questions ADD COLUMN answer_style text CHECK (answer_style IN ('built_in', 'answer_box'));

BEGIN;

-- 1. Exam sources (id 1 = Paper 1 Arithmetic, id 2 = Paper 2 Reasoning)
INSERT INTO exam_sources (id, curriculum_id, name, exam_board, year, paper_number, tier, url)
VALUES
  (1, 1, 'KS1 Mathematics Paper 1: Arithmetic', 'STA', 2023, '1', NULL, NULL),
  (2, 1, 'KS1 Mathematics Paper 2: Reasoning', 'STA', 2023, '2', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 2. Paper 1: 25 questions (id 1–25), all visual_type = 'none', all answer_style = 'answer_box'
INSERT INTO questions (id, objective_id, exam_source_id, question_text, question_type, difficulty, marks, status, visual_type, visual_config, answer_style)
VALUES
  (1, 6, 1, '3 + 6 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (2, 30, 1, '12 + 2 + 2 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (3, 8, 1, '13 − 7 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (4, 33, 1, '10 × 4 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (5, 30, 1, '35 + 5 + 5 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (6, 30, 1, '22 + 20 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (7, 33, 1, '3 × 5 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (8, 30, 1, '10 + 60 + 20 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (9, 29, 1, '79 − 6 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (10, 29, 1, '9 + 32 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (11, 33, 1, '11 × 2 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (12, 33, 1, '6 ÷ 2 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (13, 33, 1, '24 ÷ 2 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (14, 30, 1, '32 + 46 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (15, 37, 1, '½ of 60 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (16, 29, 1, '45 − 13 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (17, 29, 1, '94 − 40 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (18, 30, 1, '14 + 77 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (19, 32, 1, '? − 5 = 3', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (20, 32, 1, '11 + ? = 77', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (21, 37, 1, '½ of 42 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (22, 37, 1, '¼ of 28 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (23, 29, 1, '41 − 15 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (24, 29, 1, '67 − 58 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (25, 29, 1, '82 − 63 = ', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box')
ON CONFLICT (id) DO NOTHING;

-- 3. Paper 2: 32 questions (id 26–56), with visual_type, visual_config, answer_style (built_in = circle/choose/fill on page; answer_box = write answer)
INSERT INTO questions (id, objective_id, exam_source_id, question_text, question_type, difficulty, marks, status, visual_type, visual_config, answer_style)
VALUES
  (26, 3, 2, 'Circle the number that is 2 less than the number on the dice.', 'short_answer', 'core', 1, 'reviewed', 'dice', '{"value": 5, "number_options": [2, 3, 4, 5, 6]}'::jsonb, 'built_in'),
  (27, 23, 2, 'Write the value marked on the number line.', 'short_answer', 'core', 1, 'reviewed', 'number_line', '{"min": 50, "max": 70, "interval": 5, "labelled": [50, 60, 70], "blank": [55]}'::jsonb, 'answer_box'),
  (28, 1, 2, 'Count all the objects. Write your answer.', 'short_answer', 'core', 1, 'reviewed', 'count_objects', '{"groups": [{"object": "apple", "count": 3}, {"object": "apple", "count": 2}]}'::jsonb, 'answer_box'),
  (29, 8, 2, 'How many of the fruits shown are not oranges?', 'short_answer', 'core', 1, 'reviewed', 'count_objects', '{"groups": [{"object": "orange", "count": 2}, {"object": "apple", "count": 4}]}'::jsonb, 'answer_box'),
  (30, 25, 2, 'Match the words to the correct numerals: ninety-nine, sixteen, forty-three', 'short_answer', 'core', 1, 'reviewed', 'matching_pairs', '{"left": ["ninety-nine", "sixteen", "forty-three"], "right": ["61", "99", "16", "34", "43"], "correct": {"ninety-nine": "99", "sixteen": "16", "forty-three": "43"}, "example_pair": "ninety-nine"}'::jsonb, 'built_in'),
  (31, 53, 2, 'Complete the block chart to show 4 ducks.', 'short_answer', 'core', 1, 'reviewed', 'block_chart', '{"title": "Animals in a pond", "rows": [{"label": "duck", "value": 4, "given": false}, {"label": "frog", "value": 3, "given": true}, {"label": "fish", "value": 6, "given": true}]}'::jsonb, 'built_in'),
  (32, 47, 2, 'Tick the two shapes with the same number of sides.', 'short_answer', 'core', 1, 'reviewed', 'shape_grid', '{"shapes": ["square", "rhombus", "triangle", "pentagon"], "task": "select_matching_sides"}'::jsonb, 'built_in'),
  (33, 48, 2, 'Classify each object as cuboid, cone or cylinder.', 'short_answer', 'core', 1, 'reviewed', 'shape_classify', '{"objects": ["box", "tin_can", "cereal_box", "party_hat"], "categories": ["cuboid", "cylinder", "cuboid", "cone"], "correct": {"box": "cuboid", "tin_can": "cylinder", "cereal_box": "cuboid", "party_hat": "cone"}}'::jsonb, 'built_in'),
  (34, 44, 2, 'Match each race time to the child''s finishing position.', 'short_answer', 'core', 1, 'reviewed', 'matching_pairs', '{"left": ["10 minutes", "11 minutes", "13 minutes", "15 minutes"], "right": ["1st", "2nd", "3rd", "4th"], "correct": {"10 minutes": "1st", "11 minutes": "2nd", "13 minutes": "3rd", "15 minutes": "4th"}, "layout": "compact"}'::jsonb, 'built_in'),
  (35, 24, 2, 'Write the correct sign: 21○12, 48○64, 55○55', 'short_answer', 'core', 1, 'reviewed', 'option_fill', '{"options": ["<", ">", "="], "rows": [{"type": "comparison", "left": 21, "right": 12}, {"type": "comparison", "left": 48, "right": 64}, {"type": "comparison", "left": 55, "right": 55}], "correct": [">", "<", "="]}'::jsonb, 'built_in'),
  (36, 23, 2, 'Write the missing numbers on the number line (50 to 70).', 'short_answer', 'core', 1, 'reviewed', 'number_line', '{"min": 50, "max": 70, "interval": 5, "labelled": [50, 60, 70], "blank": [55, 65]}'::jsonb, 'built_in'),
  (37, 29, 2, 'Ben wants 15 blocks, has 9. How many more does he need?', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (38, 29, 2, 'Match all pairs of numbers that add to 20.', 'short_answer', 'core', 1, 'reviewed', 'matching_pairs', '{"left": ["5", "7", "4", "9"], "right": ["15", "13", "16", "11"], "correct": {"5": "15", "7": "13", "4": "16", "9": "11"}}'::jsonb, 'built_in'),
  (39, 53, 2, 'Complete the tally chart (robin=3, blue tit=?, sparrow=10).', 'short_answer', 'core', 1, 'reviewed', 'tally_chart', '{"title": "Birds in the garden", "rows": [{"label": "robin", "value": 3}, {"label": "blue tit", "value": 5, "blank": "count"}, {"label": "sparrow", "value": 10}]}'::jsonb, 'built_in'),
  (40, 36, 2, '6 teams, 5 children each. How many children altogether?', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (41, 22, 2, 'Kemi shows 56, adds 2 more tens. What is her new number?', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (42, 27, 2, 'Ben has 26 cards, Sita has 32. How many altogether?', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (43, 35, 2, 'Write +/−/×/÷: 8○2=16, 30○10=3, 7○6=13', 'short_answer', 'core', 2, 'reviewed', 'option_fill', '{"options": ["+", "−", "×", "÷"], "rows": [{"type": "operator", "left": 8, "right": 2, "result": 16}, {"type": "operator", "left": 30, "right": 10, "result": 3}, {"type": "operator", "left": 7, "right": 6, "result": 13}], "correct": ["×", "÷", "+"]}'::jsonb, 'built_in'),
  (44, 21, 2, 'Continue: 7+3=10, 17+3=20, ?+3=30, ?+3=?', 'short_answer', 'core', 1, 'reviewed', 'number_pattern', '{"variant": "equations", "rows": [{"first": 7, "op": "+", "second": 3, "result": 10}, {"first": 17, "op": "+", "second": 3, "result": 20}, {"first": null, "op": "+", "second": 3, "result": 30}, {"first": null, "op": "+", "second": 3, "result": null}], "title": "Continue the pattern"}'::jsonb, 'built_in'),
  (45, 33, 2, '3 groups of 3 marbles. Circle two correct calculations.', 'short_answer', 'core', 1, 'reviewed', 'object_array', '{"groups": 3, "items_per_group": 3, "object": "marble"}'::jsonb, 'built_in'),
  (46, 37, 2, 'Given ¼ of 8=2, find ²⁄₄ of 8 and ³⁄₄ of 8.', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (47, 41, 2, 'How much more money does Ben have than Sita?', 'short_answer', 'core', 1, 'reviewed', 'coin_display', '{"sets": {"ben": ["50p", "20p", "10p", "5p"], "sita": ["20p", "10p", "2p", "1p"]}}'::jsonb, 'answer_box'),
  (48, 37, 2, 'Picture shows ½ of Sam''s cars. How many altogether?', 'short_answer', 'core', 1, 'reviewed', 'fraction_of_set', '{"fraction": "1/2", "items_shown": 4, "object": "car"}'::jsonb, 'answer_box'),
  (49, 32, 2, '□+□=20 and □×□=? (same two numbers)', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (50, 43, 2, 'Book costs £17, pays with four £5 notes. Change?', 'short_answer', 'core', 1, 'reviewed', 'none', NULL, 'answer_box'),
  (51, 27, 2, '24 sandwiches, 9 children eat 2 each. How many left?', 'short_answer', 'core', 2, 'reviewed', 'none', NULL, 'answer_box'),
  (52, 52, 2, 'Arrow moves ¼ turn anti-clockwise. Tick new position.', 'short_answer', 'core', 1, 'reviewed', 'spinner', '{"sections": 4, "labels": ["A", "B", "C", "D"], "arrow_start": "A", "turn_direction": "anti-clockwise", "turn_amount": "1/4"}'::jsonb, 'built_in'),
  (53, 43, 2, 'Card=32g, gift=47g, total=100g. How much does the letter weigh?', 'short_answer', 'core', 2, 'reviewed', 'weight_scale', '{"items": [{"label": "card", "grams": 32}, {"label": "gift", "grams": 47}, {"label": "letter", "grams": null}], "total": 100}'::jsonb, 'answer_box'),
  (54, 22, 2, '_3 + 2_ = 50. Write the missing digits.', 'short_answer', 'core', 1, 'reviewed', 'missing_digits', '{"segments": [{"type": "blank", "digits": 1}, {"type": "number", "value": 3}, {"type": "symbol", "char": "+"}, {"type": "number", "value": 2}, {"type": "blank", "digits": 1}, {"type": "symbol", "char": "="}, {"type": "number", "value": 50}]}'::jsonb, 'built_in'),
  (55, 32, 2, 'Circle calculations that check 16−4=12.', 'short_answer', 'core', 1, 'reviewed', 'calculation_choices', '{"options": ["4+12", "12+4", "16-4", "12-4", "16-12"]}'::jsonb, 'built_in'),
  (56, 21, 2, 'Pattern +5: 2,7,12,17,22. Write the next even number.', 'short_answer', 'core', 1, 'reviewed', 'number_pattern', '{"variant": "sequence", "items": [2, 7, 12, 17, 22], "title": "Pattern +5", "rule": "+5 each time"}'::jsonb, 'answer_box')
ON CONFLICT (id) DO NOTHING;

-- 4. Answers (one primary correct per question)
INSERT INTO answers (question_id, answer_text, is_correct, is_primary, display_order)
VALUES
  (1, '9', true, true, 0),
  (2, '16', true, true, 0),
  (3, '6', true, true, 0),
  (4, '40', true, true, 0),
  (5, '45', true, true, 0),
  (6, '42', true, true, 0),
  (7, '15', true, true, 0),
  (8, '90', true, true, 0),
  (9, '73', true, true, 0),
  (10, '41', true, true, 0),
  (11, '22', true, true, 0),
  (12, '3', true, true, 0),
  (13, '12', true, true, 0),
  (14, '78', true, true, 0),
  (15, '30', true, true, 0),
  (16, '32', true, true, 0),
  (17, '54', true, true, 0),
  (18, '91', true, true, 0),
  (19, '8', true, true, 0),
  (20, '66', true, true, 0),
  (21, '21', true, true, 0),
  (22, '7', true, true, 0),
  (23, '26', true, true, 0),
  (24, '9', true, true, 0),
  (25, '19', true, true, 0),
  (26, '3', true, true, 0),
  (27, '55', true, true, 0),
  (28, '5', true, true, 0),
  (29, '4', true, true, 0),
  (30, '99, 16, 43', true, true, 0),
  (31, '4', true, true, 0),
  (32, 'square and rhombus', true, true, 0),
  (33, 'box: cuboid, tin_can: cylinder, cereal_box: cuboid, party_hat: cone', true, true, 0),
  (34, '10 minutes: 1st, 11 minutes: 2nd, 13 minutes: 3rd, 15 minutes: 4th', true, true, 0),
  (35, '>, <, =', true, true, 0),
  (36, '55, 65', true, true, 0),
  (37, '6', true, true, 0),
  (38, '5+15, 7+13, 4+16, 9+11', true, true, 0),
  (39, '5', true, true, 0),
  (40, '30', true, true, 0),
  (41, '76', true, true, 0),
  (42, '58', true, true, 0),
  (43, '×, ÷, +', true, true, 0),
  (44, '27, 40', true, true, 0),
  (45, '3×3, 3+3+3', true, true, 0),
  (46, '4, 6', true, true, 0),
  (47, '52p', true, true, 0),
  (48, '8', true, true, 0),
  (49, '4 and 5, 20', true, true, 0),
  (50, '£3', true, true, 0),
  (51, '6', true, true, 0),
  (52, 'B', true, true, 0),
  (53, '21g', true, true, 0),
  (54, '2, 7', true, true, 0),
  (55, '4+12, 12+4', true, true, 0),
  (56, '32', true, true, 0);

-- 5. Question-objectives (one row per question, is_primary = true)
INSERT INTO question_objectives (question_id, objective_id, is_primary)
SELECT q.id, q.objective_id, true
FROM questions q
WHERE q.id BETWEEN 1 AND 56
  AND q.objective_id IS NOT NULL
ON CONFLICT (question_id, objective_id) DO NOTHING;

COMMIT;
