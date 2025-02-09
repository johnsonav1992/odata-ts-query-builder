import { FilterBuilder } from './filterBuilder.js';
import type { ODataQueryOption } from './types/types.js';

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
 *     .filter()
 *     .eq('Age', 30)
 *     .and()
 *     .eq('Gender', 'Male')
 *     .build();
 *
 * // The resulting query string will be:
 * // "https://example.com/odata?$filter=Age eq 30 and Gender eq 'Male'"
 */
export class ODataQueryBuilder {
    /**
     * The base URL for the OData service.
     */
    private _url: string;

    /**
     * The parameters for the OData query.
     */
    private _params: Record<ODataQueryOption, string> =
        {} as typeof this._params;

    /**
     * The filters for the OData query.
     */
    private _filters: string[] = [];

    /**
     * Creates an instance of ODataQueryBuilder.
     * @param baseUrl - The base URL for the OData service.
     */
    constructor(baseUrl: string) {
        this._url = baseUrl;
    }

    /**
     * Specifies the fields to select in the OData query.
     * @param fields - The fields to select.
     * @returns The current instance of ODataQueryBuilder.
     */
    select(fields: string[]) {
        this._params['$select'] = fields.join(',');
        return this;
    }

    /**
     * Specifies the fields to expand in the OData query.
     * @param fields - The fields to expand.
     * @returns The current instance of ODataQueryBuilder.
     */
    expand(fields: string[]) {
        this._params['$expand'] = fields.join(',');
        return this;
    }

    /**
     * Specifies the field to order by in the OData query.
     * @param field - The field to order by.
     * @param direction - The direction to order by (asc or desc).
     */
    orderBy(
        field: string,
        direction: 'asc' | 'desc' = 'asc'
    ): ODataQueryBuilder {
        this._params['$orderby'] = `${field} ${direction}`;
        return this;
    }

    /**
     * Specifies the number of records to return in the OData query.
     * @param count - The number of records to return.
     */
    top(count: number): ODataQueryBuilder {
        this._params['$top'] = count.toString();
        return this;
    }

    /**
     * Specifies the number of records to skip in the OData query.
     * @param count - The number of records to skip.
     */
    skip(count: number): ODataQueryBuilder {
        this._params['$skip'] = count.toString();
        return this;
    }

    /**
     * Starts building a filter expression for the OData query.
     * @returns A new instance of `FilterBuilder`.
     */
    filter() {
        return new FilterBuilder(this);
    }

    /**
     * Specifies that the OData query should include a count of the total records.
     */
    count() {
        this._params['$count'] = 'true';
        return this;
    }

    /**
     * Sets the filter expression for the OData query.
     * @param expression - The filter expression.
     */
    setFilterExpression(expression: string): ODataQueryBuilder {
        this._filters.push(expression);
        this._params['$filter'] = this._filters.join(' and ');
        return this;
    }

    toQueryString(): string {
        const query = Object.entries(this._params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        return `${this._url}?${query}`;
    }

    build(): string {
        return this.toQueryString();
    }
}
