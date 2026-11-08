/**
 * VideoAdmin - Central Application Entry Point
 */

import { Sidebar } from './components/sidebar.js';
import { Header } from './components/header.js';
import { Toast } from './components/toast.js';
import { Modal } from './components/modal.js';
import { PermissionService } from './services/permission-service.js';

export {
  Sidebar,
  Header,
  Toast,
  Modal,
  PermissionService
};

console.log('VideoAdmin Client App initialized.');
