/**
 * VideoAdmin - Categories Page Module
 * Handles category list rendering, creation, renaming, and deletion.
 */

import { Sidebar }     from '../components/sidebar.js';
import { Header }      from '../components/header.js';
import { Modal }       from '../components/modal.js';
import { Toast }       from '../components/toast.js';
import { MOCK_CATEGORIES } from '../mock-data.js';
import { requireAuth } from '../services/auth-service.js';

let categories = [...MOCK_CATEGORIES];

export const CategoriesPage = {
  init() {
    Sidebar.init('categories');
    Header.init({
      title: 'Categories',
      subtitle: 'Manage and categorize your video library content',
      showAddButton: false
    });

    this.bindEvents();
    this.render();
  },

  bindEvents() {
    const addForm = document.getElementById('add-category-form');
    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('new-category-name');
        const descInput = document.getElementById('new-category-desc');
        const name = input?.value.trim();
        const desc = descInput?.value.trim() || '';

        if (!name) {
          Toast.error('Please enter a category name.');
          return;
        }

        const exists = categories.some(c => c.name.toLowerCase() === name.toLowerCase());
        if (exists) {
          Toast.error('A category with this name already exists.');
          return;
        }

        const newCat = {
          id: Date.now(),
          name: name,
          description: desc,
          count: 0
        };

        categories.unshift(newCat);
        input.value = '';
        if (descInput) descInput.value = '';
        Toast.success(`Category "${name}" created.`);
        this.render();
      });
    }
  },

  render() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    grid.innerHTML = '';
    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'category-card';
      card.innerHTML = `
        <div class="category-card-header">
          <div>
            <h3 class="category-card-title">${escapeHtml(cat.name)}</h3>
            <span class="category-card-count">${cat.count} videos</span>
          </div>
          <span class="badge badge-primary">#${cat.id}</span>
        </div>
        <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); line-height: 1.4;">
          ${escapeHtml(cat.description || 'No description.')}
        </p>
        <div class="category-card-actions">
          <button class="btn btn-secondary btn-sm rename-btn" data-id="${cat.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Rename
          </button>
          <button class="btn btn-danger-outline btn-sm delete-btn" data-id="${cat.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>
        </div>
      `;

      // Event listeners
      const renameBtn = card.querySelector('.rename-btn');
      renameBtn.addEventListener('click', () => {
        const newName = prompt('Enter new category name:', cat.name);
        if (newName && newName.trim() && newName.trim() !== cat.name) {
          cat.name = newName.trim();
          Toast.success(`Renamed category to "${cat.name}".`);
          this.render();
        }
      });

      const deleteBtn = card.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => {
        Modal.confirm({
          title: 'Delete Category',
          message: `Are you sure you want to delete category <strong>"${escapeHtml(cat.name)}"</strong>?`,
          confirmText: 'Delete',
          onConfirm: () => {
            categories = categories.filter(c => c.id !== cat.id);
            Toast.success(`Category "${cat.name}" deleted.`);
            this.render();
          }
        });
      });

      grid.appendChild(card);
    });
  }
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
