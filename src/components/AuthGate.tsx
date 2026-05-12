'use client';

import { useState, useEffect, ReactNode } from 'react';
import s from './AuthGate.module.css';

const AUTH_KEY = 'bidiq_auth';
const PASSWORD  = 'Chris2026';

export default function AuthGate({ children }: { children: ReactNode }) {
  const [authed,  setAuthed]  = useState<boolean | null>(null);
  const [input,   setInput]   = useState('');
  const [error,   setError]   = useState('');
  const [show,    setShow]    = useState(false);
  const [shaking, setShaking] = useState(false);

  /* Check sessionStorage on mount */
  useEffect(() => {
    setAuthed(sessionStorage.getItem(AUTH_KEY) === '1');
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Incorrect password. Please try again.');
      setShaking(true);
      setInput('');
      setTimeout(() => setShaking(false), 500);
    }
  }

  /* Still checking sessionStorage */
  if (authed === null) return null;

  /* Authenticated — render the app */
  if (authed) return <>{children}</>;

  /* Gate */
  return (
    <div className={s.gate}>
      <div className={`${s.card} ${shaking ? s.shake : ''}`}>
        {/* Logo */}
        <div className={s.logoRow}>
          <div className={s.logoIcon}><i className="fas fa-bolt" /></div>
          <span className={s.logoText}>BidIQ</span>
        </div>

        <h1 className={s.title}>Secure Access Required</h1>
        <p className={s.subtitle}>This platform is restricted. Enter your access password to continue.</p>

        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.inputWrap}>
            <i className={`fas fa-lock ${s.inputIcon}`} />
            <input
              className={s.input}
              type={show ? 'text' : 'password'}
              placeholder="Enter password"
              value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              autoFocus
              autoComplete="current-password"
            />
            <button
              type="button"
              className={s.showToggle}
              onClick={() => setShow(v => !v)}
              tabIndex={-1}
            >
              <i className={`fas fa-eye${show ? '-slash' : ''}`} />
            </button>
          </div>
          {error && <p className={s.error}><i className="fas fa-exclamation-circle" /> {error}</p>}
          <button type="submit" className={s.submitBtn} disabled={!input.trim()}>
            <i className="fas fa-arrow-right" /> Access Platform
          </button>
        </form>

        <p className={s.footer}>
          <i className="fas fa-shield-alt" /> Protected by BidIQ Access Control
        </p>
      </div>
    </div>
  );
}
