# Drafter instructions — the 3b content pass

> **Give this file, verbatim, to the model doing the drafting.** It is written to
> be followed mechanically by a cheaper model, one pack per run. It is not a
> summary of CONTENT-RULES.md — it is the job, stated as steps.
>
> Nothing you write ships. A human reviews every question in the authoring tool
> afterwards. Your job is to produce a complete, valid, honest draft — not a
> perfect one. **If you are unsure, flag it. Do not guess.**

---

## What you are given

1. **The source pack** — `lib/curriculum/packs/<packId>.json`. This is the
   existing content. It is correct. It is your only source of facts.
2. **The skeleton** — `content-drafts/<packId>.skeleton.json`. This is what you
   fill in. It already contains every question's `id`, `strand`,
   `objectiveCodes` and `equation`.
3. This file.

## The one rule above all others

**Do not invent facts.** Every question in the skeleton corresponds to a question
in the source pack with the same `id`. You are re-expressing a fact that already
exists — never adding new subject knowledge. If the source says the Iron Age
began around 800 BC, that is the fact. Do not adjust it, extend it, or add a
second fact alongside it.

You are rewriting **form**, not **content**.

## Fields you must never change

Copy these from the skeleton exactly as they are. They are already correct:

- `id`, `strand`, `objectiveCodes`, `equation`

If one of them looks wrong to you, **leave it alone and note it in your report**
(see the end). Do not fix it.

## Fields you write

For every question, produce:

| Field | What it is |
|---|---|
| `ask` | The question, asked out loud. Ends with `?` |
| `claim` | A statement with one `{}` where the answer goes. Ends with `.` |
| `answer` | The short, canonical answer. Fits in an option list. |
| `answerDetail` | The fuller thing a teacher reads out. `""` if not needed. |
| `acceptableAnswers` | Other phrasings a teacher would accept. Lowercase. `[]` if none. |
| `distractors` | **Exactly 5** wrong answers. `[]` for equations. |
| `forms` | Which of `open`, `mcq`, `truefalse` you actually wrote. |
| `factKey` | Leave equal to `id` unless merging — see step 6. |

---

## The steps, per question

### Step 1 — find the fact

Read the source question with the same `id`. Say the fact to yourself in one
sentence. Everything below expresses *that one sentence*.

### Step 2 — write `ask`

The question form, asked as if to a class **with nothing on screen**.

- Starts with a capital. Ends with `?`.
- **It must make sense with no options visible.** This is the most common
  mistake. Test: could a pupil answer it on a blank whiteboard?

| Bad | Why | Good |
|---|---|---|
| `Which of these is the capital of Wales?` | Needs options on screen | `What is the capital city of Wales?` |
| `Which one is longest?` | Needs options on screen | `Which is longer: 45 cm or 4 m?` |
| `True or false: Cardiff is the capital.` | That is a claim, not an ask | `What is the capital city of Wales?` |

**Never begin an `ask` with "Which of these" or "Which of the following".**

### Step 3 — write `answer` and `answerDetail`

- `answer` is **short**. It has to fit in a list of four options *and* read
  correctly inside a sentence. One or two words, or a number.
- If the real answer is prose, put the short version in `answer` and the prose in
  `answerDetail`.

| Source answer | `answer` | `answerDetail` |
|---|---|---|
| `Iron (or steel)` | `Iron` | `Iron — and steel, because steel is mostly iron.` |
| `Any of: pushing, pulling, friction` | `Pushing` | `Pushing, pulling and friction are all forces.` |
| `Cardiff` | `Cardiff` | `""` |

Put alternatives in `acceptableAnswers`, lowercase: `["steel"]`. **Do not repeat
`answer` in `acceptableAnswers`.**

### Step 4 — write `claim`

The same fact as a **statement**, with the answer removed and replaced by `{}`.

- Exactly one `{}`. Starts with a capital. Ends with `.`
- Check it twice:
  - Put `answer` in the slot → the sentence must be **TRUE**.
  - Put any distractor in the slot → the sentence must be **FALSE**.

```
ask:    "What is the capital city of Wales?"
answer: "Cardiff"
claim:  "The capital city of Wales is {}."

  → "The capital city of Wales is Cardiff."   TRUE
  → "The capital city of Wales is Swansea."   FALSE
```

The slot does not have to be at the end:

```
claim: "{} is the largest planet in the Solar System."
```

**If the source question is a true/false with a fixed statement**, do not copy the
statement into `claim`. Work out what fact it tests and write a fresh slotted
claim for that fact. Then set `claimIsTrue` to `null`.

Example — source: `"Dark is simply the absence of light."` (isTrue: true)
- fact: darkness is the absence of light
- `ask`: `"What is darkness?"`
- `answer`: `"The absence of light"`
- `claim`: `"Darkness is {}."`

