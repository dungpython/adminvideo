/**
 * VideoAdmin - Header Component
 * Handles page title rendering, mobile hamburger menu toggle, and header actions.
 * Supabase connection badge is updated dynamically after each page loads.
 */

import { Sidebar } from './sidebar.js';
import { getSupabase, getConnectionStatus } from '../database/supabase-client.js';

export const Header = {
  /**
   * @param {Object} options
   * @param {string}  options.title
   * @param {string}  [options.subtitle]
   * @param {boolean} [options.showAddButton=true]
   */
  init({ title = 'Dashboard', subtitle = '', showAddButton = true } = {}) {
    const headerEl = document.getElementById('app-header');
    if (!headerEl) return;

    headerEl.innerHTML = `
      <div class="header-left">
        <button id="mobile-menu-btn" class="mobile-menu-btn" aria-label="Toggle navigation menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6"  x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div class="page-titles">
          <h1 class="page-title">${escapeHtml(title)}</h1>
          ${subtitle ? `<span class="page-subtitle">${escapeHtml(subtitle)}</span>` : ''}
        </div>
      </div>

      <div class="header-right">
        <!-- Supabase connection status badge — updated after init -->
        <span id="header-supabase-badge"
              class="header-badge"
              title="Đang kiểm tra kết nối Supabase..."
              style="background:var(--color-warning-bg); color:var(--color-warning); border-color:rgba(217,138,22,.25);">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8"  x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          Supabase…
        </span>

        ${showAddButton ? `
          <a href="video-form.html" class="btn btn-primary btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5"  x2="12" y2="19"></line>
              <line x1="5"  y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Video</span>
          </a>
        ` : ''}
      </div>
    `;

    // Bind mobile menu toggle
    document.getElementById('mobile-menu-btn')
      ?.addEventListener('click', () => Sidebar.open());

    // Probe Supabase asynchronously; don't block page render
    this._refreshBadge();
  },

  /** Updates the Supabase badge in the header based on the current connection status. */
  async _refreshBadge() {
    const badge = document.getElementById('header-supabase-badge');
    if (!badge) return;

    // If we already have a result cached, use it immediately
    const cached = getConnectionStatus();

    const render = (connected, ms, err) => {
      if (connected) {
        badge.style.background   = 'var(--color-success-bg)';
        badge.style.color        = 'var(--color-success)';
        badge.style.borderColor  = 'rgba(21,150,107,.25)';
        badge.title = `Supabase Cloud — kết nối thành công (${ms}ms)\nhttps://vycirvbnpqtyargapwnt.supabase.co`;
        badge.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Supabase ✓`;
      } else {
        badge.style.background   = 'var(--color-surface-muted)';
        badge.style.color        = 'var(--color-text-muted)';
        badge.style.borderColor  = 'var(--color-border)';
        badge.title = `Supabase — không thể kết nối (${err || 'offline'})\nỨng dụng đang dùng lưu trữ cục bộ.`;
        badge.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8"  x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          Offline`;
      }
    };

    if (cached.tested) {
      render(cached.connected, cached.latencyMs, cached.error);
      return;
    }

    // Test freshly
    try {
      const { testSupabaseConnection } = await import('../database/supabase-client.js');
      const result = await testSupabaseConnection();
      render(result.connected, result.latencyMs, result.error);
    } catch {
      render(false, 0, 'SDK error');
    }
  }
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}
