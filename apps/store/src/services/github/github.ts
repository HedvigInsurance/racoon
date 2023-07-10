const OWNER = 'HedvigInsurance'
const REPO = 'racoon'
const WORKFLOW_ID = 'download-translations.yml'
const BRANCH = 'main'

export class GitHub {
  public static async triggerWorkflowDownloadTranslations(): Promise<void> {
    if (process.env.GITHUB_TOKEN === undefined) throw new Error('Missing GitHub token')

    // Docs: https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#create-a-workflow-dispatch-event
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_ID}/dispatches`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({ ref: BRANCH }),
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to trigger workflow ${response.status} ${response.statusText}`)
    }
  }
}
