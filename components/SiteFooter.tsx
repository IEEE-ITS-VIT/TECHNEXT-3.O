import Link from "next/link";
import Image from "@/components/cms/EImage";
import E from "@/components/cms/E";
import { SITE, SITE_NAME } from "@/lib/site";

// Footer for the BOLT 3.0 and TechNext '28 websites.
export default function SiteFooter({ links }: { links: { icetite: string; bolt: string; technext: string } }) {
  const year = new Date().getFullYear();
  const own =
    SITE === "bolt"
      ? [
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: "Register", href: "/#register" },
        ]
      : [
          { label: "Home", href: "/" },
          { label: "Book a stall", href: "/register" },
          { label: "Expo categories", href: "/#categories" },
        ];

  return (
    <footer className="bg-brand-primary-dark text-white">
      <div className="container-x grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-bold text-white">{SITE_NAME}</p>
          <p className="mt-2 text-sm leading-relaxed text-white">
            <E f="c.SiteFooter">{"Organised by the IEEE ITS Student Chapter and SCORE, Vellore Institute of Technology, alongside ic-ETITE'28."}</E>
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-white">
            <E f="c.SiteFooter">{"Links"}</E>
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {own.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white hover:text-white/80 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/dashboard" className="text-white hover:text-white/80 transition-colors">
                My dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-white">
            <E f="c.SiteFooter">{"Also at VIT"}</E>
          </p>
          <ul className="mt-3 space-y-3 text-sm">
            <li>
              <a href={links.icetite} className="inline-flex items-center gap-2.5 text-white hover:text-white group">
                <div className="h-8 w-28 shrink-0 bg-white/10 rounded-xl px-3 py-1.5 border border-white/25 flex items-center justify-center">
                  <div className="relative h-4 w-full">
                    <Image src="/logos/ic-etite28-cropped-transparent.png" alt="ic-ETITE'28" fill sizes="90px" className="object-contain object-center" />
                  </div>
                </div>
                <span className="font-medium group-hover:underline">ic-ETITE&apos;28 conference</span>
              </a>
            </li>
            <li>
              <a href={links.bolt} className="inline-flex items-center gap-2.5 text-white hover:text-white group">
                <div className="h-8 w-28 shrink-0 bg-white/10 rounded-xl px-3 py-1.5 border border-[#CCFF00]/40 flex items-center justify-center">
                  <div className="relative h-4 w-full">
                    <Image src="/logos/bolt-logo-white.png" alt="BOLT 3.0" fill sizes="90px" className="object-contain object-center" />
                  </div>
                </div>
                <span className="font-medium group-hover:underline">BOLT 3.0 hackathon</span>
              </a>
            </li>
            <li className="pt-1">
              <a href="mailto:icetiteconference@vit.ac.in" className="text-white hover:underline transition-colors">
                icetiteconference@vit.ac.in
              </a>
            </li>
          </ul>
          <p className="mt-3 text-xs text-white/90">One account works on all three websites.</p>
        </div>
      </div>
      <div className="border-t border-white/15 py-4 text-center text-xs text-white/90">
        © {year} {SITE_NAME} · VIT Vellore
      </div>
    </footer>
  );
}
