# SOQL to GraphQL

This library combines 2 powerful libraries:
- [SOQL Parser JS](https://github.com/jetstreamapp/soql-parser-js) 
- [JSON to GraphQL](https://www.npmjs.com/package/json-to-graphql-query)
To transform your SOQL into GraphQL

[Online demo](https://sf-explorer.github.io/documentation/docs/Query/GraphQL/#playground)

## Installation

```
npm i @sf-explorer/soql-to-graphql
```

## Usage

### Query and sub query

```js
var converter = require ('@sf-explorer/soql-to-graphql')

console.log(converter('Select Id, Name, (select Id from Opportunities) from Account limit 3'))
```

```
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

### Query with variables

```js
var converter = require ('@sf-explorer/soql-to-graphql')

const res = converter(`select Id, Name, (select Name from Opportunities) 
    from Account 
        where Name like ':criteria' 
        order by CreationDate
        limit 3`), {criteria:'String="%"'})

console.log(res)
```

```
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
