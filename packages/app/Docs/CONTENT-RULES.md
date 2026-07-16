# Content rules — how to author a SparkPack question

> The contract for every question in `lib/curriculum/packs/*.json`.
> Enforced where a machine can (`lib/curriculum/schema.ts`, `npm run validate-packs`);
> the rest is human review, and the rest is where the quality actually lives.
>
> Last updated 2026-07-16 (schemaVersion 2).

## The one idea

**One question = one fact, expressible in up to three forms.** You author the fact
once; the games present it at the difficulty they need.

| Form | Example | Scaffolding |
|---|---|---|
| `open` | "What is the capital city of Wales?" → Cardiff | none — hardest |
| `mcq` | same question + Cardiff / Swansea / Newport / Bangor | answer is on screen |
| `truefalse` | "The capital city of Wales is Swansea." → FALSE | 50/50 — easiest |

This is why it pays: **two strings, one answer and five distractors yield three
difficulty levels**, with fresh options every play. The old model needed three
separate items to say the same thing, and they never varied.

## The shape

Two surfaces plus one answer set:

| Field | Feeds |
|---|---|
| `ask` — interrogative | `open` **and** `mcq` |
| `claim` — declarative frame with one `{}` | `truefalse` only |
| `answer` + `distractors` | MCQ options, T/F slot fills, replay variety |

```json
{
  "id": "ca-wales",
  "factKey": "capital-wales",
  "difficulty": 2,
  "strand": "Capital cities",
  "objectiveCodes": ["Y3-UK-1", "Y3-UK-4"],
  "forms": ["open", "mcq", "truefalse"],
  "ask": "What is the capital city of Wales?",
  "claim": "The capital city of Wales is {}.",
  "claimIsTrue": null,
  "answer": "Cardiff",
  "answerDetail": "",
  "acceptableAnswers": ["cardiff"],
  "distractors": ["Swansea", "Newport", "Bangor", "Aberystwyth", "Wrexham"],
  "equation": null
}
```

**Every key is always present, in this order.** No omitted optionals; blanks are
`""`, `[]` or `null`. This is deliberate and non-negotiable: an authoring tool is
meant to be generated from this schema, and a shape that varies per question is
not worth building a form against. (Generate the tool's form from the Zod schema
via `zod-to-json-schema` — do not hand-maintain a second copy of the shape.)

## The rules

### `ask` — the interrogative surface

- **Must stand alone.** Never "Which of these…" or "Which is the longest?" — if the
  question only makes sense with options on screen, it cannot offer `open`, and
  declaring `open` will ship an unanswerable question.
- Read it aloud to an imagined class with no board. If it works, it stands alone.
- Every item must be answerable **on a projector without a picture**. No visuals.

### `claim` — the declarative frame

- Exactly one `{}` slot, filled at build time: the `answer` makes it TRUE, a
  distractor makes it FALSE.
- This is what kills the true/false guessing problem. The v1 corpus was **87 true
  to 31 false** — a pupil answering "true" every time scored 74%. Polarity is now
  a deal-time coin flip, not an authoring habit.
- `claimIsTrue` is **transitional**. It marks a slotless claim lifted from a v1
  true/false item, whose polarity was authored and cannot vary. Enrichment
  rewrites these into slotted claims and sets it back to `null`. When the count
  reaches zero, delete the field and require the slot.

### `answer` vs `answerDetail`

- `answer` is the **canonical short** answer. It must read correctly *both* as an
  MCQ option and inside the claim frame.
- `answerDetail` is the fuller thing the teacher reads on reveal.
- This split exists because prose answers cannot sit in an option list. `"Iron (or
  steel)"` and `"Any of: pushing, pulling, friction"` are real v1 answers; they
  need `answer: "Iron"`, `answerDetail: "Iron — and steel, because steel is mostly
  iron."`, `acceptableAnswers: ["steel"]`.
- `acceptableAnswers` are extra phrasings the teacher may accept. Lowercase by
  convention; do not repeat `answer` in the list.

### `distractors` — the load-bearing rule

**Target 5+. Three are drawn per game, so the same question looks different on
replay.** One list serves MCQ options *and* false claim fills, so:

1. **Every distractor must be independently and unambiguously wrong.** No
   "sometimes", no defensible-if-you-squint.
