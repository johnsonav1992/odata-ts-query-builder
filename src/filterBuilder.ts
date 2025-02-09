import { ODataQueryBuilder } from './odataQueryBuilder.js';

export class FilterBuilder<TEntity = any> {
    private _parent: ODataQueryBuilder | FilterBuilder;
    private _expressions: string[] = [];

    constructor(parent: ODataQueryBuilder | FilterBuilder) {
        this._parent = parent;
    }

    and(): FilterBuilder {
        this._expressions.push('and');
        return this;
    }

    contains(field: keyof TEntity, value: string): FilterBuilder {
        this._expressions.push(`contains(${String(field)}, '${value}')`);
        return this;
    }

    endsWith(field: keyof TEntity, value: string): FilterBuilder {
        this._expressions.push(`endswith(${String(field)}, '${value}')`);
        return this;
    }

    eq(field: keyof TEntity, value: string | number): FilterBuilder {
        this._expressions.push(
            `${String(field)} eq ${this.formatValue(value)}`
        );
        return this;
    }

    ge(field: keyof TEntity, value: string | number): FilterBuilder {
        this._expressions.push(
            `${String(field)} ge ${this.formatValue(value)}`
        );
        return this;
    }

    gt(field: keyof TEntity, value: string | number): FilterBuilder {
        this._expressions.push(
            `${String(field)} gt ${this.formatValue(value)}`
        );
        return this;
    }

    has(field: keyof TEntity, value: string): FilterBuilder {
        this._expressions.push(`${String(field)} has ${value}`);
        return this;
    }

    in(field: keyof TEntity, values: string[]): FilterBuilder {
        const formattedValues = values.map(this.formatValue).join(',');
        this._expressions.push(`${String(field)} in (${formattedValues})`);
        return this;
    }

    le(field: keyof TEntity, value: string | number): FilterBuilder {
        this._expressions.push(
            `${String(field)} le ${this.formatValue(value)}`
        );
        return this;
    }

    lt(field: keyof TEntity, value: string | number): FilterBuilder {
        this._expressions.push(
            `${String(field)} lt ${this.formatValue(value)}`
        );
        return this;
    }

    ne(field: keyof TEntity, value: string | number): FilterBuilder {
        this._expressions.push(
            `${String(field)} ne ${this.formatValue(value)}`
        );
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

    toString(): string {
        this.finalize();

        return this.buildExpression();
    }
}
