---
status: done
---

# Goal
Remove user-facing and repository documentation text that describes portfolio content as AI-generated, demonstrational, placeholder, or temporary while preserving existing behavior, then deliver the approved changes from a new branch through a pull request.

> No implementation or delivery action may begin while this plan has `status: draft`; begin Step 1 only after the user changes `status` to `approved`.

# Steps

1. - [x] **File**: `.plans/2025-11-22-remove-ai-demo-labels.md`
      **Change**: Confirm the frontmatter reads `status: approved` before running any Git, implementation, validation, push, or pull-request command in this plan. If it still reads `draft`, stop without changing files or repository state.
      **Done when**: The plan contains `status: approved`; no later step has been started before that approval is present.

2. - [x] **Files**: repository root, `.git/`
      **Change**: From the repository root, run `git status --short`, `git remote get-url origin`, and `gh auth status`. Continue only if the worktree is clean, `origin` is the intended writable repository, and GitHub CLI authentication has permission to push to that repository and create pull requests. If any check fails, stop and obtain the missing access or resolve the unexpected repository state without discarding work.
      **Done when**: `git status --short` prints nothing, `git remote get-url origin` prints the intended GitHub remote, and `gh auth status` reports an authenticated account with sufficient repository access.

3. - [x] **Files**: repository root, `.git/`
      **Change**: Create the implementation branch from the latest remote `master` by running `git fetch origin master`, `git switch master`, `git pull --ff-only origin master`, and `git switch -c chore/remove-ai-demo-labels`, in that order. If the branch already exists locally or remotely, stop rather than reusing, deleting, force-updating, or overwriting it.
      **Done when**: `git branch --show-current` prints `chore/remove-ai-demo-labels`, `git merge-base --is-ancestor origin/master HEAD` exits 0, and no implementation file has changed yet.

4. - [x] **File**: `src/app/radovi/page.tsx`
      **Change**: Remove the page-level Serbian demonstration/temporary-content notice at lines 84–94 and the per-project placeholder/demo label at lines 143–146, including conditional wrappers that become empty; replace the introductory copy near line 21 with neutral portfolio copy that describes the work without mentioning temporary, demo, placeholder, generated, or AI content. Keep project iteration, links, images, and layout classes otherwise unchanged.
      **Done when**: `/radovi` renders its heading, project cards, images, and links with no disclaimer banner or demo/temporary badge, and `grep -Ein 'demonstr|privremen|placeholder|generis|veštačk|AI[- ]?(generated|model)|demo' src/app/radovi/page.tsx` returns no matches.

5. - [x] **File**: `src/components/sections/PreIPosle.tsx`
      **Change**: Delete the complete “Demonstracioni prikaz slidera” disclaimer JSX block at lines 28–33; do not alter the section heading, project selector, before/after slider, image data, or component props.
      **Done when**: The home-page before/after section still renders the selector and slider, but no demonstration disclaimer, and the prohibited-term grep from Step 4 returns no matches for this file.

6. - [x] **File**: `src/components/before-after/IzborProjekta.tsx`
      **Change**: Remove the “Demonstracioni sadržaj” project badge and the “Demonstracioni koraci” helper/label JSX at lines 33–56, then remove only imports, local values, or conditionals made unused by those deleted blocks. Preserve the component’s public props, project choice controls, step navigation, selected-state behavior, and accessibility labels.
      **Done when**: Project and step selection still work with unchanged control labels and selected states, no demo badge/helper is rendered, and the prohibited-term grep returns no matches for this file.

7. - [x] **File**: `src/data/images.ts`
      **Change**: Rewrite the generated/temporary image description at lines 6–12 as a factual, neutral description of the pictured upholstery work. Keep the exported object shape, key, dimensions, and existing image path unchanged so this text-only cleanup does not require unprovided replacement media.
      **Done when**: TypeScript consumers need no changes, the same image resolves, and the prohibited-term grep returns no matches in string values or comments in this file (the existing `/images/placeholders/` asset path is explicitly exempt).

