# Automatic Git Commit and Push Rule

## Target Repository
- **Repository**: https://github.com/umang1506/Onmysite_2026_project.git
- **Branch**: main

## Directive
Whenever you modify, add, or delete any code or project files in this workspace, or upon completing any requested task, you MUST automatically stage, commit, and push all changes to the remote GitHub repository (`https://github.com/umang1506/Onmysite_2026_project.git`).

## Required Workflow
1. Check repository status using `git status`.
2. Stage all changed and new files:
   ```bash
   git add .
   ```
3. Create a commit with a descriptive summary of the work done:
   ```bash
   git commit -m "feat/fix: concise description of changes made by Antigravity"
   ```
4. Push the commit to GitHub:
   ```bash
   git push origin main
   ```
