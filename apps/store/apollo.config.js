module.exports = {
  client: {
    service: 'Octopus-fxevz@staging',
    includes: ['schema.graphql', 'src/**/*.graphql'],
    excludes: ['src/services/apollo/generated.ts'],
  },
}
