import { ODataQueryBuilder } from './odataQueryBuilder.js';

export class FilterBuilder {
    private _parent: ODataQueryBuilder | FilterBuilder;
    private _expressions: string[] = [];

    constructor(parent: ODataQueryBuilder | FilterBuilder) {
        this._parent = parent;
    }

    and(): FilterBuilder {
        this._expressions.push('and');
        return this;
    }

    contains(field: string, value: string): FilterBuilder {
        this._expressions.push(`contains(${field}, '${value}')`);
        return this;
    }

    endsWith(field: string, value: string): FilterBuilder {
        this._expressions.push(`endswith(${field}, '${value}')`);
        return this;
    }

    eq(field: string, value: string | number): FilterBuilder {
        this._expressions.push(`${field} eq ${this.formatValue(value)}`);
        return this;
    }

    ge(field: string, value: string | number): FilterBuilder {
        this._expressions.push(`${field} ge ${this.formatValue(value)}`);
        return this;
    }

    gt(field: string, value: string | number): FilterBuilder {
        this._expressions.push(`${field} gt ${this.formatValue(value)}`);
        return this;
    }

    has(field: string, value: string): FilterBuilder {
        this._expressions.push(`${field} has ${value}`);
        return this;
    }

    in(field: string, values: string[]): FilterBuilder {
        const formattedValues = values.map(this.formatValue).join(',');
        this._expressions.push(`${field} in (${formattedValues})`);
        return this;
    }

    le(field: string, value: string | number): FilterBuilder {
        this._expressions.push(`${field} le ${this.formatValue(value)}`);
        return this;
    }

    lt(field: string, value: string | number): FilterBuilder {
        this._expressions.push(`${field} lt ${this.formatValue(value)}`);
        return this;
    }

    ne(field: string, value: string | number): FilterBuilder {
        this._expressions.push(`${field} ne ${this.formatValue(value)}`);
        return this;
    }

    not(): FilterBuilder {
        this._expressions.push('not');
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

    private finalize(): void {
        const expression = this.buildExpression();
        if (this._parent instanceof FilterBuilder) {
            this._parent.addExpression(expression);
        }
    }

    // Ensure the expressions are finalized automatically
    toString(): string {
        this.finalize();
        return this.buildExpression();
    }
}
