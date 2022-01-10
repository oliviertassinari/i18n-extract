declare module 'i18n-extract' {
  // ref: https://github.com/babel/babel/blob/master/packages/babel-parser/src/util/location.js
  type Position = {
    line: number;
    column: number;
  };

  // ref: https://github.com/babel/babel/blob/master/packages/babel-parser/src/util/location.js
  type SourceLocation = {
    start: Position;
    end: Position;
    filename: string | undefined;
    identifierName: string | undefined;
  };

  type BabelOptions = Record<string, any>;

  type I18nKey = string;
  type I18nValue = string;
  type I18nDictionary = Record<I18nKey, I18nValue>;

  export type KeyExtractedFromCode = {
    key: I18nKey;
    loc: SourceLocation;
  };

  export type KeyExtractedFromFile = KeyExtractedFromCode & {
    file: string;
  };

  type I18nKeyObject = Pick<KeyExtractedFromCode, 'key'>;

  /* Extract functions */

  export const BASE_PARSER_OPTIONS: BabelOptions;
  export const FLOW_PARSER_OPTIONS: BabelOptions;
  export const TYPESCRIPT_PARSER_OPTIONS: BabelOptions;

  type ExtractOptions = {
    marker?: string;
    keyLoc?: number;
    parser?: 'flow' | 'typescript';
    babelOptions?: BabelOptions;
  };

  export function extractFromCode(
    code: string,
    options: ExtractOptions,
  ): KeyExtractedFromCode[];

  export function extractFromFiles(
    filenames: string[],
    options: ExtractOptions,
  ): KeyExtractedFromFile[];

  /* Report functions */

  enum ReportType {
    MISSING = 'MISSING',
    UNUSED = 'UNUSED',
    DUPLICATED = 'DUPLICATED',
    FORBID_DYNAMIC = 'FORBID_DYNAMIC',
  } 

  export function findDuplicated(
    locale: I18nDictionary,
    keysUsed: I18nKeyObject[],
    options?: {
      threshold: number;
    },
  ): Array<{
    type: ReportType.DUPLICATED,
    keys: I18nKey[],
    value: I18nValue,
  }>

  export function findMissing(
    locale: I18nDictionary,
    keysUsed: I18nKeyObject[],
  ): Array<KeyExtractedFromCode & {
    type: ReportType.MISSING,
  }>;

  export function findUnused(
    locale: I18nDictionary,
    keysUsed: I18nKeyObject[],
  ): Array<Pick<KeyExtractedFromCode, 'key'> & {
    type: ReportType.UNUSED,
  }>;

  export function forbidDynamic(
    locale: I18nDictionary,
    keysUsed: I18nKeyObject[],
  ): Array<KeyExtractedFromCode & {
    type: ReportType.FORBID_DYNAMIC,
  }>;

  /* Other functions */

  export function mergeMessagesWithPO(
    messages: I18nKeyObject[],
    poFileName: string,
    outputFileName: string,
  ): void;

  type RecursiveObject = Record<string, any>;

  export function flatten(
    locale: RecursiveObject,
    prefix?: string,
    flattened?: I18nDictionary,
  ): I18nDictionary;
}
