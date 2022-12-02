export class GQLClient {
    endpoint;
    options;
    constructor(endpoint, options = {}) {
        this.endpoint = endpoint;
        this.options = options;
    }
    async #request(query, variables) {
        const response = await fetch(this.endpoint, {
            ...this.options,
            method: 'POST',
            body: JSON.stringify({ query, variables })
        });
        return response.json();
    }
    #parseQuery(query, variables) {
        const parsedQuery = query.replace(/(\w+): ?(\w+)/g, (_, key, value) => `${key}: "${variables[value]}"`);
        return parsedQuery;
    }
    async query(query, variables) {
        const queryWrapper = `query { ${query} }`;
        let queryStr;
        if (variables) {
            queryStr = this.#parseQuery(queryWrapper, variables);
        }
        else {
            queryStr = queryWrapper;
        }
        const { data, errors } = await this.#request(queryStr);
        if (errors) {
            throw new Error(errors[0].message);
        }
        else {
            return data;
        }
    }
    async mutation(query, variables) {
        const queryWrapper = `mutation { ${query} }`;
        let queryStr;
        if (variables) {
            queryStr = this.#parseQuery(queryWrapper, variables);
        }
        else {
            queryStr = queryWrapper;
        }
        const { data, errors } = await this.#request(queryStr);
        if (errors) {
            throw new Error(errors[0].message);
        }
        else {
            return data;
        }
    }
}
