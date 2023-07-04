const StoryblokClient = require('storyblok-js-client')

console.log('Publish Storyblok cache version in Edge config')

const manageApiUrl = process.env.EDGE_CONFIG_MANAGE_API_URL
if (!manageApiUrl) {
  throw new Error('EDGE_CONFIG_MANAGE_API_URL not configured')
}

const manageApiToken = process.env.EDGE_CONFIG_MANAGE_API_TOKEN
if (!manageApiToken) {
  throw new Error('EDGE_CONFIG_MANAGE_API_TOKEN not configured')
}

const main = async () => {
  const client = new StoryblokClient({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  })

  const { data } = await client.getStory('/se')
  console.log(`Latest cache version: ${data.cv}`)

  const response = await fetch(manageApiUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${manageApiToken}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          operation: 'upsert',
          key: 'storyblokCacheVersion',
          value: data.cv,
        },
      ],
    }),
  })

  if (response.ok) {
    console.log('Cache version updated in Edge config')
  } else {
    console.error('Failed to update cache version in Edge config')
    console.error(await response.text())
    process.exit(1)
  }
}

main()
