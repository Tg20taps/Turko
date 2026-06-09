import { Instagram, Facebook, Music2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const social = [
  {
    label: 'Instagram',
    icon: Instagram,
    href: '#',
    hover: 'hover:border-pink-400/70 hover:bg-pink-500/10 hover:text-pink-300 hover:shadow-[0_0_30px_rgba(236,72,153,.22)]',
  },
  {
    label: 'Facebook',
    icon: Facebook,
    href: '#',
    hover: 'hover:border-blue-400/70 hover:bg-blue-500/10 hover:text-blue-300 hover:shadow-[0_0_30px_rgba(59,130,246,.22)]',
  },
  {
    label: 'TikTok',
    icon: Music2,
    href: '#',
    hover: 'hover:border-cyan-300/70 hover:bg-cyan-400/10 hover:text-cyan-200 hover:shadow-[0_0_30px_rgba(34,211,238,.2)]',
  },
  {
    label: 'WhatsApp',
    icon: MessageCircle,
    href: 'https://wa.me/56900000000',
    hover: 'hover:border-emerald-400/70 hover:bg-emerald-500/10 hover:text-emerald-300 hover:shadow-[0_0_30px_rgba(16,185,129,.24)]',
  },
];

export function Footer() {
  return (
    <footer className="border-t border-flame/14 bg-black">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-cream">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-flame text-sm font-black text-ink">RT</span>
              <span>
                <span className="block font-display text-base font-black">Rikki-Tikki</span>
                <span className="block text-xs text-cream/55">Pedidos para retiro en local</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-6 text-cream/62">
            Carta digital para revisar antojos, sumar productos al carrito y coordinar retiro en local.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {social.map(({ label, href, icon: Icon, hover }) => (
            <a
              key={label}
              href={href}
              className={`grid h-11 w-11 place-items-center rounded-md border border-cream/10 bg-black text-cream/70 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame ${hover}`}
              aria-label={label}
              title={label}
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
