import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Link from 'next/link'

// Global lock to prevent race conditions. 
// With a hard reload strategy, this lock effectively persists until the page is unloaded.
let isTransitioning = false

const LanguageSwitcher = () => {
  const { asPath } = useRouter()
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    // Sync local state with global lock on mount
    setDisabled(isTransitioning)
  }, [])

  const isId = asPath.startsWith('/id')
  
  const toggleLanguage = () => {
    if (isTransitioning) return
    
    // Prevent default activity if confirmed
    isTransitioning = true
    setDisabled(true)
    
    let newPath = asPath
    // Robust path replacement logic
    if (isId) {
        newPath = asPath.replace('/id', '/en')
    } else {
        // Handle implicit default or explicit /en
        if (asPath.startsWith('/en')) {
             newPath = asPath.replace('/en', '/id')
        } else {
             // If path is root '/' or other, prepend '/id'
             // Assuming structural parity, / -> /id
             newPath = '/id' + (asPath === '/' ? '' : asPath)
        }
    }
    
    // Use hard reload to ensure clean sidebar state for static exports
    if (typeof window !== 'undefined') {
        window.location.href = newPath
    }
  }

  return (
    <button
      onClick={toggleLanguage}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all font-medium text-xs sm:text-sm border border-neutral-200 dark:border-neutral-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isId ? (
        <>🇮🇩 <span className="hidden xs:inline">Bahasa Indonesia</span></>
      ) : (
        <>🇺🇸 <span className="hidden xs:inline">English</span></>
      )}
      <span className="opacity-40 ml-1">⇄</span>
    </button>
  )
}

const config: DocsThemeConfig = {
  logo: () => {
    const { asPath } = useRouter()
    const isId = asPath.startsWith('/id')
    const homePath = isId ? '/id' : '/en'
    const guidePath = isId ? '/id/guide' : '/en/guide'
    const devPath = isId ? '/id/developer' : '/en/developer'

    const guideTitle = isId ? 'Panduan Pengguna' : 'User Guide'
    const devTitle = isId ? 'Developer API' : 'Developer API'

    return (
      <div className="flex items-center gap-8">
        <Link href={homePath} className="flex items-center gap-2 hover:opacity-75 transition-opacity">
          <img src="/logo.png" alt="TrustLab" width="120" className="dark:hidden" />
          <img src="/logo-dark.png" alt="TrustLab" width="120" className="hidden dark:block" />
          <span className="font-semibold text-lg hidden sm:inline">Docs</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <Link href={guidePath} className={asPath.includes('/guide') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors'}>
            {guideTitle}
          </Link>
          <Link href={devPath} className={asPath.includes('/developer') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors'}>
            {devTitle}
          </Link>
        </div>
      </div>
    )
  },
  logoLink: false,
  navbar: {
    extraContent: LanguageSwitcher
  },
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
