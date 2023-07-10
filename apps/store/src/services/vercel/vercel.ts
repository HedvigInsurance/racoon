const DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK

type VercelDeployHookResponse = {
  job: {
    createdAt: number
  }
}

export class Vercel {
  public static async triggerDeploy(): Promise<void> {
    if (DEPLOY_HOOK === undefined) throw new Error('Missing Vercel deploy hook')

    const response = await fetch(DEPLOY_HOOK, { method: 'POST' })

    if (!response.ok) {
      throw new Error(`Failed to trigger Vercel deploy ${response.status} ${response.statusText}`)
    } else {
      const data = (await response.json()) as VercelDeployHookResponse
      console.info(`Vercel deploy triggered: ${data.job.createdAt}`)
    }
  }
}
