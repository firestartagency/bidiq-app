'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import s from './Sidebar.module.css';

const navItems = [
  { label: 'Dashboard',        href: '/',          icon: 'fas fa-th-large' },
  { label: 'Active Bids',      href: '/bids',      icon: 'fas fa-gavel' },
  { label: 'Proposals',        href: '/proposals', icon: 'fas fa-file-signature' },
  { label: 'Analysis',         href: '/analysis',  icon: 'fas fa-chart-bar' },
  { label: 'Company Profile',  href: '/profile',   icon: 'fas fa-building' },
  { label: 'Compliance',       href: '/compliance',icon: 'fas fa-shield-alt' },
  { label: 'Submissions',      href: '/submissions',icon: 'fas fa-paper-plane' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={s.sidebar}>
      <div>
        {/* Logo */}
        <div className={s.logoArea}>
          <div className={s.logoIcon}>
            <i className="fas fa-bolt" />
          </div>
          <span className={s.logoText}>BidIQ</span>
        </div>

        {/* Nav */}
        <nav className={s.nav}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${s.navLink} ${active ? s.active : ''}`}
                id={`nav-${item.label.toLowerCase()}`}
              >
                <i className={`${item.icon} ${s.navIcon}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className={s.bottom}>
        <Link href="/settings" className={s.navLink} id="nav-settings">
          <i className={`fas fa-cog ${s.navIcon}`} />
          Settings
        </Link>
        <Link href="/logout" className={`${s.navLink} ${s.logout}`} id="nav-logout">
          <i className={`fas fa-sign-out-alt ${s.navIcon}`} />
          Log out
        </Link>
      </div>
    </aside>
  );
}
