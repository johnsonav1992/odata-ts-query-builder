import { FilterBuilder } from './filterBuilder.js';
import type {
    ODataQueryOption,
    OptionalCapitalizeKeys,
    ValidURL
} from './types/types.js';

/**
 * A builder class for constructing OData queries.
 *
 * @example
 * // Create an instance of ODataQueryBuilder with a base URL
 * const queryBuilder = new ODataQueryBuilder('https://example.com/odata');
 *
 * // Build a query to select specific fields and order by a field
 * const query = queryBuilder
 *     .select(['Name', 'Age'])
 *     .orderBy('Name', 'asc')
 *     .top(10)
 *     .build();
 *
 * // The resulting query string will be:
 * // "https://example.com/odata?$select=Name,Age&$orderby=Name asc&$top=10"
 *
 * @example
 * // Create a query with filters
 * const query = queryBuilder
 *     .filter((filter) =>
 *         filter
 *             .eq('Age', 30)
 *             .and()
 *             .eq('Gender', 'Male')
 *     )
 *     .build();
 *
 * // The resulting query string will be:
 * // "https://example.com/odata?$filter=Age eq 30 and Gender eq 'Male'"
 */
export class ODataQueryBuilder<
    T = any, // Default to any so that no schema can be passed if desired
    Options extends { capitalizeEntityKeys?: boolean } = {}
> {
    /**
     * The base URL for the OData service.
     */
    private _url: ValidURL;

    /**
     * The parameters for the OData query.
     */
    private _params: Record<ODataQueryOption, string> =
        {} as typeof this._params;

    /**
     * The filters for the OData query.
     */
    private _filters: string[] = [];

    constructor(baseUrl: ValidURL) {
        this._url = baseUrl;
    }

    /**
     * Specifies the fields to select in the OData query.
     * @param fields - The fields to select.
     * @returns The current instance of ODataQueryBuilder.
     */
    select(
        fields: Array<keyof OptionalCapitalizeKeys<T, Options>>
    ): ODataQueryBuilder<T> {
        this._params['$select'] = fields.join(',');
        return this;
    }

    /**
     * Specifies the fields to expand in the OData query.
     * @param fields - The fields to expand.
     * @returns The current instance of ODataQueryBuilder.
     */
    expand(
        fields: Array<keyof OptionalCapitalizeKeys<T, Options>>
    ): ODataQueryBuilder<T> {
        this._params['$expand'] = fields.join(',');
        return this;
    }

    /**
     * Specifies the field to order by in the OData query.
     * @param field - The field to order by.
     * @param direction - The direction to order by (asc or desc).
     */
    orderBy(
        field: keyof OptionalCapitalizeKeys<T, Options>,
        direction: 'asc' | 'desc' = 'asc'
    ): ODataQueryBuilder<T> {
        this._params['$orderby'] = `${String(field)} ${direction}`;
        return this;
    }

    /**
     * Specifies the number of records to return in the OData query.
     * @param count - The number of records to return.
     */
    top(count: number): ODataQueryBuilder<T> {
        this._params['$top'] = count.toString();
        return this;
    }

    /**
     * Specifies the number of records to skip in the OData query.
     * @param count - The number of records to skip.
     */
    skip(count: number): ODataQueryBuilder<T> {
        this._params['$skip'] = count.toString();
        return this;
    }

    /**
     * Starts building a filter expression for the OData query.
     * @param callback - A callback function that builds the filter expression using FilterBuilder.
     * @returns The current instance of ODataQueryBuilder.
     */
    filter(callback: (builder: FilterBuilder) => void): ODataQueryBuilder<T> {
        const filterBuilder = new FilterBuilder(this);

        callback(filterBuilder);

        const filterExpression = filterBuilder.toString();
        this.setFilterExpression(filterExpression);

        return this;
    }

    /**
     * Specifies that the OData query should include a count of the total records.
     */
    count(): ODataQueryBuilder<T> {
        this._params['$count'] = 'true';
        return this;
    }

    /**
     * Sets the filter expression for the OData query.
     * @param expression - The filter expression.
     */
    private setFilterExpression(expression: string): ODataQueryBuilder<T> {
        this._filters.push(expression);
        this._params['$filter'] = this._filters.join(' and '); // TODO: need to figure out the and vs or thing here
        return this;
    }

    /**
     * Converts the OData query parameters into a query string.
     * @returns The full query string.
     */
    private toQueryString(): string {
        const query = Object.entries(this._params)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        return `${this._url}?${query}`;
    }

    /**
     * Builds and returns the final query string.
     * @returns The full query string.
     */
    build(): string {
        return this.toQueryString();
    }
}
