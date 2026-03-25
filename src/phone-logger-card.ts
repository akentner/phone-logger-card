import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { PhoneLoggerCardConfig, CallItem, CallsResponse, AddonInfo } from "./types.js";
import { t, statusLabel } from "./i18n.js";

const CARD_VERSION = "1.0.3";
const DEFAULT_ADDON_SLUG = "72a005f5-phone-logger";
const DEFAULT_LIMIT = 20;

interface Hass {
  callApi<T>(method: "GET" | "POST", path: string): Promise<T>;
}

// MDI icons as inline SVG paths
const MDI_PATHS: Record<string, string> = {
  "mdi:phone-incoming":
    "M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8M21 6h-3V3h-2v3h-3v2h3v3h2V8h3V6z",
  "mdi:phone-outgoing":
    "M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8M15 3v2h3.6l-3.8 3.8 1.4 1.4L20 6.4V10h2V3h-7z",
  "mdi:phone-remove":
    "M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8M22 4.4L20.6 3 18 5.6 15.4 3 14 4.4l2.6 2.6L14 9.6 15.4 11 18 8.4l2.6 2.6L22 9.6 19.4 7 22 4.4z",
  "mdi:phone-message":
    "M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8M22 3H14a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1l2 2 2-2h3a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z",
  "mdi:phone-hangup":
    "M12 9c-1.6 0-3.1.3-4.5.7v3.1c0 .4-.2.7-.5.9-1 .5-1.8 1.1-2.6 1.9-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3L.8 13.4c-.2-.2-.3-.4-.3-.7 0-.3.1-.5.3-.7C3.3 9.4 7.5 8 12 8s8.7 1.4 11.2 4c.2.2.3.4.3.7 0 .3-.1.5-.3.7l-2.2 2.2c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3-.8-.8-1.7-1.4-2.6-1.9-.3-.2-.5-.5-.5-.9V9.7C15.1 9.3 13.6 9 12 9z",
  "mdi:close":
    "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
};

interface StatusStyle {
  icon: string;
  color: string;
}

