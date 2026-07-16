# The content pass — authoring tool, enrichment, verify

> Steps 3b → 5 of the multi-form questions plan, at working detail.
> Supersedes the one-paragraph sketches of 3b/4/5 in
> `~/.claude/plans/points-to-address-1-starry-pillow.md`.
> The authoring contract itself is [CONTENT-RULES.md](./CONTENT-RULES.md) — this
> doc is *how the work gets done*, not *what a good question is*.
>
> Written 2026-07-16, after step 3a landed (`16de58e`).

## Where we actually are

Step 3a lifted 417 v1 items into 417 v2 questions without inventing a word. That
was the point, and it means **every question in the corpus is currently
single-form**. The validator says so:

```
417 questions offer fewer than 3 forms
124 MCQ questions have fewer than 5 distractors
118 claims are slotless (fixed polarity — cannot vary true/false)
417 questions have no shared factKey yet (each is its own fact)
```

Those four numbers are the worklist. The content pass drives them to zero. Every
pack is `ok` today only because the schema enforces data *per declared form* —
declare one form, need one form's data. That escape hatch is what makes the pass
incremental instead of a big bang, and it closes at the end of step 5.

## The order, and why it changed

The original plan went 3b (content) → 4 (two-axis scoring) → 5 (factKey dedupe).
Three decisions (Neil, 2026-07-16) reshape that:

1. **The tool comes first.** 3b is ~2,085 distractors and 417 claim frames across
   19 packs. Reviewing that as raw JSON in an editor is not review, it is
   rubber-stamping — and the plan's own rule is that a bad distractor is worse
   than no game. The review surface has to exist before the content does.
2. **Step 4 mostly collapses.** Intrinsic content difficulty is not worth the
   effort right now. Three forms is enough of a ladder: points rank by form
   alone. The `difficulty` field stays in the schema (Summit Climb still pools by
   it) but stops driving points.
3. **Step 5 is a verify pass, not a feature.** It is entirely downstream of 3b —
   `factKey` grouping is a thing you *author*, so dedupe is just consuming what
   3b produced, plus tightening the schema.

So: **tool → content → forms-only scoring → verify.**

---

## Step 3b-0 — the authoring tool

A dev-only page for reading, reviewing, editing and writing back pack JSON. It
serves three jobs, and it must serve all three or it is not worth building:

- **Review surface** for the AI-drafted content of 3b (the immediate need).
- **Repair surface** — edit and delete without hand-editing JSON.
- **Manual authoring surface** — write a question from scratch. This is the
  long-term reason it survives past 3b.

### Archive first

Before the tool can write anything, `git` is the real safety net, but Neil asked
for an explicit archive and it costs nothing:

- `scripts/archive-packs.mjs` copies `lib/curriculum/packs/*.json` to
  `Docs/packs-archive/<ISO-date>/`, committed once.
- This is the pre-3b corpus. If the pass goes wrong, restore from here rather
  than unpicking commits.

### Route and safety

- Page at `app/dev/authoring/page.tsx`; write endpoint at
  `app/api/dev/packs/[packId]/route.ts` (POST).
- **Both 404 unless `process.env.NODE_ENV === 'development'.`** A route handler
  that writes to `lib/curriculum/packs/` must not exist in a deployed build. This
  is the one hard security line in the tool.
- The endpoint reads the posted pack, `curriculumPackSchema.parse`s it, and only
  then writes. **A pack that fails Zod never reaches disk** — the tool cannot
  corrupt the corpus, worst case it refuses to save.
- Write with a **stable key order** matching CONTENT-RULES' declared order, 2-space
  indent, trailing newline. Otherwise every save produces a noise diff and review
  by `git diff` becomes useless — which matters, because `git diff` is the second
  review surface.

### Layout

Left: a tree, grouped the way the library already groups (subject → year →
topic), driven by `lib/curriculum/map.ts` so the tool cannot drift from the app.
Expanding a topic lists its questions — id, `ask` truncated, and a per-form
badge showing which of the three forms this question currently offers. The badge
is the worklist made visible: a question with one badge lit is unfinished work.

Right: the question editor. **Three panels in a row, one per form**, because the
whole thesis of the schema is that one fact wears three faces and you should see
all three at once:

| Panel | Shows | Edits |
|---|---|---|
| **Open** | `ask`, `answer`, `answerDetail`, `acceptableAnswers` | the interrogative surface |
| **MCQ** | the same `ask`, then a **stacked column** of options: `answer` pinned at top and clearly marked correct, `distractors` below | the answer set |
| **T/F** | `claim` with its `{}` slot, plus a live preview of the TRUE fill and one FALSE fill | the declarative frame |

