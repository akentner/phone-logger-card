# Phone Logger Card

A custom [Home Assistant](https://www.home-assistant.io/) Lovelace card that displays phone call logs from the [Phone Logger](https://github.com/akentner/ha-custom-component-phone-logger) custom component.

![HACS Badge](https://img.shields.io/badge/HACS-Custom-orange.svg)

## Features

- Displays inbound, outbound, missed, and voicemail calls
- Calls grouped by day with relative labels (Today, Yesterday, ...)
- Click on a call to see full details (caller, device, duration, trunk, MSN, ...)
- Cursor-based pagination ("Load more")
- Automatic polling every 60 seconds
- Circuit breaker to prevent error spam on repeated failures
- i18n support (German and English), based on your Home Assistant language setting
- Works locally and remotely (Nabu Casa / Companion App)

## Prerequisites

This card requires the [Phone Logger custom component](https://github.com/akentner/ha-custom-component-phone-logger) to be installed and configured in Home Assistant. The card communicates via Home Assistant's WebSocket API — no ingress or HTTP fetching needed.

## Installation

### HACS (recommended)

1. Open HACS in your Home Assistant instance
2. Go to **Frontend** > **Custom repositories**
3. Add `https://github.com/akentner/phone-logger-card` as a **Lovelace** repository
4. Install **Phone Logger Card**
5. Restart Home Assistant

### Manual

1. Download `phone-logger-card.js` from the [latest release](https://github.com/akentner/phone-logger-card/releases)
2. Copy it to `config/www/phone-logger-card/phone-logger-card.js`
3. Add the resource in **Settings > Dashboards > Resources**:
   ```
   /local/phone-logger-card/phone-logger-card.js
   ```

## Configuration

Add the card to your dashboard via the UI or YAML:

```yaml
type: custom:phone-logger-card
```

### Options

| Option  | Type               | Default                       | Description                      |
| ------- | ------------------ | ----------------------------- | -------------------------------- |
| `title` | string             | `"Anrufliste"` / `"Call Log"` | Card title. Set to `""` to hide. |
| `msn`   | string \| string[] | —                             | Filter calls by MSN number(s)    |
| `limit` | number             | `20`                          | Number of calls per page         |

### Examples

**Minimal:**

```yaml
type: custom:phone-logger-card
```

**Custom title with MSN filter:**

```yaml
type: custom:phone-logger-card
title: Office Calls
msn:
  - "+49301234567"
  - "+49301234568"
limit: 50
```

**Hidden title:**

```yaml
type: custom:phone-logger-card
title: ""
```

## Development

```bash
npm install
npm run build          # Build dist/phone-logger-card.js
npm run watch          # Rebuild on file changes
npm run format         # Format code with Prettier
npm run deploy         # Build + deploy to Home Assistant via scp
```

## License

MIT
