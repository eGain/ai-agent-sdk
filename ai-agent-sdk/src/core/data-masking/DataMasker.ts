import type { MaskingPatternApi, MaskingPatternsApiResponse } from './types.js';

const DEFAULT_HTML_TAG_MATCHER =
  '((?:[\\r\\n|\\n]|(?:<[^>]*>))*)';

function isValidCreditCard(value: string): boolean {
  if (/[^0-9-\s.]+/.test(value)) return false;
  let nCheck = 0;
  let bEven = false;
  const digits = value.replace(/\D/g, '');
  for (let n = digits.length - 1; n >= 0; n--) {
    let nDigit = parseInt(digits.charAt(n), 10);
    if (bEven) {
      if ((nDigit *= 2) > 9) {
        nDigit -= 9;
      }
    }
    nCheck += nDigit;
    bEven = !bEven;
  }
  return nCheck % 10 === 0;
}

/**
 * Applies department masking patterns to plain text (cc-widget eGainAiAgent parity).
 */
export class DataMasker {
  private patterns: MaskingPatternApi[] = [];
  private htmlTagMatcherRegEx = DEFAULT_HTML_TAG_MATCHER;
  private platformSupported = false;

  setPlatformSupported(supported: boolean): void {
    this.platformSupported = supported;
    if (!supported) {
      this.patterns = [];
    }
  }

  clearPatterns(): void {
    this.patterns = [];
  }

  setPatternsFromApiResponse(response: MaskingPatternsApiResponse | null | undefined): void {
    const list = response?.patterns;
    if (!list?.length) {
      this.patterns = [];
      return;
    }
    this.patterns = [...list].sort((a, b) => a.order - b.order);
    this.htmlTagMatcherRegEx =
      response?.configuration?.htmlTagMatcherRegEx || DEFAULT_HTML_TAG_MATCHER;
  }

  isActive(): boolean {
    return this.platformSupported && this.patterns.length > 0;
  }

  maskContent(data: string): string {
    if (!this.platformSupported || !data || !this.patterns.length) {
      return data;
    }

    let result = data;

    for (const pattern of this.patterns) {
      try {
        const regex = new RegExp(pattern.javascriptRegularExpression, 'g');
        result = result.replace(regex, (match) => {
          const htmlTagRegex = this.htmlTagMatcherRegEx
            ? new RegExp(this.htmlTagMatcherRegEx, 'g')
            : /<[^>]*>|[\r\n]/g;
          let cleanMatch = match;
          let prevCleanMatch: string;
          do {
            prevCleanMatch = cleanMatch;
            cleanMatch = cleanMatch.replace(htmlTagRegex, '');
          } while (cleanMatch !== prevCleanMatch);

          if (pattern.applyLuhnAlgorithm && !isValidCreditCard(cleanMatch)) {
            return match;
          }

          const len = cleanMatch.length;
          const left = pattern.numOfCharsToUnmaskFromLeft;
          const right = pattern.numOfCharsToUnmaskFromRight;

          if (left + right >= len) return match;

          return (
            cleanMatch.substring(0, left) +
            pattern.maskingCharacter.repeat(len - left - right) +
            cleanMatch.substring(len - right)
          );
        });
      } catch {
        // Skip invalid pattern (cc-widget parity)
      }
    }

    return result;
  }
}
