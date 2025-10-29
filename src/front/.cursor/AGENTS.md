# /front Directory Guidelines

This directory is a fresh, modern React codebase built from scratch to replace older and unstructured parts of the project.
Do not reuse or reference patterns, utilities, or conventions from any other directory in this repo (especially legacy ones).

## Goals

- Build a clean, scalable, and maintainable frontend.
- Follow React best practices with functional components and hooks.
- Follow SCSS best practices for styling and structure.
- Keep each component isolated, reusable, and consistent.

## React Best Practices

- Use functional components and React Hooks only.
- Follow component-first architecture — small, composable pieces.
- Keep each component file clean:
- One main component per file.
- Keep logic separated in hooks when possible.
- Prefer composition over prop drilling.
- Use Context only for global states that are truly shared.

## Rules

- Do not Copy or import anything from other directories outside /front.
- Do no Reuse legacy code or structure from previous components.
- Do not Apply old design, naming, or folder conventions.
- Do not Add untyped or untested utilities unless intentionally temporary.
- Do not Add new utilities wihtout first checking if the same already exists