function getStatusStyle(status: string, direction: string): StatusStyle {
  if (status === "answered") {
    return direction === "inbound"
      ? { icon: "mdi:phone-incoming", color: "#3092dc" }
      : { icon: "mdi:phone-outgoing", color: "#8bbf68" };
  }
  if (status === "missed") return { icon: "mdi:phone-remove", color: "#e45f3b" };
  if (status === "not_reached") return { icon: "mdi:phone-remove", color: "#8bbf68" };
  if (status === "voicemail") return { icon: "mdi:phone-message", color: "#e45f3b" };
  return { icon: "mdi:phone-hangup", color: "var(--secondary-text-color, grey)" };
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "–";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatTimestamp(iso: string | null): string {
  if (!iso) return "–";
  return new Date(iso).toLocaleString(navigator.language, {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function relativeDay(date: Date, now: Date): string {
  const todayKey = dayKey(now);
  const key = dayKey(date);
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const itemMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((todayMidnight.getTime() - itemMidnight.getTime()) / 86_400_000);

  if (key === todayKey) return t("today");
  if (diffDays === 1) return t("yesterday");
  if (diffDays === 2) return t("two_days_ago");
  return date.toLocaleDateString(navigator.language, {
    weekday: "short", day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function mdiIcon(name: string, color: string, title?: string) {
  const path = MDI_PATHS[name] ?? MDI_PATHS["mdi:phone-hangup"];
  return html`
    <svg viewBox="0 0 24 24" width="22" height="22" style="fill:${color};flex-shrink:0" role="img">
      ${title ? html`<title>${title}</title>` : nothing}
      <path d="${path}" />
    </svg>
  `;
}

class PhoneLoggerCard extends LitElement {
  @property({ attribute: false }) public hass?: Hass;
  @state() private _config?: PhoneLoggerCardConfig;
  @state() private _calls: CallItem[] = [];
  @state() private _nextCursor: string | null = null;
  @state() private _loading = false;
  @state() private _loadingMore = false;
  @state() private _error: string | null = null;
  @state() private _selectedCall: CallItem | null = null;

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
    if (changed.has("hass") && this.hass && this._calls.length === 0 && !this._loading) {
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

  private async _resolveIngressUrl(): Promise<string> {
    if (this._ingressUrl) return this._ingressUrl;

    if (this._config?.ingress_token) {
      const token = this._config.ingress_token.trim();
      this._ingressUrl = `/api/hassio_ingress/${token}/`;
      return this._ingressUrl;
    }

    const slug = this._config?.addon_slug ?? DEFAULT_ADDON_SLUG;
    const info = await this.hass!.callApi<AddonInfo>("GET", `hassio/addons/${slug}/info`);
    const base = info.ingress_url.endsWith("/") ? info.ingress_url : `${info.ingress_url}/`;
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
      const base = await this._resolveIngressUrl();
      const limit = this._config?.limit ?? DEFAULT_LIMIT;
      const params = new URLSearchParams({ limit: String(limit) });
      if (cursor) params.set("cursor", cursor);

      // MSN filter — API supports multiple msn params
      const msns = this._config?.msn
        ? Array.isArray(this._config.msn) ? this._config.msn : [this._config.msn]
        : [];
      msns.forEach((m) => params.append("msn", m));

      const res = await fetch(`${base}api/calls?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: CallsResponse = await res.json();
      this._calls = appending ? [...this._calls, ...(data.items ?? [])] : (data.items ?? []);
      this._nextCursor = data.next_cursor ?? null;
      this._failCount = 0;
    } catch (e) {
      this._failCount++;
      const msg = e instanceof Error ? e.message : String(e);
      if (this._failCount >= PhoneLoggerCard.CIRCUIT_MAX_FAILURES) {
        this._circuitOpenUntil = Date.now() + PhoneLoggerCard.CIRCUIT_COOLDOWN_MS;
        this._error = msg + t("retry_suffix");
        this._failCount = 0;
      } else {
        this._error = msg;
      }
      if (!this._config?.ingress_token) {
        this._ingressUrl = null;
      }
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
      day: relativeDay(new Date(calls[0].started_at), now),
      calls,
    }));
  }

  protected render() {
    if (!this._config) return nothing;
    const grouped = this._groupedCalls();
    const { title } = this._config;

    return html`
      <ha-card>
        ${title !== ""
          ? html`<div class="card-header">${title ?? t("default_title")}</div>`
          : nothing}
        <div class="card-content">
          ${this._loading
            ? html`<div class="status">${t("loading")}</div>`
            : this._error
              ? html`<div class="status error">${this._error}</div>`
              : grouped.length === 0
                ? html`<div class="status">${t("no_calls")}</div>`
                : html`
                    ${grouped.map(
                      (group) => html`
                        <div class="day-header">${group.day}</div>
                        <table>
                          ${group.calls.map((call) => this._renderRow(call))}
                        </table>
                      `
                    )}
                    ${this._nextCursor
                      ? html`
                          <div class="load-more">
                            <button @click=${this._loadMore} ?disabled=${this._loadingMore}>
                              ${this._loadingMore ? t("loading_more") : t("load_more")}
                            </button>
                          </div>
                        `
                      : nothing}
                  `}
        </div>
        ${this._selectedCall ? this._renderModal(this._selectedCall) : nothing}
      </ha-card>
    `;
  }

  private _renderRow(call: CallItem) {
    const style = getStatusStyle(call.status, call.direction);
    const tooltip = statusLabel(call.status, call.direction);
    const displayName = call.direction === "inbound" ? call.caller_display : call.called_display;
    const device = call.caller_device?.name ?? null;
    const time = new Date(call.started_at).toLocaleTimeString(navigator.language, {
      hour: "2-digit", minute: "2-digit",
    });
    const secondary = device ? `${time} – ${device}` : time;

    return html`
      <tr @click=${() => { this._selectedCall = call; }} class="clickable">
        <td class="icon-cell">${mdiIcon(style.icon, style.color, tooltip)}</td>
        <td class="name-cell">
          <span class="name">${displayName}</span>
          <span class="secondary">${secondary}</span>
        </td>
        <td class="duration-cell">${formatDuration(call.duration_seconds)}</td>
      </tr>
    `;
  }

  private _renderModal(call: CallItem) {
    const style = getStatusStyle(call.status, call.direction);
    const tooltip = statusLabel(call.status, call.direction);
    const displayName = call.direction === "inbound" ? call.caller_display : call.called_display;
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
            ${mdiIcon(style.icon, style.color, tooltip)}
            <span class="modal-title">${displayName}</span>
            <button class="modal-close" @click=${this._closeModal}>
              ${mdiIcon("mdi:close", "currentColor")}
            </button>
          </div>
          <table class="modal-table">
            ${row(t("modal_caller"), `${call.caller_display} (${call.caller_number})`)}
            ${row(t("modal_called"), `${call.called_display} (${call.called_number})`)}
            ${device ? row(t("modal_device"), device.name) : nothing}
            ${device ? row(t("modal_extension"), device.extension) : nothing}
            ${row(t("modal_started"), formatTimestamp(call.started_at))}
            ${row(t("modal_connected"), formatTimestamp(call.connected_at))}
            ${row(t("modal_finished"), formatTimestamp(call.finished_at))}
            ${row(t("modal_duration"), formatDuration(call.duration_seconds))}
            ${row(t("modal_msn"), call.msn || t("modal_unknown"))}
            ${row(t("modal_trunk"), call.trunk_id || t("modal_unknown"))}
            ${row(t("modal_line"), String(call.line_id))}
            ${row(t("modal_internal"), call.is_internal ? t("modal_yes") : t("modal_no"))}
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
  `;
}

declare global {
  interface Window {
    customCards?: Array<object>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "phone-logger-card",
  name: "Phone Logger Card",
  description: "Displays phone call history from a REST endpoint",
  preview: false,
  documentationURL: "https://github.com/akentner/phone-logger-card",
});

customElements.define("phone-logger-card", PhoneLoggerCard);

console.info(
  `%c PHONE-LOGGER-CARD %c v${CARD_VERSION} `,
  "color:white;background:#3092dc;font-weight:bold",
  "color:#3092dc;background:white;font-weight:bold"
);