`ask` and `answer` are **shared fields rendered in two panels** — editing in one
updates the other. That is not a UI quirk, it is the model: `ask` feeds both open
and mcq. Make it visually obvious (shared fields styled distinctly) or it reads
as a bug.

**On the MCQ panel's "correct at top":** this is *authoring order*, not play
order. At runtime `renderQuestion` draws 3 of the distractors and shuffles, so
the pupil never sees this arrangement. Label the panel accordingly — otherwise
the first bug report is "the answer is always A".

Above the panels, per question: `forms` (three checkboxes, each disabled with a
reason when its data is missing — this teaches the contract better than any doc),
`factKey`, `strand`, `objectiveCodes` (picked from the pack's declared
objectives, not free text), `difficulty`, and `equation` when non-null.

Per question: delete. Per pack: add question (seeded with the CONTENT-RULES
skeleton), and **Write** — one explicit button, no autosave. Autosave plus a
formatting pass means the file changes under you while you think.

### The formatting pass

Runs automatically, on edit, showing what it would change before you accept it —
**not a silent rewrite.** Scope matters more than the rules here:

- **`ask`**: leading capital; ends with `?`.
- **`claim`**: leading capital; ends with `.`; contains exactly one `{}`.
- **Both**: collapse double spaces; strip leading/trailing whitespace.
- **`answer`, `distractors`, `acceptableAnswers`**: **check only, never rewrite.**
  Auto-capitalising an option list would turn `45 cm` into `45 Cm` and `¼` into
  nothing good. What the tool *can* do is flag register mismatch — the CONTENT-RULES
  rule that distractors match the answer's shape — by warning when options
  disagree on leading case or differ wildly in length. That is a hint to a human,
  not a fix.

The distinction is the whole point: **rewrite the two authored sentences, only
warn about the answer set.** The answer set is where meaning lives and where an
automated edit does damage.

### BUILT (2026-07-16) — what actually shipped

| Piece | Where |
|---|---|
| Archive script | `scripts/archive-packs.mjs` → `npm run archive-packs`. **Run: `Docs/packs-archive/2026-07-16/`, 19 packs, committed.** |
| Stable serialisation + blank skeleton | `lib/authoring/serialize.ts` |
| Formatting pass (pure) | `lib/authoring/format.ts` + 16 tests in `format.test.ts` |
| Quarantine shape | `lib/authoring/quarantine.ts` |
| Disk access (server-side) | `lib/authoring/fs.ts` |
| Dev gate | `app/api/dev/guard.ts` |
| Read / write / quarantine API | `app/api/dev/packs/`, `app/api/dev/packs/[packId]/`, `app/api/dev/quarantine/` |
| The tool | `app/dev/authoring/page.tsx`, `components/dev/{QuestionEditor,fields}.tsx` |
| 3b skeleton generator | `scripts/make-skeleton.mjs` → `npm run make-skeleton <packId>` |
| 3b drafter brief | [DRAFTER-INSTRUCTIONS.md](./DRAFTER-INSTRUCTIONS.md) |

