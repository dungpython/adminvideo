/**
 * VideoAdmin - Authentication Service (Module 2)
 * Handles login, logout, register, session management, and route guard.
 * Integrates with Supabase `users` table; falls back to localStorage.
 *
 * Password hashing: SHA-256 via Web Crypto API (built-in browser API, no deps needed).
 * Session stored in sessionStorage key: 'video_admin_active_session'
 * User DB stored in localStorage key:   'video_admin_users_db'
 */

import { getSupabase } from '../database/supabase-client.js';

const SESSION_KEY = 'video_admin_active_session';
const USERS_KEY   = 'video_admin_users_db';

// ─── Default seed accounts ───────────────────────────────────────────────────
// Passwords hashed at runtime on first boot; plain-text versions shown here
// only for initial seed — they are NEVER stored plain-text.
const SEED_ACCOUNTS = [
  { id: 1,  name: 'Admin Administrator', email: 'admin@example.com',  password: 'admin123',  role: 'ADMIN', status: 'active', avatar: 'A' },
  { id: 2,  name: 'Nguyen Van An',       email: 'user1@demo.com',     password: 'user123',   role: 'USER',  status: 'active', avatar: 'N' },
  { id: 3,  name: 'Tran Thi Binh',       email: 'user2@demo.com',     password: 'user123',   role: 'USER',  status: 'active', avatar: 'T' },
  { id: 4,  name: 'Le Hoang Cuong',      email: 'user3@demo.com',     password: 'user123',   role: 'USER',  status: 'active', avatar: 'L' },
  { id: 5,  name: 'Pham Minh Dung',      email: 'user4@demo.com',     password: 'user123',   role: 'USER',  status: 'active', avatar: 'P' },
  { id: 6,  name: 'Hoang Thu Giang',     email: 'user5@demo.com',     password: 'user123',   role: 'USER',  status: 'active', avatar: 'H' },
  { id: 7,  name: 'Vu Duc Hai',          email: 'user6@demo.com',     password: 'user123',   role: 'USER',  status: 'active', avatar: 'V' },
  { id: 8,  name: 'Doan Mai Khanh',      email: 'user7@demo.com',     password: 'user123',   role: 'USER',  status: 'active', avatar: 'D' },
  { id: 9,  name: 'Bui Quang Linh',      email: 'user8@demo.com',     password: 'user123',   role: 'USER',  status: 'active', avatar: 'B' },
  { id: 10, name: 'Ngo Phuong Nga',      email: 'user9@demo.com',     password: 'user123',   role: 'USER',  status: 'active', avatar: 'N' },
  { id: 11, name: 'Dang Tuan Phong',     email: 'user10@demo.com',    password: 'user123',   role: 'USER',  status: 'active', avatar: 'D' },
];

// ─── Web Crypto SHA-256 helper ────────────────────────────────────────────────
/**
 * Returns a hex SHA-256 digest of the given string.
 * Uses the browser's built-in SubtleCrypto — zero external deps.
 * @param {string} str
 * @returns {Promise<string>} lowercase hex string
 */
export async function sha256(str) {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── Local user store helpers ─────────────────────────────────────────────────
function _readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function _writeUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('[AuthService] Cannot write users to localStorage:', e);
  }
}

/**
 * Ensures the local user store is seeded with hashed passwords.
 * Called once at startup.
 */
async function _ensureSeeded() {
  const existing = _readUsers();
  if (existing && existing.length > 0 && existing[0].password_hash) {
    return; // already seeded
  }

  const hashed = await Promise.all(
    SEED_ACCOUNTS.map(async u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      password_hash: await sha256(u.password),
      role: u.role,
      status: u.status,
      avatar: u.avatar,
      created_at: new Date().toISOString()
    }))
  );
  _writeUsers(hashed);
}

