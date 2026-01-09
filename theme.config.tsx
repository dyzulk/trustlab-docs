import React from 'react'
import { useRouter } from 'next/router'
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
  i18n: [
    { locale: 'en', text: 'English' },
    { locale: 'id', text: 'Bahasa Indonesia' }
  ],
  project: {
    link: 'https://github.com/dyzulk/trustlab-docs',
  },
  chat: {
    link: 'https://trustlab.dyzulk.com/dashboard',
    icon: (
      <span className="text-sm font-semibold bg-blue-600/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-600/20 transition-colors">
        Go to Dashboard →
      </span>
    )
  },
  docsRepositoryBase: 'https://github.com/dyzulk/trustlab-docs/tree/main',
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath.includes('/index') || asPath.endsWith('/en/') || asPath.endsWith('/id/')) {
      return {
        titleTemplate: 'TrustLab - Private Certificate Authority'
      }
    }
    return {
      titleTemplate: '%s – TrustLab Docs'
    }
  },
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
