/**
 * VideoAdmin - Modal Dialog Component
 * Provides accessible confirmation modals and dialogs.
 */

export const Modal = {
  activeCallback: null,

  init() {
    let overlay = document.getElementById('global-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'global-modal-overlay';
      overlay.className = 'modal-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.innerHTML = `
        <div class="modal-window">
          <div class="modal-header">
            <h3 id="global-modal-title" class="modal-title">Confirm Action</h3>
            <button id="global-modal-close" class="modal-close-btn" aria-label="Close dialog">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div id="global-modal-body" class="modal-body">
            Are you sure you want to proceed?
          </div>
          <div class="modal-footer">
            <button id="global-modal-cancel" class="btn btn-secondary">Cancel</button>
            <button id="global-modal-confirm" class="btn btn-danger">Confirm</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      // Event listeners
      document.getElementById('global-modal-close').addEventListener('click', () => Modal.close());
      document.getElementById('global-modal-cancel').addEventListener('click', () => Modal.close());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) Modal.close();
      });

      document.getElementById('global-modal-confirm').addEventListener('click', () => {
        if (typeof Modal.activeCallback === 'function') {
          Modal.activeCallback();
        }
        Modal.close();
      });

      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
          Modal.close();
        }
      });
    }
  },

  /**
   * Opens a confirmation modal
   * @param {Object} options
   * @param {string} options.title - Header title
   * @param {string} options.message - Body text / HTML
   * @param {string} [options.confirmText='Confirm'] - Label for confirm button
   * @param {string} [options.cancelText='Cancel'] - Label for cancel button
   * @param {boolean} [options.isDanger=true] - Whether confirm button is styled as danger
   * @param {Function} options.onConfirm - Callback when confirmed
   */
  confirm({ title = 'Confirm', message = '', confirmText = 'Confirm', cancelText = 'Cancel', isDanger = true, onConfirm }) {
    Modal.init();
    const overlay = document.getElementById('global-modal-overlay');
    const titleEl = document.getElementById('global-modal-title');
    const bodyEl = document.getElementById('global-modal-body');
    const confirmBtn = document.getElementById('global-modal-confirm');
    const cancelBtn = document.getElementById('global-modal-cancel');

    titleEl.textContent = title;
    bodyEl.innerHTML = message;
    confirmBtn.textContent = confirmText;
    cancelBtn.textContent = cancelText;

    if (isDanger) {
      confirmBtn.className = 'btn btn-danger';
    } else {
      confirmBtn.className = 'btn btn-primary';
    }

    Modal.activeCallback = onConfirm;
    overlay.classList.add('open');
    confirmBtn.focus();
  },

  close() {
    const overlay = document.getElementById('global-modal-overlay');
    if (overlay) {
      overlay.classList.remove('open');
    }
    Modal.activeCallback = null;
  }
};
