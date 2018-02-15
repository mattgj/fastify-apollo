const apolloGraphqlFastify = require('./graphql')
const apolloGraphiqlFastify = require('./graphiql')
const fastifyPlugin = require('fastify-plugin')

// Avoid `fastify-plugin` overriding prefix
const fp = plugin =>
  fastifyPlugin(function (fastify, opts, next) {
    fastify.register(plugin, opts, err => {
      next(err)
    })

    next()
  }, '^1.0.0')

function plugin (fastify, { graphql, graphiql, printSchema }, next) {
  fastify
    .register(apolloGraphiqlFastify, graphiql)
    .register(apolloGraphqlFastify, Object.assign({ printSchema }, graphql))

  next()
}

/**
 * @typedef {function} ApolloServerFastify
 * @extends fastify.FastifyMiddleware
 */
const apolloServerFastify = fp(plugin)

/**
 * @memberof ApolloServerFastify
 * @static
 * @func graphiqlFastify
 */
apolloServerFastify.graphiqlFastify = fp(apolloGraphiqlFastify)

/**
 * @memberof ApolloServerFastify
 * @static
 * @func graphqlFastify
 */
apolloServerFastify.graphqlFastify = fp(apolloGraphqlFastify)

module.exports = apolloServerFastify