### Step 5 — write exactly 5 `distractors`

This is the hardest part and the part that matters most. Each distractor must
pass **all five** checks:

1. **Wrong.** Unambiguously, not "wrong-ish". If it could be argued correct, drop it.
2. **Reads as an option.** It sits in a list next to `answer`.
3. **Reads inside the claim.** Put it in the `{}` slot — the sentence must be
   grammatical and false. This is why **"all of the above" / "none of these" are
   banned**: "A magnet attracts all of the above." is nonsense.
4. **Same shape as the answer.** Same rough length, same capitalisation, same
   kind of thing. If `answer` is `Cardiff`, distractors are other city names —
   not `A big city in Wales`. If the answer is a number, distractors are numbers.
5. **Distinct from each other.** No two distractors that mean the same thing.
   Any 3 of your 5 must work together as an option set, because the game picks 3
   at random.

```
answer:      "Cardiff"
distractors: ["Swansea", "Newport", "Bangor", "Aberystwyth", "Wrexham"]
```

All Welsh. All cities. All capitalised. All one word. All obviously not the
capital. Any three work together.

```
BAD: ["swansea", "a city in the south", "London", "None of these", "Cardif"]
      ^lowercase  ^wrong shape          ^not Welsh  ^banned       ^typo of the answer
```

**Equations: write `[]`.** Never author distractors for a question with a
non-null `equation`. The game hides a different part of the sum each time it
deals it (`24 + ? = 40` answers 16, not 40), so wrong answers must be generated
at play time. Writing them here would be wrong half the time.

### Step 6 — `factKey`: propose, never merge

If two questions in the pack test **the same fact**, say so **in your report**.
Leave `factKey` equal to `id` in the file.

A human decides merges. A wrong merge silently stops a game dealing two perfectly
good questions, so it is not your call.

### Step 7 — set `forms`

List only what you actually wrote:

- `open` — you wrote an `ask` that stands alone (or the question has an equation)
- `mcq` — you wrote an `ask`, an `answer`, and 5 distractors
- `truefalse` — you wrote a `claim` with a `{}` slot

**Target: all three, for every question.** If you managed all three, write
`["open", "mcq", "truefalse"]`.

### Step 8 — when a question resists a form

Some facts genuinely cannot take a form. Examples:

- `"Name the four countries of the UK"` — the answer is a set, not one option.
- `"Why is friction useful when walking?"` — the answer is an explanation.

**Do not force these.** Do not invent five fake distractors to make the number
work. Instead: leave the question in the skeleton with whatever forms you *could*
write, and **list it in your report under "form-resistant"** with a sentence on
which form it resists and why.

A human decides whether it is quarantined. Be honest here — this is the single
most useful thing you can flag. **"I could not write five good distractors" and
"five good distractors do not exist" look the same from the outside, and only you
know which one it was. Say which.**

---

## Global rules

- **No emojis.** Anywhere.
- **UK English.** "colour", "metre", "practise" (verb).
- Every question must be answerable **out loud, on a projector, with no picture**.
  No "look at the diagram", no "in the image below".
- Use the ASCII operators `+ - × ÷`. Never the Unicode minus `−`.
- Do not add questions. Do not remove questions. The skeleton has exactly the
  questions you must fill.

## Before you finish

Check each of these yourself:

- [ ] Every question has all 14 keys, in the skeleton's order.
- [ ] No `ask` starts with "Which of these" / "Which of the following".
- [ ] Every `claim` has exactly one `{}`.
- [ ] Every non-equation question has **exactly 5** distractors.
- [ ] Every equation question has **0** distractors and `forms: ["open"]`.
- [ ] `answer` never appears in its own `distractors`.
- [ ] No distractor contains "of the above" or "of these".
- [ ] `id`, `strand`, `objectiveCodes`, `equation` are unchanged.
- [ ] No facts invented.

## Your report

Alongside the filled skeleton, write a short report:

1. **Form-resistant questions** — id, which form it resists, one sentence why.
2. **Proposed factKey merges** — the ids that test the same fact, and the fact.
3. **Anything in the source that looks wrong** — a wrong answer, an ambiguous
   question, a strand that does not fit. **Do not fix these.** Report them.
4. **Anything you were unsure about.** Low confidence is useful information. A
   flagged doubt costs a human ten seconds; an unflagged bad distractor reaches a
   classroom.

---

## What happens next

1. `npm run validate-packs` — Zod checks your draft. If it fails, you get the
   errors back and fix them. Nothing invalid ever reaches the corpus.
2. A human reviews every question in the authoring tool (`/dev/authoring`).
3. Only then is the pack committed.

You cannot break anything. The worst you can do is waste the reviewer's time —
which is exactly what a guessed distractor does. **Flag it instead.**
