/**
 * Default values for generating games without manual data entry.
 * Use these to pre-fill the create form or to quick-play a ready-made game.
 */

import type { StrategyBoardQuizContent } from '@/lib/templates/strategy-board-quiz'

/** Default number of teams for strategy board quiz. */
export const DEFAULT_NUM_TEAMS = 4

/** Default team names (used when creating a new game). */
export const DEFAULT_TEAM_NAMES = [
  'Team Red',
  'Team Blue',
  'Team Green',
  'Team Yellow',
]

/** Default 4×4 Strategy Board Quiz content – Food Groups Challenge. Ready to play with no editing. */
export const DEFAULT_STRATEGY_BOARD_QUIZ_CONTENT: StrategyBoardQuizContent = {
  title: 'Food Groups Challenge',
  learningFocus: 'Understanding food groups and balanced nutrition',
  topics: ['Fruits', 'Vegetables', 'Grains', 'Protein'],
  board: {
    rows: 4,
    cols: 4,
    pointsPerRow: [100, 200, 300, 400],
    cells: [
      {
        topic: 'Fruits',
        points: 100,
        prompt: 'Name one fruit that is high in Vitamin C',
        acceptableAnswers: ['orange', 'oranges', 'kiwi', 'strawberry', 'lemon'],
      },
      {
        topic: 'Vegetables',
        points: 100,
        prompt: 'Name a green vegetable',
        acceptableAnswers: ['broccoli', 'spinach', 'lettuce', 'peas', 'green beans', 'kale'],
      },
      {
        topic: 'Grains',
        points: 100,
        prompt: 'Name one type of bread',
        acceptableAnswers: ['white bread', 'whole wheat', 'baguette', 'rolls'],
      },
      {
        topic: 'Protein',
        points: 100,
        prompt: 'Name one food from the protein group',
        acceptableAnswers: ['chicken', 'beef', 'fish', 'eggs', 'beans', 'tofu'],
      },
      {
        topic: 'Fruits',
        points: 200,
        prompt: 'Why are fruits important in our diet?',
        acceptableAnswers: ['vitamins', 'nutrients', 'fiber', 'healthy', 'energy'],
      },
      {
        topic: 'Vegetables',
        points: 200,
        prompt: 'What nutrients do vegetables provide?',
        acceptableAnswers: ['vitamins', 'minerals', 'fiber', 'nutrients'],
      },
      {
        topic: 'Grains',
        points: 200,
        prompt: 'Give an example of a whole grain food',
        acceptableAnswers: ['brown rice', 'whole wheat bread', 'oatmeal', 'quinoa'],
      },
      {
        topic: 'Protein',
        points: 200,
        prompt: 'Why do we need protein?',
        acceptableAnswers: ['build muscle', 'growth', 'repair', 'strength'],
      },
      {
        topic: 'Fruits',
        points: 300,
        prompt: 'If one serving of fruit is 80 grams, how many servings is 240 grams?',
        acceptableAnswers: ['3', 'three', '3 servings'],
      },
      {
        topic: 'Vegetables',
        points: 300,
        prompt: 'Compare carrots and potatoes - which food group does each belong to?',
        acceptableAnswers: ['carrots vegetables potatoes grains', 'vegetables and grains'],
      },
      {
        topic: 'Grains',
        points: 300,
        prompt: 'What is the difference between white bread and brown bread?',
        acceptableAnswers: ['brown has more fiber', 'whole grain', 'more nutrients in brown'],
      },
      {
        topic: 'Protein',
        points: 300,
        prompt: 'Name two sources of protein - one animal, one plant',
        acceptableAnswers: ['chicken and beans', 'fish and lentils', 'beef and tofu'],
      },
      {
        topic: 'Fruits',
        points: 400,
        prompt: 'Explain why eating a variety of fruits is better than just one type',
        acceptableAnswers: ['different vitamins', 'variety of nutrients', 'balance'],
      },
      {
        topic: 'Vegetables',
        points: 400,
        prompt: 'Why should we eat vegetables from different colors?',
        acceptableAnswers: ['different nutrients', 'variety', 'balanced diet'],
      },
      {
        topic: 'Grains',
        points: 400,
        prompt: 'Explain why whole grains are healthier than refined grains',
        acceptableAnswers: ['more fiber', 'more nutrients', 'less processed'],
      },
      {
        topic: 'Protein',
        points: 400,
        prompt: 'Why would eating only protein and no other food groups be unhealthy?',
        acceptableAnswers: ['need balance', 'missing vitamins', 'unbalanced', 'need variety'],
      },
    ],
  },
  teacherScript: [
    'Each team chooses one question.',
    'Start the 20s discussion timer.',
    'One student gives the answer.',
    'If wrong, other teams can steal.',
  ],
  studentInstructions: [
    'Choose a question as a team.',
    'Discuss for twenty seconds.',
    'One person gives your answer.',
    'Listen for chances to steal.',
  ],
  fastFinisherExtension: 'Create a balanced meal plan using all four food groups.',
}