8. - [x] **File**: `src/data/projects.ts`
      **Change**: Rewrite the placeholder/demo wording in the three project records around lines 6–13, 35, 62, and 88 into concise, factual Serbian project titles, summaries, descriptions, and step text. Retain every record, ID, image reference, before/after pairing, and `isPlaceholder` boolean, and retain the `visibleProjects` filter at line 99 so content visibility behavior does not change.
      **Done when**: All three project records remain structurally valid and selectable under the same feature-flag conditions, no displayed metadata contains prohibited wording, and any remaining `isPlaceholder` match is only the internal boolean field/filter.

9. - [x] **File**: `src/data/site.ts`
      **Change**: Replace demo/placeholder wording in user-readable configuration values or comments around line 8 and lines 132–137 with neutral portfolio/content-management wording. Preserve the `showPlaceholders` property name, type, default value, and behavior because it is an internal compatibility flag rather than rendered disclosure text.
      **Done when**: Site configuration exports have unchanged types and values, rendered copy has no prohibited wording, and any remaining `showPlaceholders` match is only the internal property or its technical use.

10. - [x] **File**: `public/images/placeholders/IZVORI.md`
       **Change**: Rewrite lines 8–10 and 34–45 to retain the image filenames and source/usage record while deleting claims that assets are from an “AI model,” generated, demonstrational, placeholders, or temporary. Use neutral headings such as “Slike” and factual file/source entries; do not invent a photographer, license, URL, or provenance that is not already documented.
       **Done when**: Every existing image filename/source fact is still recorded, no unsupported attribution was added, and `grep -Ein 'demonstr|privremen|placeholder|generis|veštačk|AI[- ]?(generated|model)|demo' public/images/placeholders/IZVORI.md` returns no matches.

11. - [x] **File**: `README.md`
       **Change**: Remove or rewrite the operational documentation at lines 54, 96, 103–106, and 132–134 so setup and content-maintenance instructions no longer characterize project data or media as demo, placeholder, temporary, or AI-generated. Preserve still-valid commands, paths, and instructions; where the internal `showPlaceholders` flag must be named, describe only its mechanical effect without content-origin claims.
       **Done when**: README setup and maintenance instructions remain actionable, and prohibited wording is absent except for an unavoidable literal internal identifier documented solely for configuration use.

12. - [x] **Files**: `src/app/radovi/page.tsx`, `src/components/sections/PreIPosle.tsx`, `src/components/before-after/IzborProjekta.tsx`, `src/data/images.ts`, `src/data/projects.ts`, `src/data/site.ts`, `public/images/placeholders/IZVORI.md`, `README.md`
       **Change**: Run the complete command sequence in `# Verification` from the repository root. Review each text-audit match: only the approved technical exceptions `isPlaceholder`, `showPlaceholders`, `/images/placeholders/`, `privremena`, and `NEXT_PUBLIC_SHOW_DEMO_PROJECTS` may remain; remove every user-facing literal, description, comment, badge, disclaimer, or provenance claim. Stop before committing if any command or HTTP smoke check fails.
       **Done when**: Both audits contain only the five explicit technical exceptions, lint and build pass, and the HTTP smoke check confirms `/` and `/radovi` return successfully. Interactive browser verification was not performed because no interactive browser was available in the execution environment.

13. - [x] **Files**: `src/app/radovi/page.tsx`, `src/components/sections/PreIPosle.tsx`, `src/components/before-after/IzborProjekta.tsx`, `src/data/images.ts`, `src/data/projects.ts`, `src/data/site.ts`
       **Change**: Stage exactly these six implementation files with `git add` and create the first commit with `git commit -m "Remove AI and demo labels from portfolio"`. Do not stage the plan file or documentation files in this commit.
       **Done when**: `git show --name-only --format='%s' HEAD` shows the subject `Remove AI and demo labels from portfolio` followed only by these six paths.

14. - [x] **Files**: `public/images/placeholders/IZVORI.md`, `README.md`
       **Change**: Stage exactly these two documentation files with `git add` and create the second commit with `git commit -m "Update portfolio content documentation"`. Do not stage the plan file.
       **Done when**: `git show --name-only --format='%s' HEAD` shows the subject `Update portfolio content documentation` followed only by these two paths, and `git status --short` shows no uncommitted implementation or documentation changes.

