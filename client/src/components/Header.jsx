import React from 'react';
import { Sun, Moon, Wifi, WifiOff } from 'lucide-react';

const Header = ({ theme, onToggleTheme, backendConnected }) => {
  return (
    <header className="vocalix-header">
      {/* Top row: Left status badge, Center Brand, Right Theme Switcher */}
      <div className="vocalix-header-nav">
        {/* Backend connectivity indicator */}
        <div className="vocalix-nav-left">
          <div
            className={`vocalix-status-badge ${backendConnected ? 'connected' : 'client'}`}
            title={backendConnected ? 'Backend REST API online' : 'Client Web Speech Mode active'}
          >
            <span className={`status-dot-pulse ${backendConnected ? 'green' : 'blue'}`}></span>
            <span className="status-label">{backendConnected ? 'Backend Active' : 'Client Mode'}</span>
          </div>
        </div>

        {/* Center: Vocalix Logo and Tagline */}
        <div className="vocalix-brand-center">
          <div className="vocalix-logo-row">
            {/* Custom SVG Microphone with sound wave bars matching reference image */}
            <div className="vocalix-icon-wrapper" aria-hidden="true">
              <svg className="vocalix-icon-svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left side wave bars */}
                <rect x="4" y="20" width="3.5" height="8" rx="1.75" fill="#2563EB" />
                <rect x="10" y="15" width="3.5" height="18" rx="1.75" fill="#2563EB" />
                {/* Center microphone */}
                <rect x="18" y="7" width="12" height="20" rx="6" stroke="#2563EB" strokeWidth="3" fill="none" />
                <path d="M14 21C14 26.5228 18.4772 31 24 31C29.5228 31 34 26.5228 34 21" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
                <line x1="24" y1="31" x2="24" y2="39" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
                <line x1="18" y1="39" x2="30" y2="39" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
                {/* Right side wave bars */}
                <rect x="34.5" y="15" width="3.5" height="18" rx="1.75" fill="#2563EB" />
                <rect x="40.5" y="20" width="3.5" height="8" rx="1.75" fill="#2563EB" />
              </svg>
            </div>
            <h1 className="vocalix-title">
              <span className="vocalix-title-vocal">Vocal</span>
              <span className="vocalix-title-ix">ix</span>
            </h1>
          </div>
          <p className="vocalix-tagline">Turn your text into speech</p>
        </div>

        {/* Right: Theme Toggle pill matching reference image */}
        <div className="vocalix-nav-right">
          <button
            type="button"
            className={`vocalix-theme-pill ${theme === 'dark' ? 'dark-active' : 'light-active'}`}
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Current: ${theme} mode (Click to toggle)`}
          >
            <div className="pill-sun-slot">
              <Sun size={15} className={`pill-icon ${theme === 'light' ? 'active' : ''}`} />
            </div>
            <div className="pill-thumb-slider">
              {theme === 'dark' ? (
                <Moon size={14} className="thumb-icon moon" />
              ) : (
                <Sun size={14} className="thumb-icon sun" />
              )}
            </div>
            <div className="pill-moon-slot">
              <Moon size={15} className={`pill-icon ${theme === 'dark' ? 'active' : ''}`} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
