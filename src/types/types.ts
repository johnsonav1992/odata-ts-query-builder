export type ODataQueryOption = `$${QueryOptionNames}`;

export type QueryOptionNames =
    | 'select'
    | 'expand'
    | 'orderby'
    | 'top'
    | 'skip'
    | 'count'
    | 'filter'
    | 'count';

export type OptionalCapitalizeKeys<
    T,
    Options extends { capitalizeEntityKeys?: boolean }
> = Options['capitalizeEntityKeys'] extends true
    ? {
          [K in keyof T as Capitalize<string & K>]: T[K];
      }
    : T;
