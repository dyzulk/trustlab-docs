import { ArrowRight, Shield, Globe, Lock, Server, Zap, ChevronRight } from "lucide-react";
import Link from 'next/link';

export function LandingPage() {
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
            v1.0 is Live
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
            Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Private Network</span>
          </h1>
          
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
            TrustLab is the definitive Private Certificate Authority (CA) for your internal infrastructure. Issue military-grade SSL/TLS certificates for Intranets, IoT, and Dev environments.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="https://trustlab.dyzulk.com/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/20">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/guide/certificates/request-new" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all">
              Generate Certificate
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<Shield className="w-6 h-6 text-emerald-500" />}
          title="Private Root CA"
          description="Your own sovereign Certificate Authority. Trusted by your devices, unreachable by the public internet."
          link="/guide/concepts"
        />
        <FeatureCard 
          icon={<Globe className="w-6 h-6 text-blue-500" />}
          title="Internal Domains"
          description="Issue certificates for .local, .corp, and private IP addresses (192.168.x.x) that Public CAs reject."
          link="/guide/certificates/request-new"
        />
        <FeatureCard 
          icon={<Lock className="w-6 h-6 text-violet-500" />}
          title="S/MIME Encryption"
          description="Secure internal email communication with employee-to-employee encryption."
          link="/guide/integrations/smime"
        />
        <FeatureCard 
          icon={<Server className="w-6 h-6 text-orange-500" />}
          title="Infrastructure"
          description="Seamless integration guides for Nginx, IIS, Apache, and containerized environments."
          link="/guide/integrations/web-servers"
        />
        <FeatureCard 
          icon={<Zap className="w-6 h-6 text-yellow-500" />}
          title="Instant Issuance"
          description="No validation delays. Certificates are issued instantly via our modern dashboard."
          link="/guide/getting-started/access-dashboard"
        />
        <FeatureCard 
          icon={<ArrowRight className="w-6 h-6 text-neutral-500" />}
          title="Start Now"
          description="Follow the Setup Guide to install the Root CA and go green in minutes."
          link="/guide/getting-started/install-root-ca"
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
