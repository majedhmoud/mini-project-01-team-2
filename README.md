# Mini Project 01 — Team 2

B4F internship team project: an original browser-based mystery experience.

**Status:** initial repository scaffold; the mystery game and Express API are not implemented yet. The client is initialized with an empty React app. Project name, story, API contract and task allocation are awaiting team agreement.

**Submission:** 3 October 2026, 23:59 (Asia/Damascus).

## Team

| Member | Branch | Preference |
| --- | --- | --- |
| Majed — leader | `member-majed` | Integration and leadership; implementation task to agree |
| Yazan | `member-yazan` | Frontend |
| Badr | `member-badr` | Frontend |
| Eyad | `member-eyad` | Backend |
| Maya | `member-maya` | Backend |
| Alaa | `member-alaa` | Flexible |

## Shared documents

- [Original project specification](docs/instructions/PROJECT-SPEC-EN.pdf)
- [Instructor team allocation](docs/instructions/Weekly_Mini_Project_01_Teams.pdf)
- [Project requirements](docs/team/requirements.md)

## Workflow

### Start and synchronize

Clone the repository, then switch to your branch (example for Yazan):

```sh
git clone https://github.com/majedhmoud/mini-project-01-team-2.git
cd mini-project-01-team-2
git switch member-yazan
```

Before starting a task or after Majed merges shared changes, first commit your current work or stash it. With a clean working tree:

```sh
git fetch origin
git merge origin/main
```

Resolve conflicts with the affected owner, run relevant checks, then commit the resolution and push your named branch. This merges main into your branch; merely pulling your own branch does not bring in main's updates. Never overwrite another member's work or force-push shared history.

### Submit a small task

```sh
git status
git add path/to/changed-file
git commit -m "Describe the implemented behavior"
git push origin member-yazan
```

Open a pull request from your branch to main. Explain what changed, link the task and record how you verified it. Request Majed's review; the paired reviewer may help first.

Majed checks acceptance criteria, reads the changes and verifies integration, then merges accepted PRs using a **merge commit** so the long-lived member branch and original contribution history remain straightforward. Members synchronize main afterward. Keep member branches after merging.

### Definition of done for a task

- Agreed behavior and failure cases work; no unrelated edits.
- Relevant build/lint and endpoint/UI checks pass.
- Original author commits are visible and the member can explain the change.
- PR reviewed and merged; any setup/contract documentation updated.
- Final project acceptance still follows the complete specification.
