/**
 * VideoAdmin - Permission Service (with Supabase Cloud Backend Integration)
 * Manages user accounts, role assignments (ADMIN, USER), and role session state.
 */

import { getSupabase, testSupabaseConnection, getConnectionStatus } from '../database/supabase-client.js';

const STORAGE_KEY = 'video_admin_users_db';
const SESSION_KEY = 'video_admin_active_session';

// Initial Seed Data: 1 Admin + 10 USER accounts as requested
export const DEFAULT_USERS = [
  {
    id: 1,
    name: 'Admin Administrator',
    email: 'admin@example.com',
    role: 'ADMIN',
    status: 'active',
    created_at: '2026-10-01 08:00:00',
    avatar: 'A'
  },
  {
    id: 2,
    name: 'Nguyen Van An',
    email: 'user1@demo.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-10-10 09:30:00',
    avatar: 'N'
  },
  {
    id: 3,
    name: 'Tran Thi Binh',
    email: 'user2@demo.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-10-12 11:15:00',
    avatar: 'T'
  },
  {
    id: 4,
    name: 'Le Hoang Cuong',
    email: 'user3@demo.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-10-15 14:00:00',
    avatar: 'L'
  },
  {
    id: 5,
    name: 'Pham Minh Dung',
    email: 'user4@demo.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-10-18 16:45:00',
    avatar: 'P'
  },
  {
    id: 6,
    name: 'Hoang Thu Giang',
    email: 'user5@demo.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-10-20 10:20:00',
    avatar: 'H'
  },
  {
    id: 7,
    name: 'Vu Duc Hai',
    email: 'user6@demo.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-10-22 13:10:00',
    avatar: 'V'
  },
  {
    id: 8,
    name: 'Doan Mai Khanh',
    email: 'user7@demo.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-10-25 15:35:00',
    avatar: 'D'
  },
  {
    id: 9,
    name: 'Bui Quang Linh',
    email: 'user8@demo.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-10-28 08:50:00',
    avatar: 'B'
  },
  {
    id: 10,
    name: 'Ngo Phuong Nga',
    email: 'user9@demo.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-11-01 17:05:00',
    avatar: 'N'
  },
  {
    id: 11,
    name: 'Dang Tuan Phong',
    email: 'user10@demo.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-11-05 12:40:00',
    avatar: 'D'
  }
];

export const PermissionService = {
  /**
   * Synchronously retrieves all users from local cache
   * @returns {Array} List of user objects
   */
  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read users from localStorage:', e);
    }
    // Seed defaults
    this.saveUsers(DEFAULT_USERS);
    return [...DEFAULT_USERS];
  },

  /**
   * Asynchronously fetches users from Supabase, syncing to local storage
   * @returns {Promise<{ users: Array, source: 'supabase'|'local', error?: string }>}
   */
  async fetchUsersRemote() {
    try {
      const client = await getSupabase();
      if (!client) {
        return { users: this.getUsers(), source: 'local', error: 'Supabase client not initialized' };
      }

      const { data, error } = await client
        .from('users')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.warn('Supabase query error (falling back to local cache):', error.message);
        return { users: this.getUsers(), source: 'local', error: error.message };
      }

      if (data && data.length > 0) {
        this.saveUsers(data);
        return { users: data, source: 'supabase' };
      } else {
        // Table exists but empty, offer local data
        return { users: this.getUsers(), source: 'local' };
      }
    } catch (err) {
      console.warn('Fetch remote users failed, using local fallback:', err);
      return { users: this.getUsers(), source: 'local', error: err.message };
    }
  },

  /**
   * Persists user list to localStorage
   * @param {Array} users 
   */
  saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to localStorage:', e);
    }
  },

  /**
   * Resets users list back to default 1 Admin + 10 Users
   */
  resetUsers() {
    this.saveUsers(DEFAULT_USERS);
    return [...DEFAULT_USERS];
  },

  /**
   * Updates a user's role in local storage and syncs to Supabase
   * @param {number|string} userId 
   * @param {'ADMIN'|'USER'} newRole 
   * @returns {Promise<{ success: boolean, message: string, user?: Object, syncedSupabase: boolean }>}
   */
  async updateUserRole(userId, newRole) {
    if (!['ADMIN', 'USER'].includes(newRole)) {
      return { success: false, message: 'Invalid role specified.', syncedSupabase: false };
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(u => String(u.id) === String(userId));
    if (userIndex === -1) {
      return { success: false, message: 'User not found.', syncedSupabase: false };
    }

    const currentSession = this.getCurrentUser();
    // Safety check: Prevent demoting currently active admin session
    if (String(currentSession.id) === String(userId) && newRole !== 'ADMIN') {
      return { 
        success: false, 
        message: 'Bạn không thể tự hạ quyền (demote) tài khoản ADMIN đang đăng nhập của chính mình.',
        syncedSupabase: false
      };
    }

    users[userIndex].role = newRole;
    users[userIndex].updated_at = new Date().toISOString();
    this.saveUsers(users);

    let syncedSupabase = false;
    try {
      const client = await getSupabase();
      if (client) {
        const { error } = await client
          .from('users')
          .update({ role: newRole, updated_at: new Date().toISOString() })
          .eq('id', userId);

        if (!error) {
          syncedSupabase = true;
        } else {
          console.warn('Could not sync role change to Supabase table:', error.message);
        }
      }
    } catch (err) {
      console.warn('Supabase update failed:', err);
    }

    return { 
      success: true, 
      message: `Đã cập nhật quyền của ${users[userIndex].email} thành ${newRole}${syncedSupabase ? ' (Đã lưu lên Supabase)' : ' (Lưu cục bộ)'}.`,
      user: users[userIndex],
      syncedSupabase
    };
  },

  /**
   * Syncs all local users up to the Supabase cloud database
   * @returns {Promise<{ success: boolean, count: number, message: string }>}
   */
  async syncUsersToSupabase() {
    try {
      const client = await getSupabase();
      if (!client) {
        return { success: false, count: 0, message: 'Không thể kết nối đến Supabase SDK.' };
      }

      const users = this.getUsers();
      const records = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status || 'active',
        avatar: u.avatar || (u.name ? u.name[0] : 'U')
      }));

      const { data, error } = await client
        .from('users')
        .upsert(records, { onConflict: 'email' })
        .select();

      if (error) {
        return { success: false, count: 0, message: `Lỗi Supabase: ${error.message}` };
      }

      return { 
        success: true, 
        count: data ? data.length : records.length, 
        message: `Đã đồng bộ thành công ${records.length} tài khoản lên bảng 'users' của Supabase!` 
      };
    } catch (err) {
      return { success: false, count: 0, message: `Lỗi kết nối: ${err.message}` };
    }
  },

  /**
   * Gets the currently active session user
   * @returns {Object} Active user profile
   */
  getCurrentUser() {
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      if (session) {
        return JSON.parse(session);
      }
    } catch (e) {
      console.warn('Could not read session:', e);
    }
    // Default session: Admin
    const defaultAdmin = DEFAULT_USERS[0];
    this.setCurrentUser(defaultAdmin);
    return defaultAdmin;
  },

  /**
   * Sets the currently active session user (for simulating ADMIN vs USER)
   * @param {Object} user 
   */
  setCurrentUser(user) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to set session:', e);
    }
  },

  /**
   * Checks whether the current user has ADMIN privileges
   * @returns {boolean}
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'ADMIN';
  },

  /**
   * Expose Supabase connection tester
   */
  testSupabase: testSupabaseConnection,
  getSupabaseStatus: getConnectionStatus
};