Verified by build only, at Neil's instruction — **not driven in a browser.** `npm
run build` compiles, `tsc --noEmit` is clean, 26 tests pass (the slice-dump
snapshot did not move, so the tool changed no game behaviour). Neil reviews the
UI himself.

Decisions taken while building, beyond the spec above:

- **`content-drafts/` is gitignored, `content-quarantine/` is not.** Skeletons
  and in-flight drafts are regenerable intermediates; a quarantined question
  exists nowhere else once pulled from its pack.
- **Quarantine is one API call, not two.** Pulling from the pack and appending to
  the quarantine file must not be something the UI can half-complete. It appends
  to quarantine *first*: if the pack rewrite then fails, the question exists
  twice and review catches it — the other order loses it.
- **Pack ids are regex-checked before touching the filesystem** (`fs.ts`), so a
  packId of `../../etc/passwd` cannot become a path. Dev-only or not, a
  path-traversal write is not worth leaving around.
- **The routes still exist in a production build** (they appear in the route
  table) but `isDev` makes them 404 at runtime. Fine for now; if the app is ever
  actually deployed, exclude them at build time rather than trusting the guard.
- The tool reads through the API, not `lib/curriculum/index.ts` — that loader
  caches parsed packs for the process lifetime and would serve stale content
  straight back after a write.

### Done when

Neil can open the tool, expand `geography-y3-uk`, edit a question's three panels,
hit Write, and see a clean stable-ordered diff in `git diff` — and a
deliberately broken edit (`claim` with two slots) is refused with a readable
error rather than written. **Pending Neil's pass.**

---

## Step 3b — the content pass

The shape of the work, per Neil: **the drafting is a large, dull, well-specified
job and should go to a cheaper model with very clear instructions.** Content
judgement stays with the human review pass afterwards. The tool from 3b-0 is what
makes that division possible.

### The per-pack loop

For each pack, in the order below:

1. **Skeleton.** `npm run make-skeleton <packId>` emits a target file into
   `content-drafts/`: every existing question's `id`,
   `strand`, `objectiveCodes`, `difficulty` and `equation` carried over, and the
   authored fields (`ask`, `claim`, `answer`, `distractors`, `factKey`) blanked
   to the CONTENT-RULES skeleton. The existing v2 pack is the **source** the
   drafter reads; the skeleton is what it fills. Carrying the structural fields
   means the drafter cannot invent a strand or drop an objective — it only writes
   prose.
2. **Draft.** A cheap model fills the skeleton, one pack per run, given: the
   source pack, the skeleton, CONTENT-RULES.md, and the pack's objectives. Its
   instructions must be mechanical — see below.
3. **Validate.** `npm run validate-packs`. Zod is the gate; a draft that fails
   never reaches review. Send failures back to the drafter with the error text.
4. **Review.** Neil, in the tool, question by question. This is the only step
   that judges content, and it is not skippable — the validator cannot check
   plausibility, whether `ask` stands alone, or whether a distractor is secretly
   correct.
5. **Commit** the pack, one commit per pack, so a bad pass is one revert.

### What the drafter is told

**Written and ready: [DRAFTER-INSTRUCTIONS.md](./DRAFTER-INSTRUCTIONS.md).** Hand
it to the drafting model verbatim, one pack per run. It is written to be followed
mechanically by a cheaper model — steps and worked examples, not principles — and
its spine is *"you are rewriting form, not content; do not invent facts; if you
are unsure, flag it rather than guess"*. It ends with a self-check list and a
required report (form-resistant questions, proposed factKey merges, suspected
errors in the source, low-confidence calls).

The summary of what it demands, per question:

- an `ask` that stands alone with no options on screen — CONTENT-RULES' read-aloud
  test, stated as a rule;
- a `claim` with exactly one `{}` where the answer goes, so filling the slot with
  `answer` reads TRUE and filling it with any distractor reads FALSE;
- a short canonical `answer` that works both as an option and inside the frame,
  with prose moved to `answerDetail`;
- **five distractors**, each independently wrong, each grammatical inside the
  claim frame, matching the answer's register and length;
- `forms` reflecting only what it actually wrote.

And is told what not to do: **never "all of the above" / "none of these"** (the
rule that killed `ma-5` in forces-magnets); **never author equation distractors**
(the game hides a different part each deal, so near-misses are generated at build
time); no emojis; don't touch ids, strands or objective codes.

Three structural jobs alongside the drafting:

- **`claimIsTrue` → null.** 118 questions carry a slotless claim lifted from a v1
  true/false. Each needs its claim rewritten into a slotted frame. When the count
  hits zero the field is deleted from the schema — that is the trigger.
- **`factKey`.** Group ids that test the same fact. The canonical case is
  `science-y3-forces-magnets`, which has four items on "like poles repel"
  including a true/false and its own negation. **Flag merges, don't perform them
  in the draft** — CONTENT-RULES is explicit that a wrong grouping silently stops
  a game dealing two fair questions, and that is a human call. The drafter
  proposes; Neil confirms in the tool.
- **Quarantine the form-resistant.** See below.

### Form-resistant questions leave the corpus

Some facts genuinely resist a form: "Name the four countries of the UK" and "Why
is friction useful when walking?" cannot become MCQ or true/false without becoming
a different question. CONTENT-RULES calls this correct pedagogy, not a gap — and
it is, but a permanently-open-only question is also a permanent exception in a
corpus whose whole value is uniformity.

Decision (Neil, 2026-07-16): **these are flagged, pulled out of the pack, and
parked in a quarantine file for later review.** They are not deleted and not
shipped. The likely future home is a fourth form — a *"pick all that are
correct"* multi-select, which "Name the four countries of the UK" fits exactly.
That extension comes later; quarantine is what keeps the questions alive until it
arrives.

- File: **`content-quarantine/form-resistant.json`** (at `packages/app/`, *not* in
  `lib/curriculum/packs/`). It cannot live beside the packs: `validate-packs.mjs`
  globs that directory and Zod-parses everything in it as a pack, so a quarantine
  file there would fail the build on sight.
- Each entry keeps the full question **plus provenance** — `subject`, `year`,
  `topicId`, source `packId`, original `id` — so it can be put back where it came
  from. A quarantined question with no route home is a deleted question with extra
  steps.
- Each entry carries a `reason`: which forms it resists, and why. That is the
  design input for the multi-select form, and it is worth more than the question
  itself — it is what tells you what the fourth form has to handle.
- The drafter **proposes** quarantine; Neil confirms in review, same as factKey
  merges. "I couldn't write five distractors" and "no five distractors exist" look
  identical from the drafter's side, and only one of them is a real exception.

**Watch pack size.** Pulling questions shrinks packs, and the game minimums are
real: Three in a Row and Summit Climb each need **16** text-only questions
(`slice-requirements.ts:111,118`). Packs currently run 20–28, so a pack near the
bottom of that range that quarantines a few can silently lose two games — exactly
the failure `maths-y3-multiplication-division` already has. If review quarantines
enough to threaten the floor, **author replacements in the tool.** That is one of
the three jobs it exists for.

### Pack order

`geography-y3-uk` first — 20 questions, four clean strands, obvious merges, and
the pack the plan already worked its example from (`ca-wales`). It is the pilot:
**do not draft pack two until pack one is reviewed and committed.** The first
review will change the instructions, and finding that out after 19 packs is the
expensive way.

Then the science Y3 packs (similar shape, factual, five of them), then history and
geography, then English, then maths last — maths carries the 42 equations and the
two known Y2 defects below.

### Two known defects to fix in passing

- `maths-y3-multiplication-division` **powers 5 of 7 games**, not 7: 15 strategy
  items (needs 16) and 2 difficulty-1 items (Summit needs 8 easy after backfill).
  ~2 easy questions fixes both. It is the only pack with this gap.
- The two Y2 packs (`maths-y2-addition-subtraction`,
  `science-y2-animals-including-humans`) **tag zero `objectiveCodes`**, so their
  declared objectives are unreachable. And `maths-y2-addition-subtraction` mixes a
  Unicode minus (`−`, U+2212) into statement text against the ASCII `-` operator
  enum.

### Done when

`npm run validate-packs` reports zero on all four warnings. That is the entire
exit criterion, and it is why the warnings were built that way.

---

## Step 4 — points by form

Collapsed, per Neil: **rank by form, ignore intrinsic difficulty.** The three
forms are the difficulty ladder.

- `lib/questions/scoring.ts`: `FORM_POINTS = { open: 300, mcq: 200, truefalse: 100 }`,
  `pointsFor(form)`. Replaces `POINTS_BY_DIFFICULTY` (`slices.ts:35`), used at
  `slices.ts:62`.
- The plan's `FORM_SCAFFOLD` multiplier and `challenge()` are **dropped** — they
  only existed to combine the two axes, and there is now one axis.
- **`difficulty` stays in the schema and stays authored.** Summit Climb pools by
  it (`minPerDifficulty: {1: 8, 3: 8}`, `slice-requirements.ts:118`) and the board
  and ladder sort by it (`slices.ts:117,159,190-194`). Dropping it from *points*
  is not dropping it from the *corpus*; the two-axis idea can be revived later
  without re-authoring anything.
- Games declare an ordered **form preference ladder** and take the first form a
  question offers: Summit "steady" → truefalse-first, "risky" → open-first; board
  rows 1-2 → easiest form available, rows 3-4 → hardest; T/F Showdown requires
  `truefalse` with no fallback. **This only becomes meaningful after 3b** — a
  single-form question has nothing to prefer.

Only Question Rush and Board Quiz consume points; Flash Round and T/F Showdown
keep flat +1 for their speed feel.

---

## Step 5 — verify and tighten

The final pass, entirely downstream of 3b.

- **`factReuse` on `SliceRequirement`**, default `'distinct'` — a slice refuses to
  deal two questions sharing a `factKey`. Only `three_in_a_row` sets `'forms'`,
  filling 16 cells from fewer facts by showing some twice in different forms.
  Stated trade-off: a team that saw "The capital of Wales is Cardiff — TRUE" and
  then draws "What is the capital of Wales?" gets a free cell. **Exit: flip to
  `'distinct'` when packs reach ~50 questions.** Summit stays `'distinct'`
  regardless — a free rung is worse than a free cell.
- **Tighten the schema** now the escape hatches are unused: require
  **`forms.length === 3`**, require `distractors.min(5)`, require the `{}` slot,
  **delete `claimIsTrue`**. Promote all four validator warnings to errors.
  - This is a blanket rule with **no opt-out**, and quarantine is what earns that.
    The plan previously had to leave `forms.length === 3` as a permanent warning
    because form-resistant questions were staying in the packs. Now they leave, so
    every question in every pack offers three forms, full stop — and the exceptions
    are in `content-quarantine/form-resistant.json` waiting on the multi-select
    form rather than eroding the rule from inside the corpus. No `formsRationale`
    field, no per-question exemption to review.
- **Delete the v1 remnants**: `scripts/migrate-packs-v2.mjs`,
  `curriculumPackV1Schema`, `curriculumItemSchema` and friends. They exist only so
  3a is reproducible.
- **Resolve `textOnly`** — the deviation forced in 3a because a lifted qa and a
  lifted equation both declare `open`, so `forms` alone could not reproduce the
  v1 BOARD/STRATEGY filter. After 3b, check whether `equation === null` is now
  sufficient on its own.
- **Free win, cheap after 3b**: equations can derive mcq and truefalse once
  build-time distractors exist ("24 + 16 = 41" → FALSE). This makes T/F Showdown
  work on maths facts, currently impossible.
- **Verification**: the vitest slice snapshot (`lib/games/slices-dump.test.ts`)
  moves in reviewable ways only; play an enriched pack in Summit Climb — steady
  vs risky should now feel genuinely different, which is the whole payoff.

---

## Step 6 — objective mapping

Split out of step 5 because it is a different kind of work: 3b–5 are about the
*shape* of questions, this is about whether the corpus actually covers the
curriculum it claims to.

**Why it is worth doing properly.** `objectiveCodes` ties every question to
statutory NC wording held verbatim in the pack. Get it right and the library can
answer questions no amount of good content answers on its own: which objectives
has this topic left uncovered; which objectives has this class been assessed on;
give me a game that targets *this* objective. That is the objectives-first
premise (MASTER-PLAN) becoming a queryable property rather than a filing
convention. It is also the natural anchor for reporting later.

**Where it stands — better than expected.** 365 of 417 questions already tag at
least one objective. The only untagged packs are the two Y2 ones:

| Pack | Untagged | Objectives declared |
|---|---|---|
| `maths-y2-addition-subtraction` | 28/28 | 5 |
| `science-y2-animals-including-humans` | 24/24 | 3 |

So step 6 is **a verification pass over 365 tags plus a backfill of 52**, not a
mapping from scratch. The 52 are already logged as a known gap; their declared
objectives are currently unreachable.

**Why it is last, and honestly.** Neil's words: *"it's very difficult for me to
confirm this."* Judging whether a question genuinely assesses a statutory
objective is a different and harder call than judging whether a distractor is
wrong — it wants someone who teaches the year group. So the sequencing is
deliberate: leave the tags in, get the question shapes right first, and treat
mapping as its own reviewed pass rather than smuggling it into 3b's review where
it would be waved through.

**Scope**: backfill the 52; spot-check the 365 (the tool already picks codes from
the pack's declared objectives, so they are structurally valid — what's unverified
is whether they're *apt*); then per pack, list objectives with zero questions —
that is the content-gap report, and it may be the most useful artefact in the
whole plan. Only then consider a `min(1)` on `objectiveCodes`.

## Open items

- `FORM_POINTS` (300/200/100) is a guess pending a classroom trial. One file.
- **Risk It and variable forms**: teams wager knowing only the strand; if form
  varies they bet on unknown difficulty twice over. Recommend announcing the form
  at the wager stage ("Poles — multiple choice"), which is arguably a better game.
  Otherwise pin Risk It to one form.
- **Distractor plausibility stays unenforceable.** Human review per pack is the
  only control, which is exactly why 3b-0 exists.
- **The fourth form — "pick all that are correct"** (multi-select). Not planned
  yet; it is what `content-quarantine/form-resistant.json` is accumulating
  evidence for. Design it once the quarantine file exists and the `reason` strings
  show what it actually has to handle — the corpus tells you the requirement
  rather than the other way round. Note it breaks the current "≥5 distractors,
  draw 3" mechanic, since a multi-select needs several correct answers, not one.
