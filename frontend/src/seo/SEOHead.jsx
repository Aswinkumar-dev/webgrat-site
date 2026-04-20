import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function SEOHead({ title, description, canonical, noindex = false, schema }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" type="image/png" href="/src/assets/Logo.png" />
      <link rel="shortcut icon" type="image/png" href="/src/assets/Logo.png" />
      <link rel="apple-touch-icon" href="/src/assets/Logo.png" />
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex" />}
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  )
}
