# Content Authoring Guide

Read this before writing any content. It is the complete contract.

Working directory for all commands: `app-web/`

---

## 1. Non-negotiables

1. **Never write content into `.ts` or `.tsx` files.** All content lives in `content/subjects/<subject>/`. A guard test fails the build otherwise.
2. **Every question needs an `explanation`** that teaches why the answer is right — not a restatement of the answer. This is enforced by the validator.
3. **Only write inside your assigned subject directory.** Other agents are working in parallel; touching their files causes conflicts.
4. **Do not run any `git` command.** Write files and validate. The lead agent commits.
5. **Run `npm run content:validate` after every few files.** Fix errors immediately — never accumulate them.
6. Content must be **factually correct** and appropriate for the Nigerian secondary curriculum (WAEC/NECO/JAMB) or the stated undergraduate programme.

---

## 2. Build order — breadth first, then depth

This ordering guarantees a navigable app even if you run out of time.

1. **Write `subject.json` first** with the complete topic and subtopic tree. Do this before any lesson. The app becomes browsable the moment it lands.
2. Then, subtopic by subtopic, write the lesson file and the questions file together.
3. Validate after each topic folder is finished.

Never leave a subtopic with questions but no lesson if you can avoid it. A subtopic with a lesson and no questions is worse than one with both.

---

## 3. File layout

```
content/subjects/<subject-dir>/
  subject.json
  topics/
    <topic-slug>/
      <subtopic-slug>.lesson.json
      <subtopic-slug>.questions.json
```

`<subject-dir>`, `<topic-slug>` and `<subtopic-slug>` are lowercase kebab-case and must match the last segment of the corresponding ID.

---

## 4. ID grammar — exact, enforced

| Entity | Pattern | Example |
|--------|---------|---------|
| Subject | `{level}.{subject}` | `sec.biology` |
| Topic | `{subjectId}.{topic}` | `sec.biology.cell-biology` |
| Subtopic | `{topicId}.{subtopic}` | `sec.biology.cell-biology.cell-structure` |
| Objective | `{subtopicId}.o{n}` | `sec.biology.cell-biology.cell-structure.o1` |
| Lesson | `{subtopicId}.lesson` | `sec.biology.cell-biology.cell-structure.lesson` |
| Question | `{subtopicId}.q{nnn}` | `sec.biology.cell-biology.cell-structure.q001` |

`level` is `sec` (secondary) or `ug` (undergraduate). Slugs are lowercase, hyphen-separated, letters and digits only. Question numbers are zero-padded to three digits.

---

## 5. Reference implementation

Copy the structure of these files exactly. They are validated and working:

- `content/subjects/mathematics/subject.json`
- `content/subjects/mathematics/topics/algebra/linear-equations.lesson.json`
- `content/subjects/mathematics/topics/algebra/linear-equations.questions.json`
- `content/subjects/mathematics/topics/algebra/expressions.lesson.json`
- `content/subjects/mathematics/topics/algebra/expressions.questions.json`

The authoritative schema is `lib/content/schema.ts`. When in doubt, read it.

---

## 6. `subject.json`

```jsonc
{
  "id": "sec.biology",
  "level": "secondary",
  "name": "Biology",
  "shortName": "Bio",
  "description": "At least 20 characters describing the subject.",
  "curricula": ["WAEC", "NECO", "JAMB", "NERDC"],
  "classLevels": ["SS1", "SS2", "SS3"],
  "accentColor": "#147a52",
  "icon": "Plant",
  "topics": [
    {
      "id": "sec.biology.cell-biology",
      "name": "Cell Biology",
      "order": 1,
      "summary": "At least 10 characters.",
      "classLevels": ["SS1"],
      "subtopics": [
        {
          "id": "sec.biology.cell-biology.cell-structure",
          "name": "Cell Structure",
          "order": 1,
          "summary": "At least 10 characters.",
          "prerequisites": [],
          "objectives": [
            { "id": "sec.biology.cell-biology.cell-structure.o1", "text": "At least 8 characters" }
          ]
        }
      ]
    }
  ],
  "provenance": {
    "sources": [
      { "id": "waec-biology-syllabus", "title": "WAEC Biology Syllabus", "type": "syllabus" }
    ],
    "reviewStatus": "published",
    "verified": true
  }
}
```

