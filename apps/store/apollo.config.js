module.exports = {
  client: {
    service: 'Octopus-fxevz',
    includes: ['schema.graphql', 'src/graphql/*.graphql'],
    excludes: ['src/services/apollo/generated.ts'],
  },
}
