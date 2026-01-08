import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'
import { Download, Terminal, Smartphone, Shield, Monitor, FileCode, Check, Copy, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

// Interface matching the API response
interface CaCertificate {
    name: string;
    type: string;
    serial: string;
    family_id?: string | null;
    expires_at: string;
    cdn_url?: string | null;
    linux_cdn_url?: string | null;
    der_cdn_url?: string | null;
    bat_cdn_url?: string | null;
    mac_cdn_url?: string | null;
}

const fetcher = (url: string) => axios.get(url).then(res => res.data.data)

export function DynamicInstallationGuide() {
    const { data: certificates, error, isLoading } = useSWR<CaCertificate[]>('https://api.trustlab.dyzulk.com/api/public/ca-certificates', fetcher)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    if (error) return (
        <div className="flex items-center gap-3 p-4 my-4 text-red-600 bg-red-50 border border-red-100 rounded-lg dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="text-sm">
                <span className="font-semibold">Unable to load live certificates.</span>
                <p className="mt-1 opacity-90">Please ensure you can access <code>api.trustlab.dyzulk.com</code>.</p>
            </div>
        </div>
    )

    if (isLoading || !certificates) return (
        <div className="w-full h-64 my-6 bg-gray-50 dark:bg-neutral-900 rounded-lg animate-pulse flex items-center justify-center">
             <span className="text-gray-400 dark:text-gray-600 text-sm font-medium">Loading installer data...</span>
        </div>
    )

    const root = certificates.find(c => c.type === 'root')
    const intermediates = certificates.filter(c => c.type !== 'root')

    const tabs = [
        { id: 'windows', label: 'Windows', icon: Monitor },
        { id: 'mac', label: 'macOS', icon: Monitor }, // Changed icon to Monitor for consistency or distinctiveness? User has 'Smartphone' for Mac in previous code, likely mistake. I will use Monitor or Laptop. Actually let's keeps consistent.
        { id: 'ios', label: 'iOS', icon: Smartphone },
        { id: 'android', label: 'Android', icon: Smartphone },
        { id: 'linux', label: 'Linux (CLI)', icon: Terminal },
    ]

    const activeTab = tabs[selectedIndex].id as 'windows' | 'mac' | 'ios' | 'linux' | 'android'

    return (
        <div className="mt-8 mb-12">
            {/* Tabs Header - Nextra Style (Bottom Border) */}
            <div className="flex overflow-x-auto border-b border-gray-200 dark:border-neutral-800 scrollbar-hide">
                {tabs.map((tab, idx) => {
                    const isActive = selectedIndex === idx
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedIndex(idx)}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap",
                                isActive 
                                    ? "text-blue-600 dark:text-blue-400" 
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-900/50"
                            )}
                        >
                            <Icon className={clsx("w-4 h-4", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                            {tab.label}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px] mt-6 animate-in fade-in slide-in-from-bottom-1 duration-200">
                <div className="overflow-x-auto border border-gray-200 dark:border-neutral-800 rounded-lg shadow-sm bg-white dark:bg-neutral-950">
                    <table className="w-full text-sm text-left min-w-[600px]">
                        <thead className="bg-gray-50/50 dark:bg-neutral-900/50 border-b border-gray-200 dark:border-neutral-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 w-1/3">Certificate</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Raw Format</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                                    {activeTab === 'linux' ? 'One-Liner Installer' : 
                                     activeTab === 'android' ? 'Alternative (.der)' :
                                     activeTab === 'ios' ? 'Config Profile' :
                                     activeTab === 'mac' ? 'Config Profile' :
                                     'Auto-Installer'}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                            {/* Root Row */}
                            {root && (
                                <tr className="group hover:bg-gray-50/50 dark:hover:bg-neutral-900/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100">Root CA</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{root.name}</div>
                                                <div className="text-[10px] text-gray-400 mt-1">Exp: {new Date(root.expires_at).getFullYear()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={root.cdn_url || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm">
                                            <Download className="w-3.5 h-3.5" />
                                            Download .crt
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <InstallerCell cert={root} os={activeTab} handleCopy={handleCopy} copiedId={copiedId} />
                                    </td>
                                </tr>
                            )}

                            {/* Intermediates Rows */}
                            {intermediates.map(cert => (
                                <tr key={cert.serial} className="group hover:bg-gray-50/50 dark:hover:bg-neutral-900/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                             <div className="mt-1 p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                                                <FileCode className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100">Intermediate CA</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{cert.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={cert.cdn_url || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm">
                                            <Download className="w-3.5 h-3.5" />
                                            Download .crt
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <InstallerCell cert={cert} os={activeTab} handleCopy={handleCopy} copiedId={copiedId} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Contextual Instructions Footer - Detailed Manual Steps */}
                <div className="mt-6 border-t border-gray-100 dark:border-neutral-800 pt-6">
                     {activeTab === 'windows' && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Monitor className="w-4 h-4 text-blue-500" />
                                Manual Installation (Raw .crt)
                            </h4>
                            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
                                <div className="space-y-2">
                                    <strong className="text-gray-800 dark:text-gray-200 block">For Root CA:</strong>
                                    <ol className="list-decimal pl-4 space-y-1 marker:text-gray-400">
                                        <li>Double-click <code>dydev-its-true.crt</code> &rarr; <strong>Install Certificate</strong>.</li>
                                        <li>Select <strong>Local Machine</strong> (requires Admin).</li>
                                        <li>Select "Place all certificates in the following store".</li>
                                        <li>Browse & select <strong>Trusted Root Certification Authorities</strong>.</li>
                                    </ol>
                                </div>
                                <div className="space-y-2">
                                    <strong className="text-gray-800 dark:text-gray-200 block">For Intermediates:</strong>
                                    <ol className="list-decimal pl-4 space-y-1 marker:text-gray-400">
                                        <li>Double-click the <code>.crt</code> file.</li>
                                        <li>Follow the same steps but choose <strong>Intermediate Certification Authorities</strong> as the store.</li>
                                    </ol>
                                </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-3 rounded-md border border-blue-100 dark:border-blue-800 text-xs">
                                <strong>Recommended: Auto-Installer Script (.bat)</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-0.5 opacity-90">
                                    <li>Download the <code>.bat</code> script from the table above.</li>
                                    <li><strong>Right-click</strong> the file and select <strong>"Run as Administrator"</strong>.</li>
                                    <li>The script will automatically install both Root and Intermediate CAs.</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'mac' && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Monitor className="w-4 h-4 text-gray-500" />
                                Installation Methods
                            </h4>
                            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
                                <div className="space-y-2">
                                    <strong className="text-gray-800 dark:text-gray-200 block">Method A: Config Profile (Recommended)</strong>
                                    <ol className="list-decimal pl-4 space-y-1 marker:text-gray-400">
                                        <li>Download the <code>.mobileconfig</code> file.</li>
                                        <li>Go to <strong>System Settings</strong> &rarr; <strong>Privacy & Security</strong>.</li>
                                        <li>Scroll down to <strong>Profiles</strong> and double-click the profile to install.</li>
                                    </ol>
                                </div>
                                <div className="space-y-2">
                                    <strong className="text-gray-800 dark:text-gray-200 block">Method B: Keychain (Raw .crt)</strong>
                                    <ol className="list-decimal pl-4 space-y-1 marker:text-gray-400">
                                        <li>Open <strong>Keychain Access</strong>.</li>
                                        <li>Drag the <code>.crt</code> files into the <strong>System</strong> keychain.</li>
                                        <li>Double-click the Root CA &rarr; expand <strong>Trust</strong>.</li>
                                        <li>Set "When using this certificate" to <strong>Always Trust</strong>.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ios' && (
                        <div className="space-y-4">
                             <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-gray-500" />
                                Installing on iOS (iPhone/iPad)
                            </h4>
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-100 dark:border-amber-900/30 text-xs text-amber-900 dark:text-amber-100 mb-2">
                                <strong>Important:</strong> Installing on iOS is a two-step process (Install Profile &rarr; Enable Trust).
                            </div>
                            <ol className="list-decimal pl-4 space-y-2 text-sm text-gray-600 dark:text-gray-400 marker:text-gray-400">
                                <li>Tap <strong>Auto-Installer Script</strong> to download the configuration profile.</li>
                                <li>Open <strong>Settings</strong>. Tap the <strong>"Profile Downloaded"</strong> banner at the top.</li>
                                <li>Tap <strong>Install</strong> and enter your passcode.</li>
                                <li><strong>Required Step:</strong> Go to <strong>Settings</strong> &rarr; <strong>General</strong> &rarr; <strong>About</strong> &rarr; <strong>Certificate Trust Settings</strong>.</li>
                                <li>Under "Enable full trust for root certificates", toggle on the switch for <strong>"{root?.name || 'TrustLab Root CA'}"</strong>.</li>
                            </ol>
                        </div>
                    )}

                    {activeTab === 'android' && (
                        <div className="space-y-4">
                             <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-green-500" />
                                Installing on Android
                            </h4>
                            <ol className="list-decimal pl-4 space-y-2 text-sm text-gray-600 dark:text-gray-400 marker:text-gray-400">
                                <li>Download the <code>.crt</code> file (or <code>.der</code> if your specific Android version requires it).</li>
                                <li>Go to **Settings** &rarr; **Security** &rarr; **Encryption & Credentials**.</li>
                                <li>Tap **Install a certificate** &rarr; **CA Certificate**.</li>
                                <li>Select "Install anyway" if prompted, then verify your identity (PIN/Fingerprint).</li>
                                <li>Select the downloaded file.</li>
                            </ol>
                        </div>
                    )}

                    {activeTab === 'linux' && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-gray-500" />
                                Manual CLI Installation
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                If you cannot use the one-liner, follow these standard steps (Debian/Ubuntu example):
                            </p>
                            <div className="bg-gray-100 dark:bg-neutral-900 p-4 rounded-md border border-gray-200 dark:border-neutral-800 overflow-x-auto">
<pre className="text-xs font-mono text-gray-700 dark:text-gray-300">
{`# 1. Copy certificates to local store
sudo cp *.crt /usr/local/share/ca-certificates/

# 2. Update the CA store
sudo update-ca-certificates`}
</pre>
                            </div>
                             <p className="text-xs text-gray-400 italic">
                                Note: For RHEL/CentOS, copy to <code>/etc/pki/ca-trust/source/anchors/</code> and run <code>update-ca-trust</code>.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Sub-component for cleaner render logic
function InstallerCell({ cert, os, handleCopy, copiedId }: { cert: CaCertificate, os: string, handleCopy: Function, copiedId: string | null }) {
    if (os === 'windows' && cert.bat_cdn_url) {
        return (
            <a href={cert.bat_cdn_url} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                <Terminal className="w-3.5 h-3.5" />
                Installer Script (.bat)
            </a>
        )
    }
    // Shared Logic for macOS AND iOS using the same mobileconfig
    if ((os === 'mac' || os === 'ios') && cert.mac_cdn_url) {
        return (
            <a href={cert.mac_cdn_url} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md transition-colors">
                <Smartphone className="w-3.5 h-3.5" />
                Config Profile
            </a>
        )
    }
    if (os === 'android' && cert.der_cdn_url) {
        return (
            <a href={cert.der_cdn_url} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-md hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                <Download className="w-3.5 h-3.5" />
                Download .der
            </a>
        )
    }
    if (os === 'linux' && cert.linux_cdn_url) {
        const cmd = `curl -sL ${cert.linux_cdn_url} | sudo bash`
        const isCopied = copiedId === cert.serial
        return (
            <div className="flex items-center gap-2 max-w-md group">
                <code className="flex-1 bg-gray-100 dark:bg-neutral-900 px-3 py-1.5 rounded-md text-[11px] font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-neutral-800 truncate select-all">
                    {cmd}
                </code>
                <button 
                    onClick={() => handleCopy(cmd, cert.serial)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    title="Copy command"
                >
                    {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
        )
    }
    return <span className="text-gray-400 text-xs italic">Not available</span>
}
