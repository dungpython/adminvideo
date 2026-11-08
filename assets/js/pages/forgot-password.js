/**
 * VideoAdmin - Forgot Password Page Module (Supabase Auth Email Integration)
 * Sends a real password recovery email via Supabase Auth API:
 * supabase.auth.resetPasswordForEmail(email, { redirectTo: '.../reset-password.html' })
 */

import { Toast } from '../components/toast.js';
import { getSupabase, testSupabaseConnection } from '../database/supabase-client.js';

let countdownInterval = null;

export const ForgotPasswordPage = {
  async init() {
    this.bindForm();
    this.bindResend();
    this.checkConnection();
  },

  /**
   * Pre-checks Supabase connectivity to give fast feedback
   */
  async checkConnection() {
    try {
      const status = await testSupabaseConnection();
      if (!status.connected) {
        console.warn('[ForgotPassword] Supabase offline or unreachable:', status.error);
      }
    } catch (e) {
      console.warn('[ForgotPassword] Ping error:', e);
    }
  },

  bindForm() {
    const form = document.getElementById('forgot-password-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('forgot-email');
      const submitBtn  = document.getElementById('forgot-submit-btn');
      const btnText    = document.getElementById('forgot-btn-text');
      const email = emailInput?.value.trim().toLowerCase();

      if (!email) {
        Toast.error('Vui lòng nhập địa chỉ email của bạn.');
        if (emailInput) emailInput.focus();
        return;
      }

      // Basic regex check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Toast.error('Địa chỉ email không đúng định dạng.');
        if (emailInput) emailInput.focus();
        return;
      }

      // Set Loading State
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Đang gửi qua Supabase...';

      try {
        const supabase = await getSupabase();
        if (!supabase) {
          Toast.error('Không thể nạp thư viện Supabase SDK. Vui lòng kiểm tra kết nối mạng.');
          this.resetSubmitBtn();
          return;
        }

        // Calculate redirect URL to reset-password.html dynamically
        // Handles both root directory and subfolders safely
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        const redirectTo = `${window.location.origin}${basePath}reset-password.html`;

        console.log('[ForgotPassword] Requesting reset password for:', email, 'RedirectTo:', redirectTo);

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectTo
        });

        if (error) {
          console.error('[ForgotPassword] Supabase Auth Error:', error);
          
          // Provide friendly Vietnamese message for common Supabase Auth errors
          if (error.message?.includes('rate limit') || error.status === 429) {
            Toast.error('Bạn đã yêu cầu gửi quá nhiều lần. Vui lòng đợi vài phút trước khi thử lại.');
          } else {
            Toast.error(`Lỗi Supabase: ${error.message}`);
          }
          this.resetSubmitBtn();
          return;
        }

        // Success State
        console.log('[ForgotPassword] Reset email sent successfully:', data);
        Toast.success('Đã gửi yêu cầu khôi phục mật khẩu!');

        // Show Success Box with clear troubleshooting steps
        const successBox = document.getElementById('forgot-success-box');
        const successText = document.getElementById('forgot-success-text');
        if (successBox) successBox.style.display = 'flex';
        if (successText) {
          successText.innerHTML = `
            Yêu cầu khôi phục đã được gửi tới Supabase cho <strong>${escapeHtml(email)}</strong>.<br>
            <div style="margin-top: 0.5rem; font-size: 12px; line-height: 1.5; background: rgba(255,255,255,0.7); padding: 8px 10px; border-radius: 6px;">
              🔍 <strong>Nếu bạn chưa thấy thư trong hộp thư đến:</strong><br>
              1. Hãy kiểm tra mục <strong>Spam (Thư rác)</strong> hoặc <strong>Quảng cáo / Junk</strong> (email gửi từ <code>noreply@mail.app.supabase.io</code>).<br>
              2. <strong>Quan trọng:</strong> Email này bắt buộc phải <em>đã được tạo trong mục Supabase Authentication</em>. Nếu chưa tạo, Supabase sẽ không gửi thư (tính năng bảo mật chống dò email).
            </div>
          `;
        }

        // Disable input
        if (emailInput) emailInput.disabled = true;
        if (submitBtn) {
          submitBtn.disabled = true;
          if (btnText) btnText.textContent = 'Đã gửi email';
        }

        // Start countdown for resend
        this.startResendCountdown(email);

      } catch (err) {
        console.error('[ForgotPassword] Unexpected error:', err);
        Toast.error(`Lỗi hệ thống: ${err.message || 'Không thể gửi email.'}`);
        this.resetSubmitBtn();
      }
    });
  },

  resetSubmitBtn() {
    const submitBtn = document.getElementById('forgot-submit-btn');
    const btnText   = document.getElementById('forgot-btn-text');
    if (submitBtn) submitBtn.disabled = false;
    if (btnText) btnText.textContent = 'Gửi liên kết qua Email';
  },

  startResendCountdown(email) {
    const resendWrapper = document.getElementById('resend-wrapper');
    const resendBtn = document.getElementById('resend-btn');
    const countdownSpan = document.getElementById('resend-countdown');

    if (!resendWrapper || !resendBtn || !countdownSpan) return;

    resendWrapper.style.display = 'block';
    resendBtn.disabled = true;
    let secondsLeft = 60;
    countdownSpan.textContent = secondsLeft;

    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      secondsLeft--;
      countdownSpan.textContent = secondsLeft;
      if (secondsLeft <= 0) {
        clearInterval(countdownInterval);
        resendBtn.disabled = false;
        resendBtn.innerHTML = 'Gửi lại ngay';
      }
    }, 1000);
  },

  bindResend() {
    const resendBtn = document.getElementById('resend-btn');
    if (!resendBtn) return;

    resendBtn.addEventListener('click', async () => {
      const email = document.getElementById('forgot-email')?.value.trim();
      if (!email) return;

      resendBtn.disabled = true;
      resendBtn.textContent = 'Đang gửi lại...';

      try {
        const supabase = await getSupabase();
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        const redirectTo = `${window.location.origin}${basePath}reset-password.html`;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectTo
        });

        if (error) {
          Toast.error(`Không thể gửi lại: ${error.message}`);
          resendBtn.disabled = false;
          resendBtn.textContent = 'Gửi lại';
        } else {
          Toast.success('Đã gửi lại liên kết khôi phục tới email của bạn!');
          this.startResendCountdown(email);
        }
      } catch (e) {
        Toast.error('Lỗi khi gửi lại email.');
        resendBtn.disabled = false;
        resendBtn.textContent = 'Gửi lại';
      }
    });
  }
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
