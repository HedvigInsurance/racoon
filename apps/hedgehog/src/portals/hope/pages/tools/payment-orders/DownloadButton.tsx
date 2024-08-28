import saveAs from 'file-saver'
import toast from 'react-hot-toast'

interface IDownloadHandler<T> {
  data: T
  transformer?: (input: T) => string | Blob
  fileName?: string
  confirmMessage?: string
  errorMessage?: string
  useConfirmation?: boolean
}
export function downloadHandler<In = string>({
  data,
  transformer,
  fileName,
  confirmMessage,
  errorMessage,
  useConfirmation,
}: IDownloadHandler<In>): void {
  if (!(data instanceof Blob || typeof data === 'string') && !transformer) {
    throw new Error(
      'Please specify a `transformer` if data is not a Blob or string',
    )
  }
  try {
    let confirmed = true
    if (useConfirmation) {
      confirmed = confirm(
        confirmMessage ?? `Are you sure you want to download?`,
      )
    }
    if (confirmed) {
      saveAs(
        transformer ? transformer(data) : (data as Blob),
        fileName || `file_${new Date().toLocaleDateString('sv-SE')}.txt`,
      )
    }
  } catch (e) {
    toast.error(errorMessage ?? `Download Failed: ${(e as Error)?.message}`)
  }
}
