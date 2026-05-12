'use client';

import s from './TopBar.module.css';

export default function TopBar() {
  return (
    <header className={s.topbar}>
      {/* Left: greeting */}
      <div>
        <h1 className={s.greeting}>Welcome back, Ronald!</h1>
        <p className={s.sub}>
          Monday, 03-01-2024 <span className={s.divider}>|</span> Sunny day in Purwokerto
        </p>
      </div>

      {/* Right: search + icons + profile */}
      <div className={s.actions}>
        {/* Search */}
        <div className={s.searchWrap}>
          <i className={`fas fa-search ${s.searchIcon}`} />
          <input
            className={s.searchInput}
            type="text"
            placeholder="Search.."
            id="topbar-search"
          />
        </div>

        {/* Bell */}
        <button className={s.iconBtn} aria-label="Notifications" id="topbar-bell">
          <i className="far fa-bell" />
          <span className={s.notifDot} />
        </button>

        {/* Info */}
        <button className={s.iconBtn} aria-label="Info" id="topbar-info">
          <i className="fas fa-info-circle" />
        </button>

        {/* Profile */}
        <div className={s.profile} id="topbar-profile">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwWPuRSLmwc45L4_ChxqnxbCzvDvTSiXhHzKwImOf_jG0Y2XBD0sxgcvALJ5feWj5l_asMR2Srl_39MnpwVHOJX81pVC_TieyTBSsOLRLrd8NLLqrl5BfmzaCmclbtQ34wvTrA9JqxzoOn94b9q2agkhlpOlPtlL20UVC-q8ipolGZBGWUAaHq9xtPxo-N5MQYwGnu4_9HGURZQ27dTx6_A-yW4lsCwMHCgt5tu-XM694mqIUsaJv_I0oqRUdjDfZAHEElAEoP9UTQ"
            alt="Ronald"
            className={s.avatar}
          />
          <i className={`fas fa-chevron-down ${s.chevron}`} />
        </div>
      </div>
    </header>
  );
}
