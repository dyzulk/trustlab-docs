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
    const description = 'TrustLab - Private Certificate Authority'
    const siteName = 'TrustLab Docs'
    
    let titleTemplate = '%s – ' + siteName
    if (asPath.includes('/index') || asPath.endsWith('/en/') || asPath.endsWith('/id/')) {
      titleTemplate = 'TrustLab - Private Certificate Authority'
    }

    return {
      titleTemplate,
      description,
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: `https://docs.trustlab.dyzulk.com${asPath}`,
        siteName: siteName,
        images: [
          {
            url: 'https://docs.trustlab.dyzulk.com/images/logo-outlined.png',
            width: 1200,
            height: 630,
            alt: 'TrustLab Logo',
          },
        ],
      },
      twitter: {
        handle: '@trustlab',
        site: '@trustlab',
        cardType: 'summary_large_image',
      },
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="apple-mobile-web-app-title" content="TrustLab" />
      <link rel="icon" href="/favicon.ico" />
    </>
  ),
  footer: {
    text: 'TrustLab Documentation',
  },
  search: {
    placeholder: 'Search documentation...'
  }
}

export default config
