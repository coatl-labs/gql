# @coatl/gql

A GraphQL client for Node.js and the browser.

## Requirements

- Node.js 18.0.0 or later (for Fetch API support)
- Any browser with Fetch API support

## Installation

```bash
# using npm
npm install @coatl/gql

# using yarn
yarn add @coatl/gql

# using pnpm
pnpm add @coatl/gql
```

## Features

- [x] Queries and mutations
- [x] Variable interpolation
- [x] Full type safety
- [x] Fragments
- [x] Subscriptions
- [ ] File uploads (multipart/form-data)
- [ ] Directives
- [ ] Custom scalars

## Usage

### Implementing a client

```ts
import { GQLClient } from '@coatl/gql'

export const client = new GQLClient('https://api.example.com/graphql', {
  headers: {
    Authorization: 'Bearer <token>'
  }
})
```

### Queries

```ts
import { client } from './client'

interface User {
  id: string
  name: string
  email: string
}

const users = await client.query<User[]>(`
  users {
    id
    name
    email
  }
`)

console.log(users) // [...]
```

### Mutations

```ts
import { client } from './client'

interface User {
  id: string
  name: string
  email: string
}

interface CreateUserInput {
  name: string
  email: string
}

const userExist = await client.query<User>(`
  # check if the user already exists
  user(email: $email) {
    id
  }
`)

if (userExist) {
  throw new Error('User already exists')
}

const variables = {
  name: 'John Doe',
  email: 'jhon@doe.com'
}

const user = await client.mutation<User, CreateUserInput>(
  `
  createUser(input: $input) {
    id
    name
    email
  }
`,
  variables
)
```
