import type { IncomingMessage } from 'http'
import type { Fields } from 'formidable'
import { IncomingForm } from 'formidable'

export async function getFormData(req: IncomingMessage) {
  return new Promise<Fields>((resolve, reject) => {
    const form = new IncomingForm()

    form.parse(req, (err, fields) => {
      if (err) {
        reject(err)
      }

      resolve(fields)
    })
  })
}
