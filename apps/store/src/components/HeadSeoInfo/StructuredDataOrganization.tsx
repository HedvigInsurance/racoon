export const StructuredDataOrganization = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Hedvig',
        url: 'https://www.hedvig.com',
        logo: 'https://www.hedvig.com/apple-touch-icon.png',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Malmskillnadsgatan 32',
          addressLocality: 'Stockholm',
          postalCode: '111 51',
          addressCountry: 'SE',
        },
      }),
    }}
  />
)