2. **Every distractor must read correctly inside the claim frame.** This kills
   "all of the above" and "none of these" — fine as an option, garbage as a
   statement ("A magnet attracts all of the above."). Do not write them.
3. **Any 3 of the 5 must work together.** No two distractors that are secretly the
   same answer.
4. **Same register and length as `answer`**, so the correct option is not obvious
   by shape alone.

The validator checks count and uniqueness. **It cannot check plausibility** — that
is human review, and it is the main quality risk in the whole design. A bad
distractor is worse than no game.

### `forms`

- Declares what this question may be presented as. **Target: all three.**
- Declare a form only when its data exists — the schema enforces this per form
  (`open` needs `ask` or an equation; `mcq` needs `ask` + `answer` + distractors;
  `truefalse` needs `claim`).
- Some facts genuinely resist a form, and that is correct pedagogy, not a gap.
  "Name the four countries of the UK" and "Why is friction useful when walking?"
  stay `open`-only. Do not force them.
- The validator warns on `forms.length < 3`; that warning *is* the enrichment
  worklist.

### `difficulty` and points — two axes

- `difficulty` (1 easy / 2 core / 3 stretch) is the **intrinsic hardness of the
  fact**, independent of form. Set it for the fact, not the presentation.
- The form applies a scaffolding multiplier. Points = difficulty × form.
- The axes are orthogonal: an easy fact asked open is worth the same as a core
  fact as true/false. That is the intended statement.

*(Planned, step 4: `open` ×1.0, `mcq` ×0.7, `truefalse` ×0.5 → 100/200/300,
70/140/210, 50/100/150. Values are guesses until a classroom trial.)*

### `factKey`

- Questions sharing a `factKey` test the **same fact**; games refuse to deal two
  of them, so one cannot give away another.
- This is a real bug in the v1 corpus: `science-y3-forces-magnets` had four items
  on "like poles repel", including a true/false and its own negation.
- Default is the question's own id — meaning "its own fact". Only group ids when
  you are sure; a wrong guess silently stops a game dealing two fair questions.

### `equation`

- Number sentences only; `null` otherwise.
- **Exactly one unknown.** The game chooses which part to hide and rotates it, so
  a deck shows `24 + 16 = ?`, `24 + ? = 40` and `? + 16 = 40`.
- **Do not author equation distractors.** The answer depends on which part the
  game hides at build time — `24 + ? = 40` answers 16, not 40 — so near-misses
  must be generated at build time, not stored.
- Use the ASCII operators in the enum (`+ - × ÷`). The v1 `maths-y2` pack mixes a
  Unicode minus (`−`, U+2212) into statement text; do not copy that.

### Pack-level

- Pack id is `<subject>-y<year>-<topicId>` and must match the filename.
- `objectives` carry the **statutory NC wording verbatim** — objectives-first, no
  information loss. Every question should tag at least one `objectiveCode`. (The
  two Y2 packs tag none, so their objectives are currently unreachable.)
- `strand` groups questions into sub-topics; board games use it for columns and
  need 2–4 strands with 2+ questions each. Only equations may have `""`.
- Question ids need only be unique within a pack.
- **No emojis anywhere.** Not in content, not in UI.

## What the machine checks

| Check | Where |
|---|---|
| Shape, per-form data, one `{}` slot, `claimIsTrue` consistency | `schema.ts` superRefine |
| Equation arithmetic; answer not among distractors; distractors unique | `schema.ts` superRefine |
| Pack id vs filename; board strand fit; which games a pack powers | `validate-packs.mjs` |
| Every pack × every game still builds the same content | `vitest` snapshot |
| Distractor **plausibility**, `ask` standing alone, register | **nobody — human review** |

## Warnings are the worklist

`npm run validate-packs` prints, and these are expected to fall to zero as packs
are enriched — then promote them to errors:

- questions offering fewer than 3 forms
- MCQ questions with fewer than 5 distractors
- slotless claims (fixed polarity)
- questions with no shared `factKey` yet

## Drafting with AI

This is what dev-time AI is for (MASTER-PLAN decision 3: **no AI at runtime, ever**).
Drafting five distractors for a known fact is the single best-suited task for it.
The loop is: **AI drafts → Zod validates → human reviews → commit.** The app never
sees anything unvalidated, and nothing reaches a classroom unread.
