// yarn node ./scripts/storyblok-analyze-stories.cjs < ./stories.json
const main = async () => {
  const stories = await readStoriesFromStdin()
  for (const story of stories) {
    const { hideMenu, hideFooter } = story.content
    if (hideMenu || hideFooter) {
      console.log(story.full_slug, story.content.component, { hideMenu, hideFooter })
    }
  }
}

const readStoriesFromStdin = async () => {
  let inputData = ''
  for await (const chunk of process.stdin) {
    inputData += chunk
  }
  let json = JSON.parse(inputData)
  if (!Array.isArray(json)) {
    throw new Error('JSON array expected')
  }
  return json
}

main()
