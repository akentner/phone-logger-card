export interface PhoneLoggerCardConfig {
  msn?: string | string[];
  limit?: number;
  title?: string;
}

export interface CallerDevice {
  id: string;
  extension: string;
  name: string;
  type: string;
}

export interface CallItem {
  id: string;
  connection_id: number;
  caller_number: string;
  called_number: string;
  direction: 'inbound' | 'outbound';
  status: 'answered' | 'missed' | 'not_reached' | 'voicemail' | string;
  caller_device: CallerDevice | null;
  called_device: CallerDevice | null;
  msn: string;
  trunk_id: string;
  line_id: number;
  is_internal: boolean;
  started_at: string;
  connected_at: string | null;
  finished_at: string | null;
  duration_seconds: number;
  caller_display: string;
  called_display: string;
  created_at: string;
  updated_at: string;
}

export interface CallsResponse {
  items: CallItem[];
  next_cursor: string | null;
  limit: number;
}

