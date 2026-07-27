"""Phishing URL Detection Engine.

Rule-based analyzer that examines URLs for phishing indicators
and calculates a comprehensive risk score.
"""

import re
import math
from typing import List, Tuple, Dict
from urllib.parse import urlparse

from app.utils.logger import app_logger


class URLAnalyzer:
    """Advanced rule-based phishing URL detection engine.

    Analyzes URLs against 20+ phishing indicators including:
    - Protocol analysis (HTTPS vs HTTP)
    - URL structure analysis
    - Suspicious keyword detection
    - Brand impersonation detection
    - TLD analysis
    - Special character analysis
    """

    # Suspicious keywords commonly used in phishing URLs
    SUSPICIOUS_KEYWORDS: List[str] = [
        "login", "verify", "secure", "bank", "update",
        "account", "confirm", "payment", "signin", "signin",
        "password", "credential", "authenticate", "verification",
        "security", "reset", "token", "auth", "wallet",
        "transaction", "alert", "notification", "suspend",
        "restrict", "unlock", "validate", "session", "expir",
        "blocked", "limited", "unusual", "activity", "review",
    ]

    # Brands commonly targeted for impersonation
    BRAND_KEYWORDS: List[str] = [
        "paypal", "google", "amazon", "facebook", "instagram",
        "apple", "microsoft", "github", "netflix", "twitter",
        "linkedin", "whatsapp", "dropbox", "adobe", "spotify",
        "binance", "coinbase", "chase", "wellsfargo", "bankofamerica",
        "hsbc", "barclays", "americanexpress", "mastercard", "visa",
    ]

    # Suspicious top-level domains
    SUSPICIOUS_TLDS: List[str] = [
        ".xyz", ".top", ".click", ".cf", ".gq", ".ml",
        ".tk", ".ga", ".loan", ".work", ".date", ".men",
        ".racing", ".win", ".review", ".trade", ".science",
        ".download", ".party", ".country", ".stream",
    ]

    # Weight multipliers for different risk factors
    WEIGHTS: Dict[str, float] = {
        "no_https": 20.0,
        "has_http": 15.0,
        "long_url": 10.0,
        "has_hyphen": 5.0,
        "has_at": 25.0,
        "has_ip": 30.0,
        "many_subdomains": 8.0,
        "many_dots": 5.0,
        "special_chars": 4.0,
        "many_numbers": 3.0,
        "suspicious_keywords": 12.0,
        "brand_impersonation": 25.0,
        "suspicious_tld": 20.0,
    }

    def analyze(self, url: str) -> dict:
        """Perform complete phishing analysis on a URL.

        Args:
            url: The URL to analyze

        Returns:
            Dictionary containing risk score, status, reasons, recommendation, confidence
        """
        try:
            # Parse the URL
            parsed = self._parse_url(url)
            if not parsed:
                return self._safe_result(url, "Could not parse URL")

            # Run all analysis checks
            reasons: List[str] = []
            risk_score = 0.0

            # 1. Protocol Analysis
            protocol_risk, protocol_reasons = self._analyze_protocol(parsed)
            risk_score += protocol_risk
            reasons.extend(protocol_reasons)

            # 2. URL Length Analysis
            length_risk, length_reasons = self._analyze_url_length(url)
            risk_score += length_risk
            reasons.extend(length_reasons)

            # 3. Special Character Analysis
            char_risk, char_reasons = self._analyze_special_chars(url)
            risk_score += char_risk
            reasons.extend(char_reasons)

            # 4. IP Address Detection
            ip_risk, ip_reasons = self._analyze_ip_address(parsed)
            risk_score += ip_risk
            reasons.extend(ip_reasons)

            # 5. Subdomain Analysis
            subdomain_risk, subdomain_reasons = self._analyze_subdomains(parsed)
            risk_score += subdomain_risk
            reasons.extend(subdomain_reasons)

            # 6. Number Analysis
            number_risk, number_reasons = self._analyze_numbers(url)
            risk_score += number_risk
            reasons.extend(number_reasons)

            # 7. Suspicious Keyword Detection
            keyword_risk, keyword_reasons, found_keywords = self._analyze_keywords(url)
            risk_score += keyword_risk
            reasons.extend(keyword_reasons)

            # 8. Brand Impersonation Detection
            brand_risk, brand_reasons, found_brands = self._analyze_brands(url)
            risk_score += brand_risk
            reasons.extend(brand_reasons)

            # 9. TLD Analysis
            tld_risk, tld_reasons = self._analyze_tld(parsed)
            risk_score += tld_risk
            reasons.extend(tld_reasons)

            # Clamp risk score between 0 and 100
            risk_score = max(0.0, min(100.0, risk_score))

            # Determine status
            status = self._get_status(risk_score)

            # Generate recommendation
            recommendation = self._get_recommendation(risk_score, reasons)

            # Calculate confidence based on how many indicators were found
            confidence = self._calculate_confidence(risk_score, len(reasons))

            # Build analysis details
            analysis_details = {
                "has_https": parsed.scheme == "https",
                "has_http": parsed.scheme == "http",
                "url_length": len(url),
                "has_hyphens": "-" in parsed.netloc,
                "has_at_symbol": "@" in url,
                "has_ip": bool(re.search(r'\d+\.\d+\.\d+\.\d+', parsed.netloc)),
                "subdomain_count": len(parsed.hostname.split(".")) - 2 if parsed.hostname else 0,
                "dot_count": url.count("."),
                "special_char_count": sum(1 for c in url if c in "!@#$%^&*()_+-=[]{}|;':\",./<>?`~"),
                "number_count": sum(1 for c in url if c.isdigit()),
                "suspicious_keywords": found_keywords,
                "brand_impersonation": found_brands,
                "suspicious_tld": any(parsed.hostname.endswith(tld) if parsed.hostname else False for tld in self.SUSPICIOUS_TLDS),
            }

            result = {
                "url": url,
                "risk_score": round(risk_score, 2),
                "status": status,
                "reasons": reasons,
                "recommendation": recommendation,
                "confidence": round(confidence, 2),
                "analysis_details": analysis_details,
            }

            app_logger.info(
                f"Analysis complete for {url[:50]}... "
                f"Score: {risk_score:.2f}, Status: {status}"
            )

            return result

        except Exception as e:
            app_logger.error(f"Error analyzing URL {url[:50]}...: {str(e)}")
            return self._safe_result(url, f"Analysis error: {str(e)}")

    def _parse_url(self, url: str):
        """Parse URL string, adding scheme if missing."""
        if not url.startswith(("http://", "https://")):
            url = "http://" + url
        try:
            return urlparse(url)
        except Exception:
            return None

    def _analyze_protocol(self, parsed) -> Tuple[float, List[str]]:
        """Analyze URL protocol security."""
        risk = 0.0
        reasons = []

        if parsed.scheme == "https":
            reasons.append("Uses HTTPS (secure protocol)")
        elif parsed.scheme == "http":
            risk += self.WEIGHTS["no_https"] + self.WEIGHTS["has_http"]
            reasons.append("Uses HTTP instead of HTTPS")
            reasons.append("No SSL/TLS encryption detected")
        else:
            risk += self.WEIGHTS["no_https"]
            reasons.append("No HTTPS protocol detected")

        return risk, reasons

    def _analyze_url_length(self, url: str) -> Tuple[float, List[str]]:
        """Analyze URL length for suspicious patterns."""
        risk = 0.0
        reasons = []
        length = len(url)

        if length > 200:
            risk += self.WEIGHTS["long_url"] * 2
            reasons.append(f"Very long URL ({length} characters) - common in phishing")
        elif length > 100:
            risk += self.WEIGHTS["long_url"]
            reasons.append(f"Long URL ({length} characters)")

        return risk, reasons

    def _analyze_special_chars(self, url: str) -> Tuple[float, List[str]]:
        """Detect suspicious special characters in URL."""
        risk = 0.0
        reasons = []

        # Check for @ symbol (can hide actual domain)
        if "@" in url:
            risk += self.WEIGHTS["has_at"]
            reasons.append("Contains @ symbol - can hide the real destination")

        # Count hyphens in domain
        domain_part = url.split("/")[2] if "//" in url else url.split("/")[0]
        hyphen_count = domain_part.count("-")
        if hyphen_count > 2:
            risk += self.WEIGHTS["has_hyphen"] * min(hyphen_count, 4)
            reasons.append(f"Multiple hyphens ({hyphen_count}) in domain name")

        # Count dots
        dot_count = url.count(".")
        if dot_count > 5:
            risk += self.WEIGHTS["many_dots"]
            reasons.append(f"Contains {dot_count} dots - suspicious URL structure")

        # Count special characters
        special_chars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~"
        special_count = sum(1 for c in url if c in special_chars)
        if special_count > 10:
            risk += self.WEIGHTS["special_chars"]
            reasons.append(f"Contains {special_count} special characters")

        return risk, reasons

    def _analyze_ip_address(self, parsed) -> Tuple[float, List[str]]:
        """Detect if URL uses IP address instead of domain name."""
        risk = 0.0
        reasons = []

        if parsed.hostname:
            ip_pattern = re.compile(r'^\d+\.\d+\.\d+\.\d+$')
            if ip_pattern.match(parsed.hostname):
                risk += self.WEIGHTS["has_ip"]
                reasons.append("Uses IP address instead of domain name")
            # Check for hexadecimal IP
            hex_ip = re.compile(r'^0x[a-fA-F0-9]+\.0x[a-fA-F0-9]+\.0x[a-fA-F0-9]+\.0x[a-fA-F0-9]+$')
            if hex_ip.match(parsed.hostname):
                risk += self.WEIGHTS["has_ip"] * 1.5
                reasons.append("Uses hexadecimal IP address (obfuscation attempt)")

        return risk, reasons

    def _analyze_subdomains(self, parsed) -> Tuple[float, List[str]]:
        """Analyze number of subdomains."""
        risk = 0.0
        reasons = []

        if parsed.hostname:
            parts = parsed.hostname.split(".")
            # Subtract main domain and TLD
            subdomain_count = max(0, len(parts) - 2)

            if subdomain_count > 3:
                risk += self.WEIGHTS["many_subdomains"] * min(subdomain_count, 5)
                reasons.append(f"Many subdomains ({subdomain_count}) - potential phishing")
            elif subdomain_count > 1:
                risk += self.WEIGHTS["many_subdomains"] * 0.5
                reasons.append(f"Contains {subdomain_count} subdomain(s)")

        return risk, reasons

    def _analyze_numbers(self, url: str) -> Tuple[float, List[str]]:
        """Analyze numeric character density."""
        risk = 0.0
        reasons = []

        # Count digits in the URL
        digit_count = sum(1 for c in url if c.isdigit())
        url_length = len(url)

        if url_length > 0:
            digit_ratio = digit_count / url_length
            if digit_ratio > 0.3:
                risk += self.WEIGHTS["many_numbers"]
                reasons.append(f"High digit density ({digit_ratio:.0%} of URL)")

        return risk, reasons

    def _analyze_keywords(self, url: str) -> Tuple[float, List[str], List[str]]:
        """Detect suspicious security-related keywords."""
        risk = 0.0
        reasons = []
        found_keywords = []
        url_lower = url.lower()

        for keyword in self.SUSPICIOUS_KEYWORDS:
            if keyword in url_lower:
                found_keywords.append(keyword)
                risk += self.WEIGHTS["suspicious_keywords"]
                reasons.append(f"Contains suspicious keyword: '{keyword}'")

        # Cap keyword risk
        risk = min(risk, self.WEIGHTS["suspicious_keywords"] * 3)

        return risk, reasons, found_keywords

    def _analyze_brands(self, url: str) -> Tuple[float, List[str], List[str]]:
        """Detect brand impersonation attempts."""
        risk = 0.0
        reasons = []
        found_brands = []
        url_lower = url.lower()

        for brand in self.BRAND_KEYWORDS:
            if brand in url_lower:
                found_brands.append(brand)
                risk += self.WEIGHTS["brand_impersonation"]
                reasons.append(f"Brand impersonation detected: '{brand.title()}'")

        # Cap brand impersonation risk
        risk = min(risk, self.WEIGHTS["brand_impersonation"] * 3)

        return risk, reasons, found_brands

    def _analyze_tld(self, parsed) -> Tuple[float, List[str]]:
        """Check if URL uses a suspicious top-level domain."""
        risk = 0.0
        reasons = []

        if parsed.hostname:
            for suspicious_tld in self.SUSPICIOUS_TLDS:
                if parsed.hostname.endswith(suspicious_tld):
                    risk += self.WEIGHTS["suspicious_tld"]
                    reasons.append(f"Suspicious TLD: '{suspicious_tld}'")
                    break

        return risk, reasons

    def _get_status(self, risk_score: float) -> str:
        """Determine status based on risk score."""
        if risk_score <= 30:
            return "safe"
        elif risk_score <= 60:
            return "suspicious"
        else:
            return "dangerous"

    def _get_recommendation(self, risk_score: float, reasons: List[str]) -> str:
        """Generate appropriate recommendation based on analysis."""
        if risk_score <= 30:
            if len(reasons) <= 1:
                return "✅ This URL appears to be safe. Proceed with normal caution."
            else:
                return "✅ No significant threats detected, but always exercise caution."

        elif risk_score <= 60:
            return (
                "⚠️ This URL shows suspicious characteristics. "
                "Avoid entering personal information. "
                "Verify the website's legitimacy through official channels."
            )

        else:
            return (
                "🚨 DANGER! This URL exhibits multiple phishing indicators. "
                "DO NOT visit this site. "
                "Do not enter any personal information. "
                "Report this URL to your security team."
            )

    def _calculate_confidence(self, risk_score: float, reason_count: int) -> float:
        """Calculate analysis confidence based on findings."""
        # Base confidence
        confidence = 70.0

        # Increase confidence based on number of reasons found
        confidence += min(reason_count * 5, 20.0)

        # Higher risk scores increase confidence (more indicators = more certainty)
        confidence += min(risk_score * 0.1, 10.0)

        return min(confidence, 99.0)

    def _safe_result(self, url: str, message: str) -> dict:
        """Return a safe default result."""
        return {
            "url": url,
            "risk_score": 0.0,
            "status": "safe",
            "reasons": [message],
            "recommendation": "Unable to fully analyze the URL. Exercise caution.",
            "confidence": 50.0,
            "analysis_details": {
                "has_https": False,
                "has_http": False,
                "url_length": len(url),
                "has_hyphens": False,
                "has_at_symbol": False,
                "has_ip": False,
                "subdomain_count": 0,
                "dot_count": url.count("."),
                "special_char_count": 0,
                "number_count": 0,
                "suspicious_keywords": [],
                "brand_impersonation": [],
                "suspicious_tld": False,
            },
        }

