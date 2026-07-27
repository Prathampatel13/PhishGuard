/* Utility helper functions for PhishGuard */
import type { ScanResult } from '../types';
import jsPDF from 'jspdf';

/**
 * Format a date string to a more readable format
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Truncate a URL to a specified length
 */
export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
}

/**
 * Get color based on risk score
 */
export function getRiskColor(score: number): string {
  if (score <= 30) return '#22c55e'; // Safe - Green
  if (score <= 60) return '#f59e0b'; // Suspicious - Amber
  return '#ef4444'; // Dangerous - Red
}

/**
 * Get background gradient based on risk score
 */
export function getRiskGradient(score: number): string {
  if (score <= 30) return 'from-green-500/20 to-green-600/10';
  if (score <= 60) return 'from-yellow-500/20 to-orange-500/10';
  return 'from-red-500/20 to-red-600/10';
}

/**
 * Get status label with proper capitalization
 */
export function getStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Get severity level for badge styling
 */
export function getSeverityClass(status: string): string {
  switch (status) {
    case 'safe':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'suspicious':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'dangerous':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Export data as CSV
 */
export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        const strValue = String(value ?? '');
        // Escape quotes and wrap in quotes if contains comma or newline
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Calculate animation delay for staggered animations
 */
export function staggerDelay(index: number, baseDelay: number = 0.1): number {
  return index * baseDelay;
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Get risk level description
 */
export function getRiskDescription(score: number): string {
  if (score <= 30) return 'Low Risk - Safe';
  if (score <= 60) return 'Medium Risk - Suspicious';
  return 'High Risk - Dangerous';
}

/**
 * Get icon name based on status
 */
export function getStatusIcon(status: string): string {
  switch (status) {
    case 'safe':
      return 'ShieldCheck';
    case 'suspicious':
      return 'AlertTriangle';
    case 'dangerous':
      return 'ShieldOff';
    default:
      return 'HelpCircle';
  }
}

/**
 * Generate dynamic recommendations based on status
 */
export function getRecommendations(status: string): string[] {
  if (status === 'safe') {
    return [
      'Safe to browse - No immediate threats detected',
      'Bookmark trusted websites for easy access',
      'Use Multi-Factor Authentication (MFA) on sensitive accounts',
      'Keep your browser and extensions updated',
      'Enable Safe Browsing in your browser settings',
    ];
  } else if (status === 'suspicious') {
    return [
      'Do NOT enter any passwords or personal information',
      'Verify the website URL carefully before proceeding',
      'Check for HTTPS and valid SSL certificate',
      'Avoid downloading any files from this website',
      'Report suspicious websites to Google Safe Browsing',
    ];
  } else {
    return [
      'Do NOT enter any passwords or personal information',
      'Do NOT download any files from this website',
      'Leave the website immediately',
      'Clear your browser cache and cookies',
      'Run a full antivirus scan on your device',
      'Enable phishing protection in your browser',
      'Report this phishing site to relevant authorities',
    ];
  }
}

/**
 * Generate PDF report from scan result
 */
export function generatePDFReport(result: ScanResult): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const primaryColor = '#2563EB';
  const successColor = '#22C55E';
  const dangerColor = '#EF4444';
  const warningColor = '#F59E0B';
  const darkBg = '#0F172A';

  // Header
  doc.setFillColor(darkBg);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor('#FFFFFF');
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PhishGuard', 20, 25);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#94A3B8');
  doc.text('Phishing URL Detection Report', 20, 33);

  // Report Meta
  const now = new Date();
  doc.setTextColor('#64748B');
  doc.setFontSize(8);
  doc.text(`Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, pageWidth - 20, 15, { align: 'right' });
  doc.text(`Report ID: ${generateId()}`, pageWidth - 20, 22, { align: 'right' });

  // URL Section
  let yPos = 55;
  doc.setFillColor('#1E293B');
  doc.roundedRect(15, yPos, pageWidth - 30, 25, 3, 3, 'FD');
  doc.setTextColor('#2563EB');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('SCANNED URL', 20, yPos + 10);
  doc.setTextColor('#E2E8F0');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(result.url, 20, yPos + 20);

  // Risk Score & Status
  yPos += 40;
  const riskColor = result.risk_score <= 30 ? successColor : result.risk_score <= 60 ? warningColor : dangerColor;

  // Score Box
  doc.setFillColor('#1E293B');
  doc.roundedRect(15, yPos, 80, 40, 3, 3, 'FD');
  doc.setTextColor('#64748B');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('RISK SCORE', 20, yPos + 10);
  doc.setTextColor(riskColor);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`${Math.round(result.risk_score)}/100`, 20, yPos + 32);

  // Status Box
  const statusBoxColor = result.status === 'safe' ? successColor : result.status === 'suspicious' ? warningColor : dangerColor;
  doc.setFillColor('#1E293B');
  doc.roundedRect(105, yPos, 80, 40, 3, 3, 'FD');
  doc.setTextColor('#64748B');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUS', 110, yPos + 10);
  doc.setTextColor(statusBoxColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(getStatusLabel(result.status), 110, yPos + 32);

  // Confidence Box
  doc.setFillColor('#1E293B');
  doc.roundedRect(195, yPos, 80, 40, 3, 3, 'FD');
  doc.setTextColor('#64748B');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CONFIDENCE', 200, yPos + 10);
  doc.setTextColor('#22C55E');
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.confidence}%`, 200, yPos + 32);

  // Detection Reasons
  yPos += 55;
  doc.setDrawColor(primaryColor);
  doc.setFillColor('#1E293B');
  doc.roundedRect(15, yPos, pageWidth - 30, 15, 3, 3, 'FD');
  doc.setTextColor(primaryColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('DETECTION REASONS', 20, yPos + 10);

  yPos += 20;
  result.reasons.forEach((reason) => {
    const isSafe = reason.toLowerCase().includes('safe') || reason.toLowerCase().includes('https') || reason.toLowerCase().includes('trusted');
    const isDanger = reason.toLowerCase().includes('danger') || reason.toLowerCase().includes('malicious') || reason.toLowerCase().includes('suspicious');

    doc.setFillColor('#0F172A');
    doc.roundedRect(15, yPos, pageWidth - 30, 8, 2, 2, 'FD');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(isSafe ? successColor : isDanger ? dangerColor : warningColor);
    doc.text(isSafe ? '✓' : '✗', 20, yPos + 6);
    doc.setTextColor('#CBD5E1');
    doc.text(reason, 28, yPos + 6);
    yPos += 10;
    if (yPos > 250) { doc.addPage(); yPos = 20; }
  });

  // Recommendation
  yPos += 10;
  doc.setDrawColor('#22C55E');
  doc.setFillColor('#1E293B');
  doc.roundedRect(15, yPos, pageWidth - 30, 15, 3, 3, 'FD');
  doc.setTextColor('#22C55E');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMMENDATION', 20, yPos + 10);

  yPos += 20;
  doc.setFillColor('#0F172A');
  doc.roundedRect(15, yPos, pageWidth - 30, 12, 2, 2, 'FD');
  doc.setTextColor('#E2E8F0');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(result.recommendation, 20, yPos + 8);

  // Threat Indicators
  yPos += 25;
  doc.setDrawColor('#EF4444');
  doc.setFillColor('#1E293B');
  doc.roundedRect(15, yPos, pageWidth - 30, 15, 3, 3, 'FD');
  doc.setTextColor('#EF4444');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('THREAT INDICATORS', 20, yPos + 10);

  yPos += 20;
  const indicators = [
    { label: 'HTTPS', value: result.analysis_details.has_https ? 'Yes' : 'No', safe: result.analysis_details.has_https },
    { label: 'HTTP', value: result.analysis_details.has_http ? 'Yes' : 'No', safe: !result.analysis_details.has_http },
    { label: 'IP Address', value: result.analysis_details.has_ip ? 'Yes' : 'No', safe: !result.analysis_details.has_ip },
    { label: 'Suspicious TLD', value: result.analysis_details.suspicious_tld ? 'Yes' : 'No', safe: !result.analysis_details.suspicious_tld },
    { label: '@ Symbol', value: result.analysis_details.has_at_symbol ? 'Yes' : 'No', safe: !result.analysis_details.has_at_symbol },
    { label: 'Hyphens', value: result.analysis_details.has_hyphens ? 'Yes' : 'No', safe: !result.analysis_details.has_hyphens },
    { label: 'Subdomains', value: `${result.analysis_details.subdomain_count}`, safe: result.analysis_details.subdomain_count <= 2 },
    { label: 'URL Length', value: `${result.analysis_details.url_length}`, safe: result.analysis_details.url_length < 100 },
    { label: 'Numbers', value: `${result.analysis_details.number_count}`, safe: result.analysis_details.number_count < 5 },
  ];

  indicators.forEach((ind, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const xPos = col === 0 ? 20 : pageWidth / 2 + 10;
    const yIndicator = yPos + (row * 8);

    if (yIndicator > 270) return;

    doc.setFillColor('#0F172A');
    doc.roundedRect(xPos, yIndicator, (pageWidth / 2) - 25, 7, 2, 2, 'FD');
    doc.setTextColor(ind.safe ? '#22C55E' : '#EF4444');
    doc.setFontSize(7);
    doc.text(ind.safe ? '✓' : '✗', xPos + 3, yIndicator + 5);
    doc.setTextColor('#94A3B8');
    doc.text(ind.label, xPos + 10, yIndicator + 5);
    doc.setTextColor('#E2E8F0');
    doc.text(ind.value, xPos + (pageWidth / 2) - 55, yIndicator + 5);
  });

  // Footer
  doc.setFillColor(darkBg);
  doc.rect(0, 280, pageWidth, 10, 'F');
  doc.setTextColor('#64748B');
  doc.setFontSize(6);
  doc.text('PhishGuard - Cyber Threat Intelligence System', pageWidth / 2, 286, { align: 'center' });

  doc.save(`phishguard-report-${new Date().toISOString().split('T')[0]}.pdf`);
}

