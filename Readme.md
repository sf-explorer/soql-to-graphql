# SOQL to GraphQL

> Transform your SOQL into GraphQL with ease

![logo](./logo.png)

Having challenges with GraphQL syntax? Already an SOQL ninja 🥷🏿? `soql-to-graphql` is for you.

Check out the [Playground](https://sf-explorer.github.io/documentation/docs/Query/GraphQL/#playground)

## Installation

```
npm i @sf-explorer/soql-to-graphql
```

## Usage

### Query and sub query

```js
var converter = require('@sf-explorer/soql-to-graphql').default

console.log(converter('Select Id, Name, (select Id from Opportunities) from Account limit 3'))
```

```js
{
  uiapi {
    query {
      Account(first: 3) {
        edges {
          node {
            Id
            Name {
              value
            }
            Opportunities {
              edges {
                node {
                  Id
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Query with Apex Binding

```js
var converter = require('@sf-explorer/soql-to-graphql').default

const input = {
  criteria: 'String="%"'
}

const res = converter(`select Id, Name, (select Name from Opportunities) 
    from Account 
        where Name like :criteria
        order by CreationDate
        limit 3`), input)

console.log(res)
```

```js
query ($criteria: String = "%") {
  uiapi {
    query {
      Account(
        first: 3
        where: {Name: {like: $criteria}}
        orderBy: {CreationDate: {order: ASC}}
      ) {
        edges {
          node {
            Id
            Name {
              value
            }
            Opportunities {
              edges {
                node {
                  Name {
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Credits
This utility would be nothing without these 2 powerful libraries:
- [SOQL Parser JS](https://github.com/jetstreamapp/soql-parser-js) 
- [JSON to GraphQL](https://www.npmjs.com/package/json-to-graphql-query)
