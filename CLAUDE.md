# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A custom Home Assistant Lovelace card (HACS-compatible) that displays phone call logs from the **phone_logger** custom component. Built with Lit and TypeScript, bundled into a single IIFE via Rollup.

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

- **`src/phone-logger-card.ts`** — Main card: fetches call data via `hass.callWS({type: 'phone_logger/calls'})`, renders grouped call list + detail modal. Polls every 60s with a circuit breaker (3 failures → 5 min cooldown).
- **`src/types.ts`** — TypeScript interfaces for card config, API responses (`CallItem`, `CallsResponse`).
- **`src/i18n.ts`** — Hardcoded i18n (German/English), detected from `hass.language`.
- **`src/mdi.ts`** — Inline MDI SVG icon paths (no external icon dependency).

The card communicates with the phone_logger custom component via Home Assistant's WebSocket API. No ingress, no HTTP fetching, no cookies — works on all platforms including mobile and Nabu Casa.

## Card Configuration Options

Defined in `PhoneLoggerCardConfig`: `msn` (string or array), `limit`, `title`.

## Key Conventions

- Output is a single bundled file at `dist/phone-logger-card.js` (IIFE, minified, no sourcemap).
- Version is tracked in `CARD_VERSION` constant in `phone-logger-card.ts` and in `package.json` — keep them in sync.
- Commit messages and documentation always in English.
