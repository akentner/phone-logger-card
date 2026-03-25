type Lang = "de" | "en";

const translations: Record<Lang, Record<string, string>> = {
  de: {
    loading: "Lade…",
    no_calls: "Keine Anrufe",
    load_more: "Mehr laden",
    loading_more: "Lade…",
    today: "Heute",
    yesterday: "Gestern",
    two_days_ago: "Vorgestern",
    retry_suffix: " – Erneuter Versuch in 5 Min.",
    default_title: "Anrufliste",
    // Status tooltips
    status_answered_inbound: "Eingehender Anruf",
    status_answered_outbound: "Ausgehender Anruf",
    status_missed: "Verpasster Anruf",
    status_not_reached: "Nicht erreichbar",
    status_voicemail: "Mailbox",
    status_default: "Anruf",
    // Modal
    modal_caller: "Anrufer",
    modal_called: "Angerufen",
    modal_device: "Endgerät",
    modal_extension: "Nebenstelle",
    modal_started: "Beginn",
    modal_connected: "Verbunden",
    modal_finished: "Ende",
    modal_duration: "Dauer",
    modal_msn: "MSN",
    modal_trunk: "Trunk",
    modal_line: "Linie",
    modal_internal: "Intern",
    modal_yes: "Ja",
    modal_no: "Nein",
    modal_unknown: "–",
  },
  en: {
    loading: "Loading…",
    no_calls: "No calls",
    load_more: "Load more",
    loading_more: "Loading…",
    today: "Today",
    yesterday: "Yesterday",
    two_days_ago: "2 days ago",
    retry_suffix: " — Retrying in 5 min",
    default_title: "Call Log",
    status_answered_inbound: "Incoming call",
    status_answered_outbound: "Outgoing call",
    status_missed: "Missed call",
    status_not_reached: "Not reached",
    status_voicemail: "Voicemail",
    status_default: "Call",
    modal_caller: "Caller",
    modal_called: "Called",
    modal_device: "Device",
    modal_extension: "Extension",
    modal_started: "Started",
    modal_connected: "Connected",
    modal_finished: "Finished",
    modal_duration: "Duration",
    modal_msn: "MSN",
    modal_trunk: "Trunk",
    modal_line: "Line",
    modal_internal: "Internal",
    modal_yes: "Yes",
    modal_no: "No",
    modal_unknown: "–",
  },
};

function getLang(): Lang {
  return navigator.language.startsWith("de") ? "de" : "en";
}

export function t(key: string): string {
  const lang = getLang();
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export function statusLabel(status: string, direction: string): string {
  if (status === "answered") {
    return direction === "inbound" ? t("status_answered_inbound") : t("status_answered_outbound");
  }
  if (status === "missed") return t("status_missed");
  if (status === "not_reached") return t("status_not_reached");
  if (status === "voicemail") return t("status_voicemail");
  return t("status_default");
}
