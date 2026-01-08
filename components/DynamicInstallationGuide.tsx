import useSWR from 'swr'
import axios from 'axios'
import { Tab } from '@headlessui/react' // Nextra uses headlessui usually, or we can build simple tabs
import { useState } from 'react'

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

    if (error) return <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-lg">Failed to load live certificates. CLI: <code>curl -sL https://cdn.trustlab.dyzulk.com/ca/bundles/trustlab-all.sh | sudo bash</code></div>
    if (isLoading || !certificates) return <div className="p-4 text-gray-500 animate-pulse bg-gray-50 rounded-lg">Loading dynamic installer links...</div>

    const root = certificates.find(c => c.type === 'root')
    const intermediates = certificates.filter(c => c.type !== 'root')

    // Helper to format the table rows
    const renderTable = (os: 'windows' | 'mac' | 'linux' | 'android') => {
        return (
            <div className="overflow-x-auto my-4 border rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-neutral-900 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="px-6 py-3">Certificate</th>
                            <th className="px-6 py-3">Raw File</th>
                            <th className="px-6 py-3">
                                {os === 'windows' ? 'Auto-Installer Script' : 
                                 os === 'mac' ? 'Configuration Profile' : 
                                 os === 'linux' ? 'One-Liner Installer' : 'Alternative Format'}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {/* ROOT CA */}
                        {root && (
                            <tr className="bg-white dark:bg-neutral-950">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 flex flex-col">
                                    <span>Root CA</span>
                                    <span className="text-xs text-gray-500 font-mono">{root.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <a href={root.cdn_url || '#'} className="text-blue-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">
                                        Download .crt
                                    </a>
                                </td>
                                <td className="px-6 py-4">
                                    {os === 'windows' && root.bat_cdn_url && (
                                        <a href={root.bat_cdn_url} className="text-blue-600 hover:underline">Download .bat</a>
                                    )}
                                    {os === 'mac' && root.mac_cdn_url && (
                                        <a href={root.mac_cdn_url} className="text-blue-600 hover:underline">Download .mobileconfig</a>
                                    )}
                                    {os === 'android' && root.der_cdn_url && (
                                        <a href={root.der_cdn_url} className="text-blue-600 hover:underline">Download .der</a>
                                    )}
                                     {os === 'linux' && root.linux_cdn_url && (
                                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs select-all">
                                            curl -sL {root.linux_cdn_url} | sudo bash
                                        </code>
                                    )}
                                </td>
                            </tr>
                        )}

                        {/* INTERMEDIATES */}
                        {intermediates.map(cert => (
                            <tr key={cert.serial} className="bg-white dark:bg-neutral-950">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 flex flex-col">
                                    <span>Intermediate</span>
                                    <span className="text-xs text-gray-500 font-mono">{cert.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <a href={cert.cdn_url || '#'} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                        Download .crt
                                    </a>
                                </td>
                                <td className="px-6 py-4">
                                     {os === 'windows' && cert.bat_cdn_url && (
                                        <a href={cert.bat_cdn_url} className="text-blue-600 hover:underline">Download .bat</a>
                                    )}
                                    {os === 'mac' && cert.mac_cdn_url && (
                                        <a href={cert.mac_cdn_url} className="text-blue-600 hover:underline">Download .mobileconfig</a>
                                    )}
                                     {os === 'linux' && cert.linux_cdn_url && (
                                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs select-all">
                                            curl -sL {cert.linux_cdn_url} | sudo bash
                                        </code>
                                    )}
                                    {os === 'android' && cert.der_cdn_url && (
                                        <a href={cert.der_cdn_url} className="text-blue-600 hover:underline">Download .der</a>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    const tabs = [
        { id: 'windows', label: 'Windows' },
        { id: 'mac', label: 'macOS' },
        { id: 'android', label: 'Android' },
        { id: 'linux', label: 'Linux (CLI)' },
    ]

    return (
        <div className="mt-6">
            <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800 mb-4 overflow-x-auto">
                {tabs.map((tab, idx) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedIndex(idx)}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                            selectedIndex === idx 
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="min-h-[300px]">
                {/* Windows Tab */}
                {selectedIndex === 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {renderTable('windows')}
                        <div className="space-y-4 text-gray-800 dark:text-gray-200 text-sm mt-4 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border dark:border-white/10">
                            <h4 className="font-bold">Installation Steps (Raw File)</h4>
                            <ol className="list-decimal pl-5 space-y-1">
                                <li>Double-click the downloaded <code>.crt</code> file.</li>
                                <li>Click <strong>Install Certificate</strong>.</li>
                                <li>Select <strong>Local Machine</strong> (requires Admin).</li>
                                <li>Choose "Place all certificates in the following store".</li>
                                <li>Select <strong>Trusted Root Certification Authorities</strong> (for Root) or <strong>Intermediate Certification Authorities</strong> (for Intermediates).</li>
                                <li>FInish.</li>
                            </ol>
                            <p className="text-xs text-gray-500 italic mt-2">*Note: Using the Auto-Installer Script (.bat) handles all of this automatically.*</p>
                        </div>
                    </div>
                )}

                {/* macOS Tab */}
                {selectedIndex === 1 && (
                     <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {renderTable('mac')}
                        <div className="space-y-4 text-gray-800 dark:text-gray-200 text-sm mt-4 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border dark:border-white/10">
                            <h4 className="font-bold">Installation Steps</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Option 1 (Profile):</strong> Download <code>.mobileconfig</code>, go to <em>System Settings &gt; Privacy & Security &gt; Profiles</em> to install.</li>
                                <li><strong>Option 2 (Raw):</strong> Download <code>.crt</code>, open in <strong>Keychain Access</strong>, then set Trust settings to <strong>Always Trust</strong>.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Android Tab */}
                 {selectedIndex === 2 && (
                     <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {renderTable('android')}
                        <div className="space-y-4 text-gray-800 dark:text-gray-200 text-sm mt-4 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border dark:border-white/10">
                            <h4 className="font-bold">Installation Steps</h4>
                            <ol className="list-decimal pl-5 space-y-1">
                                <li>Download the <code>.crt</code> (or <code>.der</code> if required by your device).</li>
                                <li>Go to <strong>Settings &gt; Security &gt; Encryption & Credentials</strong>.</li>
                                <li>Tap <strong>Install a certificate &gt; CA Certificate</strong>.</li>
                                <li>Select "Install anyway" and choose the file.</li>
                            </ol>
                        </div>
                    </div>
                )}

                {/* Linux Tab */}
                {selectedIndex === 3 && (
                     <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {renderTable('linux')}
                         <div className="space-y-4 text-gray-800 dark:text-gray-200 text-sm mt-4 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border dark:border-white/10">
                            <h4 className="font-bold">Manual Installation (If not using One-Liner)</h4>
                            <pre className="bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto text-xs">
                                <code>
{`# Copy certificates
sudo cp *.crt /usr/local/share/ca-certificates/

# Update Store
sudo update-ca-certificates`}
                                </code>
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
