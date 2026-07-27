/* PhishGuard TypeScript Interfaces */

export interface AnalysisDetails {
  has_https: boolean;
  has_http: boolean;
  url_length: number;
  has_hyphens: boolean;
  has_at_symbol: boolean;
  has_ip: boolean;
  subdomain_count: number;
  dot_count: number;
  special_char_count: number;
  number_count: number;
  suspicious_keywords: string[];
  brand_impersonation: string[];
  suspicious_tld: boolean;
}

export interface ScanResult {
  id?: number;
  url: string;
  risk_score: number;
  status: 'safe' | 'suspicious' | 'dangerous';
  reasons: string[];
  recommendation: string;
  confidence: number;
  analysis_details: AnalysisDetails;
  created_at?: string;
}

export interface HistoryRecord {
  id: number;
  url: string;
  risk_score: number;
  status: string;
  reasons: string | null;
  recommendation: string | null;
  confidence: number;
  created_at: string | null;
}

export interface HistoryResponse {
  total: number;
  records: HistoryRecord[];
  page: number;
  limit: number;
}

export interface Statistics {
  total_scans: number;
  safe_count: number;
  suspicious_count: number;
  dangerous_count: number;
  average_risk_score: number;
  today_scans: number;
  safe_percentage: number;
  suspicious_percentage: number;
  dangerous_percentage: number;
  daily_scan_counts: { date: string; count: number }[];
  risk_trend: { date: string; avg_risk: number }[];
}

export interface ApiError {
  detail: string;
}

export type Theme = 'dark' | 'light';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