// ─── AuthService ──────────────────────────────────────────────────────────────
export const AuthService = {
  /**
   * Must be called once at app startup. Seeds local accounts.
   */
  async init() {
    await _ensureSeeded();
  },

  // ── Session management ──────────────────────────────────────────────────────

  /** Returns the currently logged-in user object, or null if not logged in. */
  getCurrentUser() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  },

  /** Saves the user object to sessionStorage as the active session. */
  _setSession(user) {
    // Never store password_hash in session
    const { password_hash, ...safeUser } = user;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  },

  /** Returns true if there is an active session. */
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  /** Returns true if the current user is ADMIN. */
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  },

  // ── Login ───────────────────────────────────────────────────────────────────

  /**
   * Attempts to authenticate with Supabase first, falls back to local store.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ success: boolean, user?: Object, source: string, message: string }>}
   */
  async login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await sha256(password.trim());

    // 1️⃣ Try Supabase cloud first
    try {
      const supabase = await getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', normalizedEmail)
          .eq('status', 'active')
          .single();

        if (!error && data) {
          // Verify password hash
          if (data.password_hash && data.password_hash === passwordHash) {
            this._setSession(data);
            return { success: true, user: data, source: 'supabase', message: 'Đăng nhập thành công!' };
          }
          // No hash stored remotely yet — accept and update
          if (!data.password_hash) {
            await supabase.from('users').update({ password_hash: passwordHash }).eq('id', data.id);
            const userWithHash = { ...data, password_hash: passwordHash };
            this._setSession(userWithHash);
            return { success: true, user: userWithHash, source: 'supabase', message: 'Đăng nhập thành công!' };
          }
        }
        // If error means user not found on Supabase, fall through to local
        if (!error && data && data.password_hash !== passwordHash) {
          return { success: false, user: null, source: 'supabase', message: 'Email hoặc mật khẩu không đúng.' };
        }
      }
    } catch (err) {
      console.warn('[AuthService] Supabase login failed, trying local:', err.message);
    }

    // 2️⃣ Fall back to local store
    return this._loginLocal(normalizedEmail, passwordHash);
  },

  /**
   * Authenticates against the local localStorage user store.
   * @private
   */
  _loginLocal(normalizedEmail, passwordHash) {
    const users = _readUsers() || [];
    const user = users.find(u => u.email === normalizedEmail && u.status !== 'inactive');
    if (!user) {
      return { success: false, user: null, source: 'local', message: 'Tài khoản không tồn tại.' };
    }
    if (user.password_hash !== passwordHash) {
      return { success: false, user: null, source: 'local', message: 'Email hoặc mật khẩu không đúng.' };
    }
    this._setSession(user);
    return { success: true, user, source: 'local', message: 'Đăng nhập thành công! (chế độ offline)' };
  },

  // ── Logout ──────────────────────────────────────────────────────────────────

  /** Clears the current session and optionally redirects. */
  logout(redirectTo = 'login.html') {
    sessionStorage.removeItem(SESSION_KEY);
    if (redirectTo) {
      window.location.href = redirectTo;
    }
  },

  // ── Register ────────────────────────────────────────────────────────────────

  /**
   * Registers a new account (default role: USER).
   * Saves to localStorage, then tries to sync to Supabase.
   * @param {{ name: string, email: string, password: string }} fields
   * @returns {Promise<{ success: boolean, message: string, user?: Object }>}
   */
  async register({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName  = name.trim();

    // Duplicate check in local store
    const users = _readUsers() || [];
    if (users.some(u => u.email === normalizedEmail)) {
      return { success: false, message: 'Email này đã được đăng ký. Hãy dùng email khác hoặc đăng nhập.' };
    }

    const passwordHash = await sha256(password.trim());
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
    const newUser = {
      id: newId,
      name: normalizedName,
      email: normalizedEmail,
      password_hash: passwordHash,
      role: 'USER',
      status: 'active',
      avatar: normalizedName[0]?.toUpperCase() || 'U',
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    _writeUsers(users);

    // Try to sync to Supabase (both table 'users' and Supabase Auth)
    let syncedSupabase = false;
    try {
      const supabase = await getSupabase();
      if (supabase) {
        // 1. Create in Supabase Auth so Password Reset via Email works out-of-the-box
        try {
          await supabase.auth.signUp({
            email: newUser.email,
            password: password.trim(),
            options: {
              data: { full_name: newUser.name, role: newUser.role }
            }
          });
        } catch (authErr) {
          console.warn('[AuthService] Supabase Auth signUp warning:', authErr);
        }

        // 2. Upsert into public.users table
        const { error } = await supabase.from('users').upsert({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          password_hash: newUser.password_hash,
          role: newUser.role,
          status: newUser.status,
          avatar: newUser.avatar
        }, { onConflict: 'email' });
        if (!error) syncedSupabase = true;
      }
    } catch (_) {}

    return {
      success: true,
      message: `Tạo tài khoản thành công!${syncedSupabase ? ' (Đã lưu lên Supabase)' : ' (Lưu cục bộ)'}`,
      user: newUser
    };
  },

  // ── Password change (future use) ────────────────────────────────────────────

  /**
   * Changes password for the currently logged-in user.
   * @param {string} oldPassword
   * @param {string} newPassword
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async changePassword(oldPassword, newPassword) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'Chưa đăng nhập.' };
    }

    const oldHash = await sha256(oldPassword.trim());
    const users = _readUsers() || [];
    const userIdx = users.findIndex(u => u.id === currentUser.id);

    if (userIdx === -1) {
      return { success: false, message: 'Không tìm thấy tài khoản.' };
    }
    if (users[userIdx].password_hash !== oldHash) {
      return { success: false, message: 'Mật khẩu hiện tại không đúng.' };
    }

    const newHash = await sha256(newPassword.trim());
    users[userIdx].password_hash = newHash;
    users[userIdx].updated_at = new Date().toISOString();
    _writeUsers(users);

    // Sync to Supabase
    try {
      const supabase = await getSupabase();
      if (supabase) {
        await supabase.from('users').update({ password_hash: newHash }).eq('id', currentUser.id);
      }
    } catch (_) {}

    return { success: true, message: 'Đã đổi mật khẩu thành công.' };
  }
};

// ─── Route Guard (exported for use in each page) ──────────────────────────────

/**
 * Protects an internal page from unauthenticated access.
 * Call this at the TOP of every protected page's init(), BEFORE rendering.
 *
 * @param {{ requireAdmin?: boolean, redirectTo?: string }} [opts]
 * @returns {boolean} true if access is allowed; false if redirected
 *
 * Usage:
 *   import { requireAuth } from '../services/auth-service.js';
 *   if (!requireAuth()) return;                       // any logged-in user
 *   if (!requireAuth({ requireAdmin: true })) return; // ADMIN only
 */
export function requireAuth({ requireAdmin = false, redirectTo = 'login.html' } = {}) {
  const session = (() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  })();

  if (!session) {
    window.location.href = redirectTo;
    return false;
  }

  if (requireAdmin && session.role !== 'ADMIN') {
    // Redirect non-admin users to dashboard (not login)
    window.location.href = 'index.html';
    return false;
  }

  return true;
}
