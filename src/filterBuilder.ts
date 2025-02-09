import { ODataQueryBuilder } from './odataQueryBuilder.js';

export class FilterBuilder {
    private _parent: ODataQueryBuilder | FilterBuilder;
    private _expressions: string[] = [];

    constructor(parent: ODataQueryBuilder | FilterBuilder) {
        this._parent = parent;
    }

    eq(field: string, value: string | number): FilterBuilder {
        this._expressions.push(`${field} eq ${this.formatValue(value)}`);
        return this;
    }

    ne(field: string, value: string | number): FilterBuilder {
        this._expressions.push(`${field} ne ${this.formatValue(value)}`);
        return this;
    }

    gt(field: string, value: string | number): FilterBuilder {
        this._expressions.push(`${field} gt ${this.formatValue(value)}`);
        return this;
    }

    lt(field: string, value: string | number): FilterBuilder {
        this._expressions.push(`${field} lt ${this.formatValue(value)}`);
        return this;
    }

    ge(field: string, value: string | number): FilterBuilder {
        this._expressions.push(`${field} ge ${this.formatValue(value)}`);
        return this;
    }

    le(field: string, value: string | number): FilterBuilder {
        this._expressions.push(`${field} le ${this.formatValue(value)}`);
        return this;
    }

    contains(field: string, value: string): FilterBuilder {
        this._expressions.push(`contains(${field}, '${value}')`);
        return this;
    }

    and(): FilterBuilder {
        this._expressions.push('and');
        return this;
    }

    or(): FilterBuilder {
        this._expressions.push('or');
        return this;
    }

    group(callback: (builder: FilterBuilder) => void): FilterBuilder {
        const groupBuilder = new FilterBuilder(this);

        callback(groupBuilder);

        this._expressions.push(`(${groupBuilder.buildExpression()})`);

        return this;
    }

    build(): ODataQueryBuilder | FilterBuilder {
        const expression = this.buildExpression();
        if (this._parent instanceof ODataQueryBuilder) {
            return this._parent.setFilterExpression(expression);
        } else if (this._parent instanceof FilterBuilder) {
            return this._parent.addExpression(expression);
        }
        return this;
    }

    private buildExpression(): string {
        return this._expressions.join(' ');
    }

    private addExpression(expression: string): FilterBuilder {
        this._expressions.push(expression);
        return this;
    }

    private formatValue(value: string | number): string {
        return typeof value === 'string' ? `'${value}'` : value.toString();
    }
}
