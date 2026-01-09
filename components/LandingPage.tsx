import { ArrowRight, Shield, Globe, Lock, Server, Zap, ChevronRight } from "lucide-react";
import Link from 'next/link';

export function LandingPage({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const dict = {
    en: {
      hero: {
        badge: "v1.0 is Live",
        title: <>Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Private Network</span></>,
        desc: "TrustLab is the definitive Private Certificate Authority (CA) for your internal infrastructure. Issue military-grade SSL/TLS certificates for Intranets, IoT, and Dev environments.",
        cta: "Get Started",
        cta_sec: "Generate Certificate"
      },
      features: {
        root_ca: { title: "Private Root CA", desc: "Your own sovereign Certificate Authority. Trusted by your devices, unreachable by the public internet." },
        internal: { title: "Internal Domains", desc: "Issue certificates for .local, .corp, and private IP addresses (192.168.x.x) that Public CAs reject." },
        smime: { title: "S/MIME Encryption", desc: "Secure internal email communication with employee-to-employee encryption." },
        infra: { title: "Infrastructure", desc: "Seamless integration guides for Nginx, IIS, Apache, and containerized environments." },
        issuance: { title: "Instant Issuance", desc: "No validation delays. Certificates are issued instantly via our modern dashboard." },
        start: { title: "Start Now", desc: "Follow the Setup Guide to install the Root CA and go green in minutes." }
      }
    },
    id: {
      hero: {
        badge: "v1.0 Telah Rilis",
        title: <>Amankan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Jaringan Privat</span> Anda</>,
        desc: "TrustLab adalah Otoritas Sertifikat (CA) Privat definitif untuk infrastruktur internal Anda. Terbitkan sertifikat SSL/TLS kelas militer untuk Intranet, IoT, dan lingkungan Dev.",
        cta: "Mulai Sekarang",
        cta_sec: "Buat Sertifikat"
      },
      features: {
        root_ca: { title: "Root CA Privat", desc: "Otoritas Sertifikat berdaulat milik Anda. Dipercaya perangkat Anda, tidak terjangkau internet publik." },
        internal: { title: "Domain Internal", desc: "Terbitkan sertifikat untuk .local, .corp, dan IP privat (192.168.x.x) yang ditolak CA Publik." },
        smime: { title: "Enkripsi S/MIME", desc: "Amankan komunikasi email internal dengan enkripsi antar-karyawan." },
        infra: { title: "Infrastruktur", desc: "Panduan integrasi mulus untuk Nginx, IIS, Apache, dan environment container." },
        issuance: { title: "Penerbitan Instan", desc: "Tanpa penundaan validasi. Sertifikat diterbitkan instan melalui dashboard modern kami." },
        start: { title: "Mulai Sekarang", desc: "Ikuti Panduan Setup untuk menginstal Root CA dan aman dalam hitungan menit." }
      }
    }
  }

  const t = dict[locale]

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <div className="flex flex-col items-start gap-6 relative overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-900 px-8 py-16 sm:px-16 w-full">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t.hero.badge}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
            {t.hero.title}
          </h1>
          
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
            {t.hero.desc}
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="https://trustlab.dyzulk.com/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/20">
              {t.hero.cta} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={locale === 'id' ? "/id/guide/certificates/request-new" : "/guide/certificates/request-new"} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all">
              {t.hero.cta_sec}
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<Shield className="w-6 h-6 text-emerald-500" />}
          title={t.features.root_ca.title}
          description={t.features.root_ca.desc}
          link={locale === 'id' ? "/id/guide/concepts/pki-undamentals" : "/guide/concepts/pki-undamentals"}
        />
        <FeatureCard 
          icon={<Globe className="w-6 h-6 text-blue-500" />}
          title={t.features.internal.title}
          description={t.features.internal.desc}
          link={locale === 'id' ? "/id/guide/certificates/request-new" : "/guide/certificates/request-new"}
        />
        <FeatureCard 
          icon={<Lock className="w-6 h-6 text-violet-500" />}
          title={t.features.smime.title}
          description={t.features.smime.desc}
          link={locale === 'id' ? "/id/guide/integrations/smime" : "/guide/integrations/smime"}
        />
        <FeatureCard 
          icon={<Server className="w-6 h-6 text-orange-500" />}
          title={t.features.infra.title}
          description={t.features.infra.desc}
          link={locale === 'id' ? "/id/guide/integrations/web-servers" : "/guide/integrations/web-servers"}
        />
        <FeatureCard 
          icon={<Zap className="w-6 h-6 text-yellow-500" />}
          title={t.features.issuance.title}
          description={t.features.issuance.desc}
          link={locale === 'id' ? "/id/guide/getting-started/access-dashboard" : "/guide/getting-started/access-dashboard"}
        />
        <FeatureCard 
          icon={<ArrowRight className="w-6 h-6 text-neutral-500" />}
          title={t.features.start.title}
          description={t.features.start.desc}
          link={locale === 'id' ? "/id/guide/getting-started/install-root-ca" : "/guide/getting-started/install-root-ca"}
          isAction
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, link, isAction }: any) {
  return (
    <Link href={link} className={`group flex flex-col p-6 rounded-2xl border transition-all duration-300 ${isAction ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 hover:shadow-lg dark:hover:border-blue-500/30'}`}>
      <div className={`mb-4 p-3 rounded-xl w-fit ${isAction ? 'bg-white/10 dark:bg-black/10' : 'bg-neutral-50 dark:bg-neutral-800'}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className={`text-sm leading-relaxed mb-4 ${isAction ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
        {description}
      </p>
      <div className={`mt-auto flex items-center text-sm font-medium ${isAction ? 'text-blue-400 dark:text-blue-600' : 'text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0'}`}>
        Learn more <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </Link>
  )
}
