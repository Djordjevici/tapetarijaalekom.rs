## Plan storage

All plans live in `.plans/` at the repo root. Never write a plan anywhere else.

Naming: `.plans/YYYY-MM-DD-<slug>.md` — slug is 2-4 words, kebab-case.
Completed plans move to `.plans/archive/` with a `## Outcome` section appended.

Before planning anything, `ls .plans/` and read any plan whose slug overlaps
the current task. Amend an existing plan instead of writing a near-duplicate.

Every plan file starts with this frontmatter:

    ---
    status: draft | approved | in-progress | done | abandoned
    created: YYYY-MM-DD
    goal: one sentence
    ---

The builder MUST NOT begin work on a plan whose status is not `approved`.
I set that field, not you.

## Delegation protocol

1. scout    — recon. Read-only. Never plans.
2. planner  — writes `.plans/<date>-<slug>.md`. Reports only the path + 5 lines.
3. STOP. I read and approve the plan by setting status: approved.
4. builder  — reads the plan path, executes literally, updates step checkboxes.
5. reviewer — reads the same plan path + `git diff`, judges conformance.
6. On request-changes: re-invoke builder with the defect list and the plan path.
   Never re-run scout or planner.

Never do steps 1, 2, 4 or 5 in this session yourself. Route.

## Context discipline

Before reading any file, you must have a reason from one of:
  - a symbol/index search result naming it
  - a `.plans/` step naming it explicitly
  - a stack trace or test failure naming it

Never read a file top-to-bottom "for context". Never run repo-wide grep to
"get oriented" — use the index. If the index is unavailable, say so and stop;
do not fall back to reading the tree.

## Memory

Facts about this project live in project memory — search it before asking me
or re-deriving. Procedures live as skills; load them by name when needed.
Never restate memory contents back to me unless I ask.

Plans are memory. Before planning, `ls .plans/` and read any plan whose slug
overlaps this task. Amend rather than duplicate.
