const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");

const resolvers = {
  Query: {
    favorites: (_, args, context, info) => {
      return context.prisma.query.favorites(
        {
          where: {
            description_contains: args.searchString
          }
        },
        info
      );
      // ...
    },
    user: (_, args, context, info) => {
      return context.prisma.query.user(
        {
          where: {
            id: args.id
          }
        },
        info
      );
    }
  },
  Mutation: {
    createFavorite: (_, args, context, info) => {
      return context.prisma.mutation.createFavorite({
        data: {
          description: args.description,
          link: args.description,
          user: {
            connect: {
              id: args.userId
            }
          }
        }
      });
    },
    updateFavorite: (_, args, context, info) => {
      return context.prisma.mutation.updateFavorite({
        where: {
          id: args.id
        },
        data: {
          description: args.description,
          link: args.link
        }
      });
    },

    signup: (_, args, context, info) => {
      return context.prisma.mutation.createUser(
        {
          data: {
            name: args.name,
            email: args.email
          }
        },
        info
      );
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: "src/generated/prisma.graphql",
      endpoint: process.env.PRISMA_ENDPOINT
    })
  })
});
server.start(() => console.log(`GraphQL server is running on http://localhost:4000`));
