import { describe, it, expect, beforeEach } from 'vitest';
import { DataMasker } from './DataMasker.js';
import type { MaskingPatternsApiResponse } from './types.js';

/** cc-widget eGainAiAgent.spec.ts maskingpatterns mock */
const maskingPatternsFixture: MaskingPatternsApiResponse = {
  patterns: [
    {
      name: 'Credit Card',
      description: 'Masks credit card numbers',
      order: 1,
      javascriptRegularExpression: '\\b(?:\\d[ -]*?){13,16}\\b',
      numOfCharsToUnmaskFromLeft: 0,
      numOfCharsToUnmaskFromRight: 4,
      applyLuhnAlgorithm: true,
      maskingCharacter: '*',
    },
    {
      name: 'SSN',
      description: 'Masks social security numbers',
      order: 2,
      javascriptRegularExpression: '\\b\\d{3}[-\\s]?\\d{2}[-\\s]?\\d{4}\\b',
      numOfCharsToUnmaskFromLeft: 0,
      numOfCharsToUnmaskFromRight: 4,
      applyLuhnAlgorithm: false,
      maskingCharacter: '*',
    },
    {
      name: 'Email',
      description: 'Masks email addresses',
      order: 3,
      javascriptRegularExpression: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      numOfCharsToUnmaskFromLeft: 2,
      numOfCharsToUnmaskFromRight: 0,
      applyLuhnAlgorithm: false,
      maskingCharacter: '*',
    },
    {
      name: 'Phone',
      description: 'Masks phone numbers',
      order: 4,
      javascriptRegularExpression:
        '\\b(?:\\+?1[-\\s]?)?\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}\\b',
      numOfCharsToUnmaskFromLeft: 0,
      numOfCharsToUnmaskFromRight: 4,
      applyLuhnAlgorithm: false,
      maskingCharacter: '*',
    },
  ],
  configuration: {
    htmlTagMatcherRegEx: '((?:[\\r\\n|\\n]|(?:<[^>]*>))*)',
    htmlTagMatcherIncr: 1,
  },
};

describe('DataMasker', () => {
  let masker: DataMasker;

  beforeEach(() => {
    masker = new DataMasker();
    masker.setPlatformSupported(true);
    masker.setPatternsFromApiResponse(maskingPatternsFixture);
  });

  it('masks credit card numbers with Luhn validation', () => {
    const validCC = '4532015112830366';
    const result = masker.maskContent(`My card is ${validCC}`);
    expect(result).toContain('************0366');
    expect(result).not.toContain(validCC);
  });

  it('preserves invalid credit card patterns (fails Luhn)', () => {
    const invalidCC = '1234567890123456';
    const result = masker.maskContent(`My card is ${invalidCC}`);
    expect(result).toContain(invalidCC);
  });

  it('masks SSN patterns', () => {
    const ssn = '123-45-6789';
    const result = masker.maskContent(`My SSN is ${ssn}`);
    expect(result).toContain('*******6789');
    expect(result).not.toContain('123-45');
  });

  it('masks email addresses', () => {
    const email = 'john.doe@example.com';
    const result = masker.maskContent(`Contact me at ${email}`);
    expect(result).toContain('jo');
    expect(result).not.toContain('@example.com');
  });

  it('masks phone numbers', () => {
    const phone = '(555) 123-4567';
    const result = masker.maskContent(`Call me at ${phone}`);
    expect(result).toContain('4567');
    expect(result).not.toContain('(555) 123');
  });

  it('preserves non-sensitive data', () => {
    const safeData = 'Hello, I need help with my order #12345';
    expect(masker.maskContent(safeData)).toBe(safeData);
  });

  it('handles empty input', () => {
    expect(masker.maskContent('')).toBe('');
  });

  it('returns input when platform masking is not supported', () => {
    masker.setPlatformSupported(false);
    const validCC = '4532015112830366';
    expect(masker.maskContent(validCC)).toBe(validCC);
  });
});
