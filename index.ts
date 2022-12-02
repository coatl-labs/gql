type Res<T = any> = T extends [...infer U]
  ? { [K in keyof U]: Res<U[K]> }
  : T extends { [key: string]: infer U }
  ? { [K in keyof T]: Res<T[K]> }
  : T

type GQLResponse<T> = Promise<Res<T>>

interface GraphQLClient {
  query<T>(query: string): GQLResponse<T>
  mutation<T>(query: string): GQLResponse<T>
}

interface GQLClientOptions {
  headers?: Record<string, string>
  credentials?: 'omit' | 'same-origin' | 'include'
}

export class GQLClient implements GraphQLClient {
  constructor(
    private endpoint: string,
    private options: GQLClientOptions = {}
  ) {}

  async #request(query: string, variables?: Record<string, any>) {
    const response = await fetch(this.endpoint, {
      ...this.options,
      method: 'POST',
      body: JSON.stringify({ query, variables })
    })
    return response.json()
  }

  #parseQuery(query: string, variables: Record<string, string>): string {
    const parsedQuery = query.replace(
      /(\w+): ?(\w+)/g,
      (_, key, value) => `${key}: "${variables[value]}"`
    )
    return parsedQuery
  }

  async query<T>(
    query: string,
    variables?: Record<string, any>
  ): GQLResponse<T> {
    const queryWrapper = `query { ${query} }`
    let queryStr: string
    if (variables) {
      queryStr = this.#parseQuery(queryWrapper, variables)
    } else {
      queryStr = queryWrapper
    }
    const { data, errors } = await this.#request(queryStr)
    if (errors) {
      throw new Error(errors[0].message)
    } else {
      return data
    }
  }

  async mutation<T>(
    query: string,
    variables?: Record<string, any>
  ): GQLResponse<T> {
    const queryWrapper = `mutation { ${query} }`
    let queryStr: string
    if (variables) {
      queryStr = this.#parseQuery(queryWrapper, variables)
    } else {
      queryStr = queryWrapper
    }
    const { data, errors } = await this.#request(queryStr)
    if (errors) {
      throw new Error(errors[0].message)
    } else {
      return data
    }
  }
}