- `accentColor` must be a six-digit hex code. Pick a colour that suits the subject and differs from sibling subjects.
- `icon` must be a valid Phosphor icon name (e.g. `Plant`, `Atom`, `Flask`, `BookOpen`, `Scales`, `ChartLine`, `MathOperations`, `Code`).
- `prerequisites` reference **subtopic IDs that exist** — within this subject or another already-published one. An unresolvable prerequisite fails validation. Leave the array empty when unsure.
- `order` starts at 1 and follows the teaching sequence.

---

## 7. Lesson files

A lesson is an ordered array of blocks. Aim for **8–12 blocks**; the minimum is 4.

```jsonc
{
  "id": "sec.biology.cell-biology.cell-structure.lesson",
  "subtopicId": "sec.biology.cell-biology.cell-structure",
  "title": "Cell Structure",
  "estimatedMinutes": 12,
  "objectiveIds": ["sec.biology.cell-biology.cell-structure.o1"],
  "blocks": [ /* see below */ ],
  "provenance": {
    "sources": [{ "id": "waec-biology-syllabus", "title": "WAEC Biology Syllabus", "type": "syllabus" }],
    "reviewStatus": "published",
    "verified": true
  }
}
```

`objectiveIds` must all exist on that subtopic in `subject.json`.

### Block types

| Type | Required fields | Use for |
|------|-----------------|---------|
| `hook` | `text` (≥20 chars) | A concrete, relatable opening. Use Nigerian context where natural. |
| `text` | `markdown` (≥20 chars) | Main explanation. `##`/`###` headings, `**bold**`, `*italic*`, `` `code` ``, `$maths$` |
| `math` | `latex`, optional `caption` | A displayed formula or equation |
| `image` | `src`, `alt` (≥3 chars), optional `caption` | Only if the file genuinely exists. Prefer omitting. |
| `table` | `headers[]`, `rows[][]`, optional `caption` | Comparisons, classifications, summaries |
| `list` | `style` (`bullet`\|`number`), `items[]` (≥2) | Steps, features, characteristics |
| `callout` | `variant`, `title`, `text` | `definition`, `key-point`, `warning`, `example`, `exam-tip` |
| `worked_example` | `title`, `prompt`, `steps[]` (≥2, each `{text, latex?}`), `answer` | Any step-by-step procedure — calculations, essay planning, experiment analysis |
| `check` | `questionId` | An inline question. The ID **must** exist in that subtopic's questions file. |
| `summary` | `points[]` (≥2) | Closing key points |
| `interactive` | `component`, `props`, `fallbackText` | Optional. Only if a component exists. Always supply `fallbackText`. |

### Recommended lesson shape

`hook` → `text` → `callout` (definition) → `text`/`table`/`list` → `worked_example` → `check` → `text` → `callout` (exam-tip) → `summary`

Include **at least one `check` block** in every lesson, referencing a real question ID from the matching questions file.

### Non-mathematical subjects

`worked_example` is not only for calculations. Use it for essay structure in English, for a labelled process in Biology, for evaluating a source in Government. `math` and `latex` are optional — omit them entirely where they do not apply.

---

## 8. Question files

