import { Cards, Card } from 'nextra/components'
import useSWR from 'swr'
import axios from 'axios'
import { ShieldCheck, Shield, Smartphone, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'

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

export function CertificateDownload() {
    const { data: certificates, error } = useSWR<CaCertificate[]>('https://api.trustlab.dyzulk.com/api/public/ca-certificates', fetcher)
    const [os, setOs] = useState<'windows' | 'mac' | 'linux' | 'android' | 'ios' | 'unknown'>('unknown')

    useEffect(() => {
        const ua = navigator.userAgent.toLowerCase()
        if (ua.includes('win')) setOs('windows')
        else if (ua.includes('mac')) setOs('mac')
        else if (ua.includes('linux')) setOs('linux')
        else if (ua.includes('android')) setOs('android')
        else if (ua.includes('iphone') || ua.includes('ipad')) setOs('ios')
    }, [])

    if (error) return <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-lg">Failed to load certificates. Please check your connection.</div>
    if (!certificates) return <div className="p-4 text-gray-500 animate-pulse">Loading certificates...</div>

    const rootCerts = certificates.filter(c => c.type === 'root')
    const interCerts = certificates.filter(c => c.type !== 'root')

    const getDownloadLink = (cert: CaCertificate) => {
        if (os === 'windows' && cert.bat_cdn_url) return cert.bat_cdn_url
        if (os === 'mac' && cert.mac_cdn_url) return cert.mac_cdn_url
        if (os === 'android' && cert.der_cdn_url) return cert.der_cdn_url
        if (os === 'ios' && cert.mac_cdn_url) return cert.mac_cdn_url
        return cert.cdn_url // Default PEM
    }

    const getIcon = (type: string) => {
        return type === 'root' ? <ShieldCheck className="w-6 h-6 text-purple-500" /> : <Shield className="w-6 h-6 text-blue-500" />
    }

    return (
        <div className="mt-6 space-y-8">
            <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    Root Authorities
                    <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">Auto-Detected: {os.toUpperCase()}</span>
                </h3>
                <Cards>
                    {rootCerts.map(cert => (
                        <Card 
                            key={cert.serial}
                            icon={getIcon('root')}
                            title={cert.name}
                            href={getDownloadLink(cert) || '#'}
                        />
                    ))}
                </Cards>
            </div>

            <div>
                 <h3 className="text-xl font-bold mb-4 text-gray-600 dark:text-gray-400">Intermediate Authorities</h3>
                 <Cards>
                    {interCerts.map(cert => (
                        <Card 
                            key={cert.serial}
                            icon={getIcon('intermediate')}
                            title={cert.name}
                            href={getDownloadLink(cert) || '#'}
                        />
                    ))}
                </Cards>
            </div>
        </div>
    )
}
