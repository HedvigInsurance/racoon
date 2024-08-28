export const sleep = (duration: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, duration))

export const tickAsync = () => sleep(0)
