/**
 * VideoAdmin - Register Page Module (Module 2: Authentication)
 * Creates new USER accounts, hashed locally + synced to Supabase.
 */

import { Toast }       from '../components/toast.js';
import { AuthService } from '../services/auth-service.js';

export const RegisterPage = {
  async init() {
    // If already logged in, redirect to dashboard
    if (AuthService.isLoggedIn()) {
      window.location.href = 'index.html';
      return;
    }

    await AuthService.init();
    this._bindPasswordToggle();
    this._bindPasswordStrength();
    this._bindForm();
  },

  _bindPasswordToggle() {
    const btn   = document.getElementById('toggle-password-btn');
    const input = document.getElementById('register-password');
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.setAttribute('aria-label', isHidden ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
    });
  },

  _bindPasswordStrength() {
    const input     = document.getElementById('register-password');
    const indicator = document.getElementById('password-strength');
    if (!input || !indicator) return;

    input.addEventListener('input', () => {
      const val = input.value;
      let level = 0;
      if (val.length >= 6)  level++;
      if (val.length >= 10) level++;
      if (/[A-Z]/.test(val)) level++;
      if (/[0-9]/.test(val)) level++;
      if (/[^A-Za-z0-9]/.test(val)) level++;

      const labels = ['', 'Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
      const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
      indicator.textContent = val ? `Độ mạnh: ${labels[Math.min(level, 5)]}` : '';
      indicator.style.color = colors[Math.min(level, 5)];
    });
  },

  _bindForm() {
    const form      = document.getElementById('register-form');
    const submitBtn = form?.querySelector('button[type="submit"]');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name            = document.getElementById('register-name')?.value.trim();
      const email           = document.getElementById('register-email')?.value.trim();
      const password        = document.getElementById('register-password')?.value;
      const confirmPassword = document.getElementById('register-confirm-password')?.value;

      // ── Validation ──────────────────────────────────────────────────────────
      if (!name || !email || !password || !confirmPassword) {
        Toast.error('Vui lòng điền đầy đủ thông tin.');
        return;
      }
      if (name.length < 2) {
        Toast.error('Tên phải có ít nhất 2 ký tự.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Toast.error('Địa chỉ email không hợp lệ.');
        return;
      }
      if (password.length < 6) {
        Toast.error('Mật khẩu phải có ít nhất 6 ký tự.');
        return;
      }
      if (password !== confirmPassword) {
        Toast.error('Xác nhận mật khẩu không khớp.');
        return;
      }

      // ── Loading state ───────────────────────────────────────────────────────
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang tạo tài khoản…';
      }

      try {
        const result = await AuthService.register({ name, email, password });

        if (result.success) {
          Toast.success(result.message + ' Vui lòng đăng nhập.');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1200);
        } else {
          Toast.error(result.message);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Tạo tài khoản';
          }
        }
      } catch (err) {
        console.error('[RegisterPage] Error:', err);
        Toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Tạo tài khoản';
        }
      }
    });
  }
};
