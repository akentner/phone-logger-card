import { css, html, LitElement, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';
import type { AddonInfo, CallItem, CallsResponse, PhoneLoggerCardConfig } from './types.js';
import { statusLabel, t } from './i18n.js';
import { icon } from './mdi';

const CARD_VERSION = '1.2.0-alpha.2';
const DEFAULT_ADDON_SLUG = '72a005f5_phone-logger';
const DEFAULT_LIMIT = 20;

interface StatusStyle {
  icon: string;
  color: string;
}

function getStatusStyle(status: string, direction: string): StatusStyle {
  if (status === 'answered') {
    return direction === 'inbound'
      ? { icon: 'mdi:phone-incoming', color: '#3092dc' }
      : { icon: 'mdi:phone-outgoing', color: '#8bbf68' };
  }
  if (status === 'missed') return { icon: 'mdi:phone-remove', color: '#e45f3b' };
  if (status === 'not_reached') return { icon: 'mdi:phone-remove', color: '#8bbf68' };
  if (status === 'voicemail') return { icon: 'mdi:phone-message', color: '#e45f3b' };
  return { icon: 'mdi:phone-hangup', color: 'var(--secondary-text-color, grey)' };
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '–';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatTimestamp(iso: string | null, lang?: string): string {
  if (!iso) return '–';
  return new Date(iso).toLocaleString(lang, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function relativeDay(date: Date, now: Date, lang?: string): string {
  const todayKey = dayKey(now);
  const key = dayKey(date);
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const itemMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((todayMidnight.getTime() - itemMidnight.getTime()) / 86_400_000);

  if (key === todayKey) return t('today', lang);
  if (diffDays === 1) return t('yesterday', lang);
  if (diffDays === 2) return t('two_days_ago', lang);
  return date.toLocaleDateString(lang, {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

class PhoneLoggerCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: PhoneLoggerCardConfig;
  @state() private _calls: CallItem[] = [];
  @state() private _nextCursor: string | null = null;
  @state() private _loading = false;
  @state() private _loadingMore = false;
  @state() private _error: string | null = null;
  @state() private _selectedCall: CallItem | null = null;
  @state() private _debugLog: string[] = [];

  private get _lang(): string | undefined {
    return this.hass?.language;
  }
  private _ingressUrl: string | null = null;
  private _pollTimer?: ReturnType<typeof setInterval>;
  private _failCount = 0;
  private _circuitOpenUntil = 0;
  private static readonly CIRCUIT_MAX_FAILURES = 3;
  private static readonly CIRCUIT_COOLDOWN_MS = 5 * 60 * 1000;

  static getStubConfig(): PhoneLoggerCardConfig {
    return {};
  }

  setConfig(config: PhoneLoggerCardConfig) {
    this._config = config;
    this._ingressUrl = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._startPolling();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopPolling();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('hass') && this.hass && this._calls.length === 0 && !this._loading) {
      this._fetchCalls();
    }
  }

  private _startPolling() {
    this._stopPolling();
    this._pollTimer = setInterval(() => this._fetchCalls(), 60_000);
  }

  private _stopPolling() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = undefined;
    }
  }

  private _debug(msg: string) {
    const ts = new Date().toLocaleTimeString();
    this._debugLog = [...this._debugLog.slice(-19), `[${ts}] ${msg}`];
  }

  private async _resolveIngressUrl(): Promise<string> {
    if (this._ingressUrl) {
      this._debug(`ingress cached: ${this._ingressUrl}`);
      return this._ingressUrl;
    }

    const slug = this._config?.addon_slug ?? DEFAULT_ADDON_SLUG;
    this._debug(`callWS supervisor/api addons/${slug}/info`);
    const info = (await (this.hass as any).callWS({
      type: 'supervisor/api',
      endpoint: `/addons/${slug}/info`,
      method: 'get',
    })) as AddonInfo;
    const base = info.ingress_url.endsWith('/') ? info.ingress_url : `${info.ingress_url}/`;
    this._debug(`ingress resolved: ${base}`);
    this._ingressUrl = base;
    return base;
  }

  private async _fetchCalls(cursor?: string) {
    if (!this.hass) return;
    if (Date.now() < this._circuitOpenUntil) return;

    const appending = Boolean(cursor);
    if (appending) {
      this._loadingMore = true;
    } else {
      this._loading = true;
      this._error = null;
    }

    try {
      this._debug(`fetchCalls start (cursor=${cursor ?? 'none'}, fail=${this._failCount})`);
      const base = await this._resolveIngressUrl();

      const limit = this._config?.limit ?? DEFAULT_LIMIT;
      const params = new URLSearchParams({ limit: String(limit) });
      if (cursor) params.set('cursor', cursor);

      // MSN filter — API supports multiple msn params
      const msns = this._config?.msn ? (Array.isArray(this._config.msn) ? this._config.msn : [this._config.msn]) : [];
      msns.forEach((m) => params.append('msn', m));

      const url = `${base}api/calls?${params}`;
      this._debug(`fetch ${url}`);
      const res = await fetch(url, { credentials: 'include' });
      this._debug(`fetch response: ${res.status} ${res.statusText}`);
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${res.statusText} — ${body.substring(0, 200)}`);
      }

      const data: CallsResponse = await res.json();
      this._debug(`got ${data.items?.length ?? 0} calls, cursor=${data.next_cursor ?? 'none'}`);
      this._calls = appending ? [...this._calls, ...(data.items ?? [])] : (data.items ?? []);
      this._nextCursor = data.next_cursor ?? null;
      this._failCount = 0;
    } catch (e) {
      this._failCount++;
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === 'object' && e !== null && 'message' in e
            ? String((e as { message: unknown }).message)
            : JSON.stringify(e);
      this._debug(`ERROR #${this._failCount}: ${msg}`);
      if (this._failCount >= PhoneLoggerCard.CIRCUIT_MAX_FAILURES) {
        this._circuitOpenUntil = Date.now() + PhoneLoggerCard.CIRCUIT_COOLDOWN_MS;
        this._error = msg + t('retry_suffix', this._lang);
        this._failCount = 0;
      } else {
        this._error = msg;
      }
      this._ingressUrl = null;
    } finally {
      this._loading = false;
      this._loadingMore = false;
    }
  }

  private _loadMore() {
    if (this._nextCursor) this._fetchCalls(this._nextCursor);
  }

  private _groupedCalls(): Array<{ day: string; calls: CallItem[] }> {
    const now = new Date();
    const groups = new Map<string, CallItem[]>();
    for (const call of this._calls) {
      const key = dayKey(new Date(call.started_at));
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(call);
    }
    return Array.from(groups.entries()).map(([, calls]) => ({
      day: relativeDay(new Date(calls[0].started_at), now, this._lang),
      calls,
    }));
  }

  protected render() {
    if (!this._config) return nothing;
    const grouped = this._groupedCalls();
    const { title } = this._config;

    return html`
      <ha-card>
        ${title !== '' ? html`<div class="card-header">${title ?? t('default_title', this._lang)}</div>` : nothing}
        <div class="card-content">
          ${this._loading
            ? html`<div class="status">${t('loading', this._lang)}</div>`
            : this._error
              ? html`<div class="status error">${this._error}</div>`
              : grouped.length === 0
                ? html`<div class="status">${t('no_calls', this._lang)}</div>`
                : html`
                    ${grouped.map(
                      (group) => html`
                        <div class="day-header">${group.day}</div>
                        <table>
                          ${group.calls.map((call) => this._renderRow(call))}
                        </table>
                      `,
                    )}
                    ${this._nextCursor
                      ? html`
                          <div class="load-more">
                            <button @click=${this._loadMore} ?disabled=${this._loadingMore}>
                              ${this._loadingMore ? t('loading_more', this._lang) : t('load_more', this._lang)}
                            </button>
                          </div>
                        `
                      : nothing}
                  `}
        </div>
        ${this._selectedCall ? this._renderModal(this._selectedCall) : nothing}
        ${this._debugLog.length
          ? html`
              <div class="debug">
                <div class="debug-header">Debug (v${CARD_VERSION})</div>
                ${this._debugLog.map((line) => html`<div class="debug-line">${line}</div>`)}
              </div>
            `
          : nothing}
      </ha-card>
    `;
  }

  private _renderRow(call: CallItem) {
    const style = getStatusStyle(call.status, call.direction);
    const tooltip = statusLabel(call.status, call.direction, this._lang);
    const displayName = call.direction === 'inbound' ? call.caller_display : call.called_display;
    const device = call.caller_device?.name ?? null;
    const time = new Date(call.started_at).toLocaleTimeString(this._lang, {
      hour: '2-digit',
      minute: '2-digit',
    });
    const secondary = device ? `${time} – ${device}` : time;

    return html`
      <tr
        @click=${() => {
          this._selectedCall = call;
        }}
        class="clickable"
      >
        <td class="icon-cell">${icon(style.icon, style.color, tooltip)}</td>
        <td class="name-cell">
          <span class="name">${displayName}</span>
          <span class="secondary">${secondary}</span>
        </td>
        <td class="duration-cell">${formatDuration(call.duration_seconds)}</td>
      </tr>
    `;
  }

  private _renderModal(call: CallItem) {
    const lang = this._lang;
    const style = getStatusStyle(call.status, call.direction);
    const tooltip = statusLabel(call.status, call.direction, lang);
    const displayName = call.direction === 'inbound' ? call.caller_display : call.called_display;
    const device = call.caller_device;

    const row = (label: string, value: string) => html`
      <tr>
        <td class="modal-label">${label}</td>
        <td class="modal-value">${value}</td>
      </tr>
    `;

    return html`
      <div class="modal-backdrop" @click=${this._closeModal}>
        <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="modal-header">
            ${icon(style.icon, style.color, tooltip)}
            <span class="modal-title">${displayName}</span>
            <button class="modal-close" @click=${this._closeModal}>${icon('mdi:close', 'currentColor')}</button>
          </div>
          <table class="modal-table">
            ${row(t('modal_caller', lang), `${call.caller_display} (${call.caller_number})`)}
            ${row(t('modal_called', lang), `${call.called_display} (${call.called_number})`)}
            ${device ? row(t('modal_device', lang), device.name) : nothing}
            ${device ? row(t('modal_extension', lang), device.extension) : nothing}
            ${row(t('modal_started', lang), formatTimestamp(call.started_at, lang))}
            ${row(t('modal_connected', lang), formatTimestamp(call.connected_at, lang))}
            ${row(t('modal_finished', lang), formatTimestamp(call.finished_at, lang))}
            ${row(t('modal_duration', lang), formatDuration(call.duration_seconds))}
            ${row(t('modal_msn', lang), call.msn || t('modal_unknown', lang))}
            ${row(t('modal_trunk', lang), call.trunk_id || t('modal_unknown', lang))}
            ${row(t('modal_line', lang), String(call.line_id))}
            ${row(t('modal_internal', lang), call.is_internal ? t('modal_yes', lang) : t('modal_no', lang))}
          </table>
        </div>
      </div>
    `;
  }

  private _closeModal() {
    this._selectedCall = null;
  }

  static styles = css`
    :host {
      display: block;
    }
    .card-header {
      padding: 12px 16px 0;
      font-size: 1.1em;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .card-content {
      padding: 8px 16px 16px;
    }
    .status {
      color: var(--secondary-text-color);
      padding: 8px 0;
    }
    .status.error {
      color: var(--error-color, #e45f3b);
    }
    .day-header {
      font-size: 0.75em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--secondary-text-color);
      padding: 10px 0 4px;
    }
    .day-header:first-child {
      padding-top: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    tr.clickable {
      cursor: pointer;
    }
    tr.clickable:hover {
      background: var(--secondary-background-color);
    }
    tr {
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }
    tr:last-child {
      border-bottom: none;
    }
    td {
      padding: 6px 4px;
      vertical-align: middle;
    }
    .icon-cell {
      width: 28px;
      padding-right: 8px;
    }
    .name-cell {
      display: flex;
      flex-direction: column;
    }
    .name {
      font-size: 0.95em;
      color: var(--primary-text-color);
    }
    .secondary {
      font-size: 0.78em;
      color: var(--secondary-text-color);
    }
    .duration-cell {
      text-align: right;
      font-size: 0.85em;
      color: var(--secondary-text-color);
      white-space: nowrap;
      padding-left: 8px;
    }
    .load-more {
      display: flex;
      justify-content: center;
      padding-top: 12px;
    }
    .load-more button {
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
      border-radius: 4px;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 0.85em;
      padding: 6px 16px;
    }
    .load-more button:disabled {
      color: var(--secondary-text-color);
      cursor: default;
    }
    .load-more button:hover:not(:disabled) {
      background: var(--secondary-background-color);
    }
    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal {
      background: var(--card-background-color, #fff);
      border-radius: 8px;
      padding: 20px;
      max-width: 420px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    .modal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }
    .modal-title {
      flex: 1;
      font-size: 1.05em;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .modal-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
    }
    .modal-table {
      width: 100%;
      border-collapse: collapse;
    }
    .modal-table tr {
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }
    .modal-table tr:last-child {
      border-bottom: none;
    }
    .modal-label {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      padding: 5px 12px 5px 0;
      white-space: nowrap;
      vertical-align: top;
    }
    .modal-value {
      font-size: 0.85em;
      color: var(--primary-text-color);
      padding: 5px 0;
      word-break: break-all;
    }
    /* Debug panel */
    .debug {
      margin-top: 12px;
      padding: 8px 16px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.1));
    }
    .debug-header {
      font-size: 0.7em;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }
    .debug-line {
      font-size: 0.7em;
      font-family: monospace;
      color: var(--secondary-text-color);
      line-height: 1.4;
      word-break: break-all;
    }
  `;
}

declare global {
  interface Window {
    customCards?: Array<object>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'phone-logger-card',
  name: 'Phone Logger Card',
  description: 'Displays phone call history from a REST endpoint',
  preview: false,
  documentationURL: 'https://github.com/akentner/phone-logger-card',
});

customElements.define('phone-logger-card', PhoneLoggerCard);

console.info(
  `%c PHONE-LOGGER-CARD %c v${CARD_VERSION} `,
  'color:white;background:#3092dc;font-weight:bold',
  'color:#3092dc;background:white;font-weight:bold',
);
