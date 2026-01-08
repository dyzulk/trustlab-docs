import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="TrustLab" width="120" className="dark:hidden" />
      <img src="/logo-dark.png" alt="TrustLab" width="120" className="hidden dark:block" />
      <span className="font-semibold text-lg hidden sm:inline">Docs</span>
    </div>
  ),
  logoLink: '/',
  project: {
    link: 'https://github.com/dyzulk/trustlab-docs',
  },
  docsRepositoryBase: 'https://github.com/dyzulk/trustlab-docs/tree/main',
  head: (
    <>
      <link rel="icon" href="/favicon.ico" />
    </>
  ),
  footer: {
    text: 'TrustLab Documentation',
  },
}

export default config
