import { test, expect } from 'vitest';
import { ODataQueryBuilder } from '../odataQueryBuilder.js';

const url = 'http://www.example.com/Users';

test('should build a simple query', () => {
    const query = new ODataQueryBuilder(url).select(['Name', 'Age']).build();

    expect(query).toBe('http://www.example.com/Users?$select=Name,Age');
});

test('should build a query with filter', () => {
    const query = new ODataQueryBuilder(url)
        .select(['Name', 'Age'])
        .filter((f) => f.gt('Age', 30))
        .build();

    expect(query).toBe(
        'http://www.example.com/Users?$select=Name,Age&$filter=Age gt 30'
    );
});

test('should build a query with order by', () => {
    const query = new ODataQueryBuilder(url)
        .select(['Name', 'Age'])
        .orderBy('Name', 'desc')
        .build();

    expect(query).toBe(
        'http://www.example.com/Users?$select=Name,Age&$orderby=Name desc'
    );
});

test('should build a query with top', () => {
    const query = new ODataQueryBuilder(url)
        .select(['Name', 'Age'])
        .top(10)
        .build();

    expect(query).toBe('http://www.example.com/Users?$select=Name,Age&$top=10');
});

test('should build a query with skip', () => {
    const query = new ODataQueryBuilder(url)
        .select(['Name', 'Age'])
        .skip(5)
        .build();

    expect(query).toBe('http://www.example.com/Users?$select=Name,Age&$skip=5');
});
