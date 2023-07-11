const StoryblokClient = require('storyblok-js-client')

const main = async () => {
  const client = new StoryblokClient({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  })

  const { data } = await client.getStory('/se')
  console.log(data.cv)
}

main()
