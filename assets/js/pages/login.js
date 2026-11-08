/**
 * VideoAdmin - Login Page Module (Module 2: Authentication)
 * Authenticates against Supabase `users` table (falls back to localStorage).
 * Prevents already-logged-in users from seeing this page.
 */

import { Toast }       from '../components/toast.js';
import { AuthService } from '../services/auth-service.js';

export const LoginPage = {
  async init() {
    // If already logged in, go straight to dashboard
    if (AuthService.isLoggedIn()) {
      window.location.href = 'index.html';
      return;
    }

    await AuthService.init(); // ensure local store seeded
    this._bindPasswordToggle();
    this._bindForm();
    this._bindDemoHints();
  },

  _bindPasswordToggle() {
    const toggleBtn     = document.getElementById('toggle-password-btn');
    const passwordInput = document.getElementById('login-password');
    if (!toggleBtn || !passwordInput) return;

    toggleBtn.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      toggleBtn.setAttribute('aria-label', isHidden ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
      // Swap icon
      toggleBtn.innerHTML = isHidden
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
           </svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
           </svg>`;
    });
  },

  _bindForm() {
    const form       = document.getElementById('login-form');
    const submitBtn  = form?.querySelector('button[type="submit"]');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email    = document.getElementById('login-email')?.value.trim();
      const password = document.getElementById('login-password')?.value;

      // ── Basic validation ────────────────────────────────────────────────────
      if (!email || !password) {
        Toast.error('Vui lòng nhập email và mật khẩu.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Toast.error('Email không hợp lệ.');
        return;
      }

      // ── Loading state ───────────────────────────────────────────────────────
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang đăng nhập…';
      }

      try {
        const result = await AuthService.login(email, password);

        if (result.success) {
          Toast.success(`${result.message} Đang chuyển hướng…`);
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 700);
        } else {
          Toast.error(result.message || 'Đăng nhập thất bại.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Đăng nhập';
          }
        }
      } catch (err) {
        console.error('[LoginPage] Unexpected error:', err);
        Toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Đăng nhập';
        }
      }
    });
  },

  /**
   * Clicking on a demo credential chip auto-fills the form.
   */
  _bindDemoHints() {
    const chips = document.querySelectorAll('[data-fill-email]');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const emailEl = document.getElementById('login-email');
        const passEl  = document.getElementById('login-password');
        if (emailEl) emailEl.value = chip.dataset.fillEmail;
        if (passEl)  passEl.value  = chip.dataset.fillPass || '';
      });
    });
  }
};
