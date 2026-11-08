/**
 * VideoAdmin - Video List Page Module
 * Handles video table rendering, live search, category filtering, sorting, pagination, and delete modal.
 */

import { Sidebar }     from '../components/sidebar.js';
import { Header }      from '../components/header.js';
import { Modal }       from '../components/modal.js';
import { Toast }       from '../components/toast.js';
import { MOCK_VIDEOS, MOCK_CATEGORIES, formatBytes, formatNumber } from '../mock-data.js';
import { requireAuth } from '../services/auth-service.js';

let videoData = [...MOCK_VIDEOS];
let searchTerm = '';
let selectedCategory = '';
let sortBy = 'newest';
let currentPage = 1;
const pageSize = 10;

export const VideosPage = {
  init() {
    Sidebar.init('videos');
    Header.init({
      title: 'Videos',
      subtitle: 'Manage, search, and organize your video catalog',
      showAddButton: true
    });

    this.populateCategoryFilter();
    this.bindEvents();
    this.render();
  },

  populateCategoryFilter() {
    const filterSelect = document.getElementById('category-filter');
    if (!filterSelect) return;

    filterSelect.innerHTML = '<option value="">All Categories</option>';
    MOCK_CATEGORIES.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = `${cat.name} (${cat.count})`;
      filterSelect.appendChild(opt);
    });
  },

  bindEvents() {
    const searchInput = document.getElementById('video-search-input');
    const categorySelect = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-select');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = '';
        if (sortSelect) sortSelect.value = 'newest';
        searchTerm = '';
        selectedCategory = '';
        sortBy = 'newest';
        currentPage = 1;
        this.render();
      });
    }

    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          searchTerm = e.target.value.trim().toLowerCase();
          currentPage = 1;
          this.render();
        }, 200);
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        selectedCategory = e.target.value;
        currentPage = 1;
        this.render();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        currentPage = 1;
        this.render();
      });
    }
  },

  getFilteredAndSortedData() {
    let result = [...videoData];

    // Filter by search
    if (searchTerm) {
      result = result.filter(v => 
        v.title.toLowerCase().includes(searchTerm) || 
        (v.description && v.description.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter(v => String(v.category_id) === String(selectedCategory));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'views-high') {
        return b.views - a.views;
      } else if (sortBy === 'views-low') {
        return a.views - b.views;
      }
      return 0;
    });

    return result;
  },

  render() {
    const tableBody = document.getElementById('video-table-body');
    const tableContainer = document.getElementById('table-card-container');
    const emptyState = document.getElementById('video-empty-state');
    const paginationContainer = document.getElementById('pagination-container');

    if (!tableBody) return;

    const filtered = this.getFilteredAndSortedData();
    const totalRecords = filtered.length;

    if (totalRecords === 0) {
      if (tableContainer) tableContainer.style.display = 'none';
      if (emptyState) emptyState.style.display = 'flex';
      if (paginationContainer) paginationContainer.style.display = 'none';
      return;
    }

    if (tableContainer) tableContainer.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    if (paginationContainer) paginationContainer.style.display = 'flex';

    // Pagination slice
    const totalPages = Math.ceil(totalRecords / pageSize);
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * pageSize;
    const pageVideos = filtered.slice(startIndex, startIndex + pageSize);

    // Render table rows safely
    tableBody.innerHTML = '';
    pageVideos.forEach(v => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 600; color: var(--color-text-muted); width: 60px;">#${v.id}</td>
        <td>
          <div class="video-cell">
            <img class="table-thumb" src="${v.thumbnail_url}" alt="${escapeHtml(v.title)}" loading="lazy" onerror="this.src='https://placehold.co/128x88/f1f4f9/697386?text=Thumb'" />
            <div class="video-cell-info">
              <span class="video-cell-title" title="${escapeHtml(v.title)}">${escapeHtml(v.title)}</span>
              <div class="video-cell-meta">
                <span class="badge badge-secondary">${escapeHtml(v.category_name || 'General')}</span>
                <span>•</span>
                <span>${formatBytes(v.file_size_bytes)}</span>
              </div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge badge-success" style="font-weight: 600;">
            ${formatNumber(v.views)} views
          </span>
        </td>
        <td style="color: var(--color-text-muted); font-size: var(--font-size-xs);">
          ${formatDate(v.created_at)}
        </td>
        <td>
          <div class="table-actions">
            <a href="video-form.html?id=${v.id}" class="btn btn-secondary btn-sm" title="Edit video">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span>Edit</span>
            </a>
            <button class="btn btn-danger-outline btn-sm delete-btn" data-id="${v.id}" title="Delete video">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </td>
      `;

      // Bind delete handler directly without inline attributes
      const deleteBtn = tr.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => {
        this.confirmDeleteVideo(v);
      });

      tableBody.appendChild(tr);
    });

    this.renderPagination(totalRecords, totalPages, startIndex, pageVideos.length);
  },

  renderPagination(totalRecords, totalPages, startIndex, currentCount) {
    const paginationInfo = document.getElementById('pagination-info');
    const paginationControls = document.getElementById('pagination-controls');

    if (paginationInfo) {
      const from = totalRecords === 0 ? 0 : startIndex + 1;
      const to = startIndex + currentCount;
      paginationInfo.textContent = `Showing ${from} to ${to} of ${totalRecords} videos`;
    }

    if (paginationControls) {
      paginationControls.innerHTML = '';

      // Prev Button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'page-num-btn';
      prevBtn.innerHTML = '&laquo;';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          this.render();
        }
      });
      paginationControls.appendChild(prevBtn);

      // Page numbers
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-num-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
          currentPage = i;
          this.render();
        });
        paginationControls.appendChild(pageBtn);
      }

      // Next Button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'page-num-btn';
      nextBtn.innerHTML = '&raquo;';
      nextBtn.disabled = currentPage === totalPages || totalPages === 0;
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          this.render();
        }
      });
      paginationControls.appendChild(nextBtn);
    }
  },

  confirmDeleteVideo(video) {
    Modal.confirm({
      title: 'Delete Video',
      message: `Are you sure you want to delete <strong>"${escapeHtml(video.title)}"</strong>?<br><br>This will remove the video record and its associated analytics.`,
      confirmText: 'Delete Video',
      cancelText: 'Cancel',
      isDanger: true,
      onConfirm: () => {
        // Remove from local array
        videoData = videoData.filter(v => v.id !== video.id);
        Toast.success(`Video "${video.title}" was deleted successfully.`);
        this.render();
      }
    });
  }
};

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
