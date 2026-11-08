/**
 * VideoAdmin - Reset Password Page Module (Supabase Auth Email Integration)
 * Handles updating the user password once they click the recovery link from email.
 * Uses: supabase.auth.updateUser({ password: newPassword })
 */

import { Toast } from '../components/toast.js';
import { getSupabase } from '../database/supabase-client.js';

let isRecoverySessionValid = false;

export const ResetPasswordPage = {
  async init() {
    this.bindPasswordToggle();
    this.bindStrengthMeter();
    this.bindForm();
    await this.verifyRecoverySession();
  },

  /**
   * Verifies if the incoming URL contains a valid recovery token from Supabase
   */
  async verifyRecoverySession() {
    const loadingState = document.getElementById('reset-loading-state');
    const errorState   = document.getElementById('reset-error-state');
    const form         = document.getElementById('reset-password-form');

    try {
      const supabase = await getSupabase();
      if (!supabase) {
        if (loadingState) loadingState.style.display = 'none';
        if (errorState) {
          errorState.style.display = 'flex';
          errorState.querySelector('div').textContent = 'Không thể kết nối đến máy chủ Supabase. Vui lòng thử lại sau.';
        }
        return;
      }

      // Check URL hash or query for tokens
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      const hasRecoveryToken = hash.includes('type=recovery') || 
                               hash.includes('access_token=') || 
                               params.has('code');

      // Listen for Supabase auth state change (specifically PASSWORD_RECOVERY)
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('[ResetPassword] Auth event:', event, 'Session:', Boolean(session));
        if (event === 'PASSWORD_RECOVERY' || (session && hasRecoveryToken)) {
          isRecoverySessionValid = true;
          this.showForm();
        }
      });

      // Also actively check current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session || hasRecoveryToken) {
        isRecoverySessionValid = true;
        this.showForm();
      } else {
        // Give Supabase SDK 1.5 seconds to parse hash tokens before showing error
        setTimeout(async () => {
          if (!isRecoverySessionValid) {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              isRecoverySessionValid = true;
              this.showForm();
            } else {
              if (loadingState) loadingState.style.display = 'none';
              if (errorState) errorState.style.display = 'flex';
              if (form) form.style.display = 'none';
            }
          }
        }, 1500);
      }

    } catch (err) {
      console.error('[ResetPassword] Verification error:', err);
      if (loadingState) loadingState.style.display = 'none';
      if (errorState) errorState.style.display = 'flex';
    }
  },

  showForm() {
    const loadingState = document.getElementById('reset-loading-state');
    const errorState   = document.getElementById('reset-error-state');
    const form         = document.getElementById('reset-password-form');

    if (loadingState) loadingState.style.display = 'none';
    if (errorState) errorState.style.display = 'none';
    if (form) {
      form.style.display = 'block';
      const input = document.getElementById('new-password');
      if (input) input.focus();
    }
  },

  bindPasswordToggle() {
    const btn = document.getElementById('toggle-new-password');
    const input = document.getElementById('new-password');
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.setAttribute('aria-label', isHidden ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
    });
  },

  bindStrengthMeter() {
    const input = document.getElementById('new-password');
    const indicator = document.getElementById('password-strength-indicator');
    if (!input || !indicator) return;

    input.addEventListener('input', () => {
      const val = input.value;
      if (!val) {
        indicator.textContent = '';
        return;
      }

      let score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 10) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const labels = ['', 'Rất yếu (Cần ít nhất 6 ký tự)', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
      const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];

      const level = Math.min(score, 5);
      indicator.textContent = `Độ mạnh: ${labels[level]}`;
      indicator.style.color = colors[level];
    });
  },

  bindForm() {
    const form = document.getElementById('reset-password-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newPassEl     = document.getElementById('new-password');
      const confirmPassEl = document.getElementById('confirm-new-password');
      const submitBtn     = document.getElementById('reset-submit-btn');
      const btnText       = document.getElementById('reset-btn-text');

      const newPassword = newPassEl?.value;
      const confirmPassword = confirmPassEl?.value;

      if (!newPassword || !confirmPassword) {
        Toast.error('Vui lòng điền đầy đủ cả 2 trường mật khẩu.');
        return;
      }

      if (newPassword.length < 6) {
        Toast.error('Mật khẩu mới phải có ít nhất 6 ký tự.');
        if (newPassEl) newPassEl.focus();
        return;
      }

      if (newPassword !== confirmPassword) {
        Toast.error('Xác nhận mật khẩu không trùng khớp.');
        if (confirmPassEl) confirmPassEl.focus();
        return;
      }

      // Submit state
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Đang cập nhật mật khẩu...';

      try {
        const supabase = await getSupabase();
        if (!supabase) {
          Toast.error('Không tìm thấy kết nối Supabase.');
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.textContent = 'Lưu mật khẩu mới';
          return;
        }

        // Call Supabase Auth to update user's password
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (error) {
          console.error('[ResetPassword] Update password failed:', error);
          Toast.error(`Lỗi: ${error.message}`);
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.textContent = 'Lưu mật khẩu mới';
          return;
        }

        console.log('[ResetPassword] Password updated successfully:', data);
        Toast.success('Đổi mật khẩu thành công! Đang chuyển hướng về trang Đăng nhập...');

        // Clear sensitive inputs
        if (newPassEl) newPassEl.value = '';
        if (confirmPassEl) confirmPassEl.value = '';

        if (submitBtn) {
          submitBtn.disabled = true;
          if (btnText) btnText.textContent = 'Đã cập nhật ✓';
        }

        // Sign out recovery session to require fresh login with new password
        try {
          await supabase.auth.signOut();
        } catch (_) {}

        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);

      } catch (err) {
        console.error('[ResetPassword] Unexpected error:', err);
        Toast.error(`Lỗi hệ thống: ${err.message || 'Không thể cập nhật mật khẩu.'}`);
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Lưu mật khẩu mới';
      }
    });
  }
};
