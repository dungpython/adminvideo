/**
 * VideoAdmin - Permissions Page Module (with Supabase Cloud Backend Integration)
 * Controls user role management, ADMIN/USER permission editing, and Supabase cloud sync.
 */

import { Sidebar } from '../components/sidebar.js';
import { Header } from '../components/header.js';
import { Modal } from '../components/modal.js';
import { Toast } from '../components/toast.js';
import { PermissionService } from '../services/permission-service.js';

let searchTerm = '';
let roleFilter = '';

export const PermissionsPage = {
  async init() {
    Sidebar.init('permissions');
    Header.init({
      title: 'Phân Quyền (Permissions)',
      subtitle: 'Quản lý danh sách tài khoản, vai trò ADMIN/USER và đồng bộ Supabase Cloud',
      showAddButton: false
    });

    this.populateRoleSimulator();
    this.bindEvents();
    this.render();

    // Check Supabase connection and fetch remote data asynchronously
    await this.checkSupabaseStatus();
  },

  /**
   * Tests Supabase connectivity, updates the small inline badge on this page,
   * then loads remote data if connection is available.
   */
  async checkSupabaseStatus() {
    const badgeText = document.getElementById('supabase-status-text');
    const badgeDot  = document.getElementById('supabase-dot');
    const badgeWrap = document.getElementById('supabase-status-badge');

    // Update inline badge if present on the page
    const setInlineBadge = (connected, ms, err) => {
      if (!badgeDot || !badgeText) return;
      if (connected) {
        badgeDot.style.background = '#15966b';
        badgeText.textContent = `Supabase: Đã kết nối (${ms}ms)`;
        if (badgeWrap) badgeWrap.title = `Kết nối thành công đến Supabase Cloud (${ms}ms)`;
      } else {
        badgeDot.style.background = '#697386';
        badgeText.textContent = 'Supabase: Chế độ cục bộ';
        if (badgeWrap) badgeWrap.title = `Không thể kết nối (${err || 'Offline'}) — dùng localStorage`;
      }
    };

    if (badgeDot) badgeDot.style.background = '#d98a16'; // pending
    if (badgeText) badgeText.textContent = 'Supabase: Đang kết nối...';

    const status = await PermissionService.testSupabase();
    setInlineBadge(status.connected, status.latencyMs, status.error);

    if (status.connected) {
      // Load fresh user list from cloud
      const remote = await PermissionService.fetchUsersRemote();
      if (remote.source === 'supabase') {
        Toast.info(`Đã tải ${remote.users.length} tài khoản từ Supabase Cloud.`);
        this.render();
        this.populateRoleSimulator();
      }
    }
  },

  /**
   * Sets up the interactive role simulator dropdown
   */
  populateRoleSimulator() {
    const select = document.getElementById('simulate-user-select');
    if (!select) return;

    const users = PermissionService.getUsers();
    const currentUser = PermissionService.getCurrentUser();

    select.innerHTML = '';
    users.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = `${u.name} [${u.role}] (${u.email})`;
      if (String(u.id) === String(currentUser.id)) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });

    select.addEventListener('change', (e) => {
      const targetId = e.target.value;
      const targetUser = users.find(u => String(u.id) === String(targetId));
      if (targetUser) {
        PermissionService.setCurrentUser(targetUser);
        Toast.info(`Đã chuyển đổi sang tài khoản: ${targetUser.name} (${targetUser.role})`);
        Sidebar.init('permissions');
        this.render();
      }
    });

    const switchToAdminBtn = document.getElementById('switch-to-admin-btn');
    if (switchToAdminBtn) {
      switchToAdminBtn.addEventListener('click', () => {
        const adminUser = users.find(u => u.role === 'ADMIN') || users[0];
        PermissionService.setCurrentUser(adminUser);
        select.value = adminUser.id;
        Toast.success('Đã chuyển lại sang tài khoản quyền ADMIN.');
        Sidebar.init('permissions');
        this.render();
      });
    }
  },

  bindEvents() {
    const searchInput = document.getElementById('user-search-input');
    const filterSelect = document.getElementById('role-filter');
    const resetBtn = document.getElementById('reset-users-btn');
    const syncSupabaseBtn = document.getElementById('sync-supabase-btn');

    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          searchTerm = e.target.value.trim().toLowerCase();
          this.renderTable();
        }, 200);
      });
    }

    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        roleFilter = e.target.value;
        this.renderTable();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        Modal.confirm({
          title: 'Khôi phục tài khoản mẫu',
          message: 'Bạn có chắc chắn muốn đặt lại danh sách gồm <strong>1 tài khoản ADMIN và 10 tài khoản USER mẫu</strong> ban đầu?',
          confirmText: 'Đặt lại',
          cancelText: 'Hủy',
          isDanger: false,
          onConfirm: () => {
            PermissionService.resetUsers();
            Toast.success('Đã khôi phục thành công danh sách tài khoản mẫu ban đầu.');
            this.populateRoleSimulator();
            this.render();
          }
        });
      });
    }

    // Supabase Cloud Sync button
    if (syncSupabaseBtn) {
      syncSupabaseBtn.addEventListener('click', async () => {
        syncSupabaseBtn.disabled = true;
        const originalText = syncSupabaseBtn.innerHTML;
        syncSupabaseBtn.innerHTML = `<span>Đang đồng bộ...</span>`;

        Toast.info('Đang đồng bộ dữ liệu lên cơ sở dữ liệu Supabase Cloud...');
        const result = await PermissionService.syncUsersToSupabase();

        syncSupabaseBtn.disabled = false;
        syncSupabaseBtn.innerHTML = originalText;

        if (result.success) {
          Toast.success(result.message);
          this.checkSupabaseStatus();
        } else {
          Toast.error(result.message);
        }
      });
    }
  },

  render() {
    const isAdmin = PermissionService.isAdmin();
    const adminView = document.getElementById('admin-permission-view');
    const deniedView = document.getElementById('access-denied-view');

    if (!isAdmin) {
      // Current user is USER: Show Access Denied UI
      if (adminView) adminView.style.display = 'none';
      if (deniedView) deniedView.style.display = 'flex';
      return;
    }

    // Current user is ADMIN: Show Permission Management UI
    if (adminView) adminView.style.display = 'block';
    if (deniedView) deniedView.style.display = 'none';

    this.renderKPIs();
    this.renderTable();
  },

  renderKPIs() {
    const users = PermissionService.getUsers();
    const totalUsers = users.length;
    const totalAdmins = users.filter(u => u.role === 'ADMIN').length;
    const totalRegular = users.filter(u => u.role === 'USER').length;

    const totalEl = document.getElementById('kpi-total-users');
    const adminEl = document.getElementById('kpi-total-admins');
    const regularEl = document.getElementById('kpi-total-regular-users');

    if (totalEl) totalEl.textContent = totalUsers;
    if (adminEl) adminEl.textContent = totalAdmins;
    if (regularEl) regularEl.textContent = totalRegular;
  },

  renderTable() {
    const tableBody = document.getElementById('users-table-body');
    const emptyState = document.getElementById('users-empty-state');
    if (!tableBody) return;

    let users = PermissionService.getUsers();
    const currentUser = PermissionService.getCurrentUser();

    // Filter by search
    if (searchTerm) {
      users = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm) || 
        u.email.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by role
    if (roleFilter) {
      users = users.filter(u => u.role === roleFilter);
    }

    if (users.length === 0) {
      tableBody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    tableBody.innerHTML = '';

    users.forEach(user => {
      const isCurrentLoggedIn = String(user.id) === String(currentUser.id);
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td style="font-weight: 600; color: var(--color-text-muted);">#${user.id}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="width: 38px; height: 38px; border-radius: var(--radius-full); background: ${user.role === 'ADMIN' ? 'var(--color-primary-light)' : 'var(--color-surface-muted)'}; color: ${user.role === 'ADMIN' ? 'var(--color-primary)' : 'var(--color-text-muted)'}; font-weight: 700; font-size: var(--font-size-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid var(--color-border);">
              ${escapeHtml(user.avatar || (user.name ? user.name[0] : 'U'))}
            </div>
            <div>
              <div style="font-weight: 600; color: var(--color-text); display: flex; align-items: center; gap: 0.4rem;">
                <span>${escapeHtml(user.name)}</span>
                ${isCurrentLoggedIn ? '<span class="badge badge-primary" style="font-size: 10px; padding: 1px 6px;">Bạn (Current)</span>' : ''}
              </div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${escapeHtml(user.email)}</div>
            </div>
          </div>
        </td>
        <td>
          ${user.role === 'ADMIN' ? `
            <span class="badge badge-primary" style="font-weight: 600; gap: 0.4rem; padding: 0.3rem 0.65rem;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              ADMIN
            </span>
          ` : `
            <span class="badge badge-secondary" style="font-weight: 600; gap: 0.4rem; padding: 0.3rem 0.65rem;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              USER
            </span>
          `}
        </td>
        <td>
          <span class="badge badge-success">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:currentColor; margin-right:4px;"></span>
            Active
          </span>
        </td>
        <td style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
          ${formatDate(user.created_at)}
        </td>
        <td style="text-align: right; padding-right: 1.5rem;">
          <select 
            class="form-select role-select-input" 
            data-user-id="${user.id}" 
            style="width: 140px; display: inline-block; padding: 0.35rem 0.65rem; font-size: var(--font-size-xs); font-weight: 600; cursor: pointer;"
            aria-label="Thay đổi vai trò cho ${escapeHtml(user.email)}"
          >
            <option value="USER" ${user.role === 'USER' ? 'selected' : ''}>Role: USER</option>
            <option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>Role: ADMIN</option>
          </select>
        </td>
      `;

      // Bind change event to select without inline handlers
      const roleSelect = tr.querySelector('.role-select-input');
      roleSelect.addEventListener('change', async (e) => {
        const newRole = e.target.value;
        const result = await PermissionService.updateUserRole(user.id, newRole);

        if (result.success) {
          Toast.success(result.message);
          this.renderKPIs();
          this.renderTable();
          this.populateRoleSimulator();
        } else {
          Toast.error(result.message);
          // Revert selection
          e.target.value = user.role;
        }
      });

      tableBody.appendChild(tr);
    });
  }
};

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