```jsonc
{
  "subtopicId": "sec.biology.cell-biology.cell-structure",
  "questions": [
    {
      "id": "sec.biology.cell-biology.cell-structure.q001",
      "subtopicId": "sec.biology.cell-biology.cell-structure",
      "objectiveIds": ["sec.biology.cell-biology.cell-structure.o1"],
      "type": "mcq",
      "difficulty": 1,
      "stem": "Which organelle is the site of aerobic respiration?",
      "options": [
        { "id": "a", "text": "Nucleus" },
        { "id": "b", "text": "Mitochondrion" },
        { "id": "c", "text": "Ribosome" },
        { "id": "d", "text": "Golgi apparatus" }
      ],
      "correctOptionId": "b",
      "explanation": "Aerobic respiration releases energy from glucose using oxygen, and this happens in the mitochondrion. Its folded inner membrane, the cristae, provides a large surface area for the enzymes involved.",
      "distractorRationale": {
        "a": "The nucleus stores genetic material; it does not release energy",
        "c": "Ribosomes assemble proteins",
        "d": "The Golgi apparatus modifies and packages proteins"
      },
      "misconceptionTags": ["organelle-function"],
      "examMeta": { "board": "WAEC", "style": "exam-pattern" },
      "provenance": {
        "sources": [{ "id": "waec-biology-syllabus", "title": "WAEC Biology Syllabus", "type": "syllabus" }],
        "reviewStatus": "published",
        "verified": true
      }
    }
  ]
}
```

### Rules

- **`type`**: use `mcq` for most. Also available: `true_false`, `numeric`, `multi_select`, `short_answer`, `theory`.
  - `mcq` needs **≥3 options** and a `correctOptionId` matching one of them
  - `true_false` needs exactly two options (`a` = True, `b` = False)
  - `numeric` needs `correctValue` (a number) and **no options**
  - `theory` needs a `markingGuide` array
- **Option ids** are single lowercase letters `a`–`h`, in order.
- **`difficulty`**: `1` recall/straightforward, `2` application, `3` multi-step or analytical. Aim for roughly 30% / 50% / 20%.
- **`explanation`**: minimum 20 characters, but write 2–3 sentences. Explain the reasoning, not just the answer.
- **`distractorRationale`**: strongly encouraged on `mcq`. Map each wrong option id to the specific error that would produce it.
- **`examMeta.style`**: use `"exam-pattern"` for questions you author. Use `"past-paper"` only for verbatim transcriptions from a real paper you were given.
- **`examMeta.board`**: `WAEC`, `NECO`, `JAMB`, `NERDC` or `internal`. Spread these across the bank realistically.
- **No duplicate stems** within a subtopic.

### Quality bar

Write questions a real WAEC, NECO or JAMB candidate would recognise as authentic in style, phrasing and difficulty. Distractors must be **plausible** — each should correspond to a specific mistake a student actually makes, never filler.

Bad: `"options": ["5", "100", "banana", "none"]`
Good: each option is the result of a real, identifiable error.

### Maths notation

Wrap inline maths in single `$`: `"Solve for $x$: $3x + 5 = 20$"`. Escape backslashes in JSON: `"$\\frac{a}{b}$"`. For non-mathematical subjects, plain text is fine — do not force LaTeX.

---

## 9. Validate

```bash
cd app-web
npm run content:validate      # schema + references; must exit 0
npm run content:report        # coverage table and gap list
```

Common failures and fixes:

| Error | Fix |
|-------|-----|
| `Malformed subject id` | ID must match the grammar in §4 |
| `Prerequisite not found` | The referenced subtopic ID does not exist — fix or use `[]` |
| `Question references unknown objective` | `objectiveIds` must exist on that subtopic in `subject.json` |
| `check block references unknown question` | Write the questions file first, or fix the ID |
| `Duplicate question stem within subtopic` | Rewrite one of them |
| `mcq requires at least 3 options` | Add options |
| `Every question must explain why the answer is correct` | Write a real explanation |

---

## 10. Definition of done

Your subject is done when:

1. `subject.json` has the full topic and subtopic tree with correct IDs and ordering
2. Every subtopic in your tier target has a lesson and a questions file
3. `npm run content:validate` exits 0
4. `npm run content:report` shows your subject at or above its tier minimum
5. Content is factually correct and appropriate for the level

## 11. Report format

Finish with exactly this:

```
Subject: <name> (<id>)
Topics: N
Subtopics: N
Lessons: N
Questions: N
content:validate: PASS/FAIL
Known gaps: <explicit list, or "none" only if genuinely none>
```
