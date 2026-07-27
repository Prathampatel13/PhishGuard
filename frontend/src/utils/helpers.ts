/* Utility helper functions for PhishGuard */

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
  if (score <= 30) return 'Low Risk';
  if (score <= 60) return 'Medium Risk';
  return 'High Risk';
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

