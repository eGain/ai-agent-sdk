export interface MaskingPatternApi {
  name: string;
  description?: string;
  order: number;
  javascriptRegularExpression: string;
  numOfCharsToUnmaskFromLeft: number;
  numOfCharsToUnmaskFromRight: number;
  applyLuhnAlgorithm: boolean;
  maskingCharacter: string;
}

export interface MaskingPatternsApiResponse {
  patterns?: MaskingPatternApi[];
  configuration?: {
    htmlTagMatcherRegEx?: string;
    htmlTagMatcherIncr?: number;
  };
}

export interface AgentDetailsForMasking {
  enableDataMasking?: boolean;
  departmentId?: string | number;
  languageCode?: string;
}
