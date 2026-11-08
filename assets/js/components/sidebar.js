/**
 * VideoAdmin - Sidebar Component
 * Manages responsive sidebar navigation, active page highlighting, and mobile drawer.
 * Reads active session from sessionStorage; provides real Logout via AuthService.
 */

export const Sidebar = {
  /**
   * Initializes the sidebar navigation.
   * @param {string} activePage - 'dashboard' | 'videos' | 'categories' | 'video-form' | 'permissions'
   */
  init(activePage = 'dashboard') {
    const sidebarEl = document.getElementById('app-sidebar');
    if (!sidebarEl) return;

    // Read active session user
    let activeUser = { name: 'Admin Administrator', role: 'ADMIN', avatar: 'A' };
    try {
      const saved = sessionStorage.getItem('video_admin_active_session');
      if (saved) activeUser = JSON.parse(saved);
    } catch (_) {}

    const isAdmin = activeUser.role === 'ADMIN';
    const esc = escapeHtml;

    sidebarEl.innerHTML = `
      <div class="sidebar-header">
        <a href="index.html" class="brand-logo" title="VideoAdmin">
          <div class="brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
          <span>VideoAdmin</span>
        </a>
        <button id="sidebar-close-btn" class="sidebar-close-btn" aria-label="Đóng menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav" aria-label="Điều hướng chính">
        <span class="nav-section-title">Menu</span>

        <a href="index.html" class="nav-item ${activePage === 'dashboard' ? 'active' : ''}" data-nav="dashboard">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="9"></rect>
            <rect x="14" y="3" width="7" height="5"></rect>
            <rect x="14" y="12" width="7" height="9"></rect>
            <rect x="3" y="16" width="7" height="5"></rect>
          </svg>
          <span>Dashboard</span>
        </a>

        <a href="videos.html" class="nav-item ${activePage === 'videos' ? 'active' : ''}" data-nav="videos">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7"  y1="2"  x2="7"  y2="22"></line>
            <line x1="17" y1="2"  x2="17" y2="22"></line>
            <line x1="2"  y1="12" x2="22" y2="12"></line>
            <line x1="2"  y1="7"  x2="7"  y2="7"></line>
            <line x1="2"  y1="17" x2="7"  y2="17"></line>
            <line x1="17" y1="17" x2="22" y2="17"></line>
            <line x1="17" y1="7"  x2="22" y2="7"></line>
          </svg>
          <span>Videos</span>
        </a>

        <a href="categories.html" class="nav-item ${activePage === 'categories' ? 'active' : ''}" data-nav="categories">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Categories</span>
        </a>

        <span class="nav-section-title" style="margin-top:1rem;">Quản lý</span>

        <a href="video-form.html" class="nav-item ${activePage === 'video-form' ? 'active' : ''}" data-nav="video-form">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <span>Thêm Video</span>
        </a>

        <!-- Permissions: visible to all, but page itself guards ADMIN access -->
        <a href="permissions.html" class="nav-item ${activePage === 'permissions' ? 'active' : ''}${isAdmin ? '' : ' nav-item--muted'}" data-nav="permissions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Phân Quyền${isAdmin ? '' : ' 🔒'}</span>
        </a>
      </nav>

      <!-- User profile + Logout -->
      <div class="sidebar-footer">
        <div class="user-profile-badge">
          <div class="user-avatar" title="${esc(activeUser.name)}">${esc(activeUser.avatar || (activeUser.name ? activeUser.name[0] : 'U'))}</div>
          <div class="user-meta">
            <div class="user-name">${esc(activeUser.name || 'User')}</div>
            <div class="user-role" style="font-weight:600;color:${activeUser.role === 'ADMIN' ? 'var(--color-primary)' : 'var(--color-text-muted)'};">${esc(activeUser.role || 'USER')}</div>
          </div>
          <button id="sidebar-logout-btn" class="btn-icon" title="Đăng xuất" aria-label="Đăng xuất" style="border:none;background:transparent;cursor:pointer;flex-shrink:0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    `;

    // ── Backdrop ──────────────────────────────────────────────────────────────
    let backdrop = document.getElementById('sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'sidebar-backdrop';
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }

    // ── Close button ──────────────────────────────────────────────────────────
    document.getElementById('sidebar-close-btn')
      ?.addEventListener('click', () => Sidebar.close());

    backdrop.addEventListener('click', () => Sidebar.close());

    // ── Logout button ─────────────────────────────────────────────────────────
    document.getElementById('sidebar-logout-btn')
      ?.addEventListener('click', () => {
        // Import AuthService lazily to avoid circular dependency issues
        import('../services/auth-service.js')
          .then(({ AuthService }) => AuthService.logout('login.html'))
          .catch(() => {
            // Fallback: clear session manually
            sessionStorage.removeItem('video_admin_active_session');
            window.location.href = 'login.html';
          });
      });
  },

  open() {
    document.getElementById('app-sidebar')?.classList.add('open');
    document.getElementById('sidebar-backdrop')?.classList.add('open');
  },

  close() {
    document.getElementById('app-sidebar')?.classList.remove('open');
    document.getElementById('sidebar-backdrop')?.classList.remove('open');
  }
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
