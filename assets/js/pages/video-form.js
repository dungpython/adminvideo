/**
 * VideoAdmin - Video Form Page Module (Add / Edit Video)
 * Handles input bindings, dynamic preview updates, form validation, and save prototype.
 */

import { Sidebar }     from '../components/sidebar.js';
import { Header }      from '../components/header.js';
import { Toast }       from '../components/toast.js';
import { MOCK_VIDEOS, MOCK_CATEGORIES } from '../mock-data.js';
import { requireAuth } from '../services/auth-service.js';

let editingVideoId = null;

export const VideoFormPage = {
  init() {
    // Check URL parameters for edit mode
    const params = new URLSearchParams(window.location.search);
    editingVideoId = params.get('id');

    const isEdit = Boolean(editingVideoId);

    Sidebar.init('video-form');
    Header.init({
      title: isEdit ? 'Edit Video' : 'Add New Video',
      subtitle: isEdit ? 'Update video metadata and media settings' : 'Upload and register a new video in your catalog',
      showAddButton: false
    });

    this.populateCategories();
    this.bindLivePreview();
    this.bindSubmit();

    if (isEdit) {
      this.loadVideoForEditing(editingVideoId);
    }
  },

  populateCategories() {
    const selectEl = document.getElementById('video-category');
    if (!selectEl) return;

    selectEl.innerHTML = '<option value="">Select Category</option>';
    MOCK_CATEGORIES.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      selectEl.appendChild(opt);
    });
  },

  loadVideoForEditing(id) {
    const video = MOCK_VIDEOS.find(v => String(v.id) === String(id));
    if (!video) {
      Toast.error('Video not found.');
      return;
    }

    // Populate inputs
    const titleInput = document.getElementById('video-title');
    const categorySelect = document.getElementById('video-category');
    const descInput = document.getElementById('video-description');
    const thumbInput = document.getElementById('video-thumbnail');
    const urlInput = document.getElementById('video-url');
    const sizeInput = document.getElementById('video-size');
    const tagsInput = document.getElementById('video-tags');

    if (titleInput) titleInput.value = video.title || '';
    if (categorySelect) categorySelect.value = video.category_id || '';
    if (descInput) descInput.value = video.description || '';
    if (thumbInput) thumbInput.value = video.thumbnail_url || '';
    if (urlInput) urlInput.value = video.video_url || '';
    if (sizeInput) sizeInput.value = Math.round((video.file_size_bytes || 0) / (1024 * 1024));
    if (tagsInput) tagsInput.value = (video.tags || []).join(', ');

    // Update live preview
    this.updatePreview();
  },

  bindLivePreview() {
    const titleInput = document.getElementById('video-title');
    const thumbInput = document.getElementById('video-thumbnail');
    const descInput = document.getElementById('video-description');
    const categorySelect = document.getElementById('video-category');

    const update = () => this.updatePreview();

    if (titleInput) titleInput.addEventListener('input', update);
    if (thumbInput) thumbInput.addEventListener('input', update);
    if (descInput) descInput.addEventListener('input', update);
    if (categorySelect) categorySelect.addEventListener('change', update);
  },

  updatePreview() {
    const title = document.getElementById('video-title')?.value.trim() || 'Untitled Video';
    const thumb = document.getElementById('video-thumbnail')?.value.trim();
    const desc = document.getElementById('video-description')?.value.trim() || 'No description provided yet.';
    const categorySelect = document.getElementById('video-category');
    const categoryName = categorySelect?.selectedOptions[0]?.text || 'General';

    const previewTitle = document.getElementById('preview-title');
    const previewDesc = document.getElementById('preview-desc');
    const previewCategory = document.getElementById('preview-category');
    const previewImg = document.getElementById('preview-img');
    const previewPlaceholder = document.getElementById('preview-placeholder');

    if (previewTitle) previewTitle.textContent = title;
    if (previewDesc) previewDesc.textContent = desc;
    if (previewCategory) previewCategory.textContent = categoryName;

    if (thumb && previewImg) {
      previewImg.src = thumb;
      previewImg.style.display = 'block';
      if (previewPlaceholder) previewPlaceholder.style.display = 'none';
    } else {
      if (previewImg) previewImg.style.display = 'none';
      if (previewPlaceholder) previewPlaceholder.style.display = 'flex';
    }
  },

  bindSubmit() {
    const form = document.getElementById('video-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const titleInput = document.getElementById('video-title');
      const titleError = document.getElementById('video-title-error');
      const title = titleInput?.value.trim();

      if (!title) {
        if (titleError) {
          titleError.textContent = 'Please provide a valid video title.';
          titleError.classList.add('visible');
        }
        titleInput?.focus();
        return;
      } else {
        if (titleError) titleError.classList.remove('visible');
      }

      // Simulated save for Milestone 1
      Toast.success(editingVideoId ? 'Video updated successfully! (Mock)' : 'Video created successfully! (Mock)');

      setTimeout(() => {
        window.location.href = 'videos.html';
      }, 1000);
    });
  }
};
