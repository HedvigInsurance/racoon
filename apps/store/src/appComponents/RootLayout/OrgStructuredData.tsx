import { organization } from '@/utils/jsonSchema'

export function OrgStructuredData() {
  return (
    <script
      key="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  )
}