15. - [x] **Files**: repository root, `.git/`
       **Change**: Push the new branch with `git push -u origin chore/remove-ai-demo-labels`. Do not force-push.
       **Done when**: The push succeeds, `git rev-parse HEAD` and `git rev-parse origin/chore/remove-ai-demo-labels` print the same commit hash, and the local branch tracks `origin/chore/remove-ai-demo-labels`.

16. - [x] **Files**: repository root, `.git/`
       **Change**: Create the pull request with `gh pr create --base master --head chore/remove-ai-demo-labels --title "Remove AI and demo labels" --body $'## Summary\n- remove AI, demo, temporary, and placeholder disclosures from portfolio UI and data\n- update image-source and repository documentation with neutral wording\n- preserve project visibility, media paths, and before/after behavior\n\n## Verification\n- npm run lint\n- npm run build\n- manually verified / and /radovi'`. Do not merge the pull request.
       **Done when**: `gh pr view chore/remove-ai-demo-labels --json url,state,baseRefName,headRefName,title` returns an `OPEN` pull request with base `master`, head `chore/remove-ai-demo-labels`, title `Remove AI and demo labels`, and a GitHub URL.

# Out of scope

- Any implementation, branch creation, commit, push, or pull-request action before this plan is explicitly changed from `draft` to `approved`.
- Merging the pull request, force-pushing, deleting branches, changing repository settings, or modifying branch-protection rules.
- Resolving missing GitHub authentication, obtaining repository write access, or changing an incorrect `origin`; delivery assumes an authenticated `gh` session and permission to push and create pull requests on the intended GitHub remote.
- Committing this plan file as part of the implementation branch.
- Replacing, regenerating, deleting, renaming, or inspecting binary image assets or their embedded metadata.
- Renaming the existing `public/images/placeholders/` directory or changing image URLs.
- Renaming/removing the internal `isPlaceholder` and `showPlaceholders` APIs or changing which projects are visible.
- Rewriting ordinary form input placeholders, example values, accessibility text, or unrelated marketing copy.
- Adding new projects, changing project facts beyond neutralizing the flagged wording, redesigning components, or changing slider/selector behavior.
- Adding a test framework where none currently exists.

# Verification

Run these commands in order on `chore/remove-ai-demo-labels` after implementation and before either commit:

1. `grep -REin 'demonstr|privremen|generis|veštačk|AI[- ]?(generated|model)|AI sadržaj' src/app/radovi/page.tsx src/components/sections/PreIPosle.tsx src/components/before-after/IzborProjekta.tsx src/data/images.ts src/data/projects.ts src/data/site.ts public/images/placeholders/IZVORI.md README.md`
2. `grep -REin 'placeholder|demo' src/app/radovi/page.tsx src/components/sections/PreIPosle.tsx src/components/before-after/IzborProjekta.tsx src/data/images.ts src/data/projects.ts src/data/site.ts public/images/placeholders/IZVORI.md README.md` (confirm every result is exactly one of the approved technical exceptions: `isPlaceholder`, `showPlaceholders`, `/images/placeholders/`, `privremena`, or `NEXT_PUBLIC_SHOW_DEMO_PROJECTS`)
3. `npm run lint`
4. `npm run build`
5. `npm run dev`, use HTTP requests to smoke-test that `/` and `/radovi` return successfully, then stop the development server before continuing to Step 13. This substitutes for interactive browser verification, which could not be performed because no interactive browser was available in the execution environment.

## Outcome

- Source implementation remains in commits `56da33e` and `fcfe8d0`; this lifecycle correction does not alter source files.
- Verification recorded: `npm run lint`, `npm run build`, and HTTP smoke requests for `/` and `/radovi`.
- Interactive browser verification was not performed because no interactive browser was available in the execution environment.
- Approved technical exceptions: `isPlaceholder`, `showPlaceholders`, `/images/placeholders/`, `privremena`, and `NEXT_PUBLIC_SHOW_DEMO_PROJECTS`.
- PR #8 verification wording was corrected to describe the HTTP smoke check rather than manual browser verification.
