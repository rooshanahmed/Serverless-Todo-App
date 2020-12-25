const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb')
const q = faunadb.query

const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Mutation {
    addTodo(task: String!): Todo
  }
  type Todo {
    id: ID!
    task: String!
  }
`

const resolvers = {
  Query: {
    todos: async(root, args, context) => {
      try {
        let client = new faunadb.Client({ secret: 'fnAD8ATydQACAEuPVesaa87txgiZK3NsYdERgEvy' });

        let result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index('task'))),
            q.Lambda((x) => q.Get(x)),
          )
        )
        console.log(result.data)
        return result.data.map(d => {
          return {
            id: d.ts,
            task: d.data.task
          }
        })
      }
      catch(err){
        console.log(err)
      }
    },
    // authorByName: (root, args) => {
    //   console.log('hihhihi', args.name)
    //   return authors.find((author) => author.name === args.name) || 'NOTFOUND'
    // },
  },
  Mutation: {
    addTodo: async(_,{ task }) => {
      try {
        let client = new faunadb.Client({ secret: 'fnAD8ATydQACAEuPVesaa87txgiZK3NsYdERgEvy' });

        let result = await client.query(
          q.Create(q.Collection('todos'), { data: { task: task } })
        )
        return result.ref.data;
      }
      catch(err){
        console.log(err)
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
