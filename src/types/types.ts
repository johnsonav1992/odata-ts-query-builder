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
