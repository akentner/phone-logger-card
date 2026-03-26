# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A custom Home Assistant Lovelace card (HACS-compatible) that displays phone call logs from the **phone-logger** add-on. Built with Lit and TypeScript, bundled into a single IIFE via Rollup.

## Build & Development

```bash
npm run build          # Build dist/phone-logger-card.js
npm run watch          # Rebuild on file changes
npm run format         # Prettier formatting
npm run deploy         # Build + scp to Home Assistant host
```

No test framework is configured. No linter beyond Prettier.

## Architecture

Single custom element `<phone-logger-card>` registered in the browser. The entire card is one LitElement class in `src/phone-logger-card.ts`.

- **`src/phone-logger-card.ts`** — Main card: fetches call data from the phone-logger add-on's REST API via HA ingress, renders grouped call list + detail modal. Polls every 60s with a circuit breaker (3 failures → 5 min cooldown).
- **`src/types.ts`** — TypeScript interfaces for card config, API responses (`CallItem`, `CallsResponse`, `AddonInfo`).
- **`src/i18n.ts`** — Hardcoded i18n (German/English), auto-detected from `navigator.language`.
- **`src/mdi.ts`** — Inline MDI SVG icon paths (no external icon dependency).

The card communicates with the phone-logger add-on through HA's ingress proxy. Ingress URL is resolved either from a configured `ingress_token` or by calling the Supervisor API with the add-on slug.

## Card Configuration Options

Defined in `PhoneLoggerCardConfig`: `ingress_token`, `addon_slug`, `msn` (string or array), `limit`, `title`.

## Key Conventions

- Output is a single bundled file at `dist/phone-logger-card.js` (IIFE, minified, no sourcemap).
- Version is tracked in `CARD_VERSION` constant in `phone-logger-card.ts` and in `package.json` — keep them in sync.
- Commit messages and documentation always in English.
