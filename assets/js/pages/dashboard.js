/**
 * VideoAdmin - Dashboard Page Module
 * Renders KPI cards, Top 10 videos bar chart, and Day/Month views line chart.
 */

import { Sidebar }      from '../components/sidebar.js';
import { Header }       from '../components/header.js';
import { MOCK_VIDEOS, formatBytes, formatNumber } from '../mock-data.js';
import { requireAuth }  from '../services/auth-service.js';

let topVideosChartInstance = null;
let viewsOverTimeChartInstance = null;
let currentViewMode = 'day'; // 'day' | 'month'

export const DashboardPage = {
  init() {
    Sidebar.init('dashboard');
    Header.init({
      title: 'Dashboard',
      subtitle: 'Overview of your video library and viewing performance',
      showAddButton: true
    });

    this.renderKPIs();
    this.initCharts();
    this.bindEvents();
  },

  renderKPIs() {
    const totalVideos = MOCK_VIDEOS.length;
    const totalViews = MOCK_VIDEOS.reduce((acc, v) => acc + (v.views || 0), 0);
    const totalBytes = MOCK_VIDEOS.reduce((acc, v) => acc + (v.file_size_bytes || 0), 0);

    const totalVideosEl = document.getElementById('kpi-total-videos');
    const totalViewsEl = document.getElementById('kpi-total-views');
    const storageUsedEl = document.getElementById('kpi-storage-used');

    if (totalVideosEl) totalVideosEl.textContent = formatNumber(totalVideos);
    if (totalViewsEl) totalViewsEl.textContent = formatNumber(totalViews);
    if (storageUsedEl) storageUsedEl.textContent = formatBytes(totalBytes);
  },

  bindEvents() {
    const dayBtn = document.getElementById('toggle-day-btn');
    const monthBtn = document.getElementById('toggle-month-btn');

    if (dayBtn && monthBtn) {
      dayBtn.addEventListener('click', () => {
        if (currentViewMode === 'day') return;
        currentViewMode = 'day';
        dayBtn.classList.add('active');
        monthBtn.classList.remove('active');
        this.renderViewsOverTimeChart();
      });

      monthBtn.addEventListener('click', () => {
        if (currentViewMode === 'month') return;
        currentViewMode = 'month';
        monthBtn.classList.add('active');
        dayBtn.classList.remove('active');
        this.renderViewsOverTimeChart();
      });
    }
  },

  initCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded. Retrying in 500ms...');
      setTimeout(() => this.initCharts(), 500);
      return;
    }

    this.renderTopVideosChart();
    this.renderViewsOverTimeChart();
  },

  renderTopVideosChart() {
    const canvas = document.getElementById('topVideosChart');
    if (!canvas) return;

    if (topVideosChartInstance) {
      topVideosChartInstance.destroy();
    }

    // Sort descending by views and take top 10
    const top10 = [...MOCK_VIDEOS]
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Shorten titles for cleaner chart labels on bar chart
    const labels = top10.map(v => v.title.length > 24 ? v.title.substring(0, 22) + '...' : v.title);
    const data = top10.map(v => v.views);

    const ctx = canvas.getContext('2d');
    topVideosChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Views',
          data: data,
          backgroundColor: '#3867e8',
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 36
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#172033',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              title: (items) => {
                const idx = items[0].dataIndex;
                return top10[idx].title;
              },
              label: (context) => `Views: ${formatNumber(context.raw)}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 11 },
              color: '#697386'
            }
          },
          y: {
            grid: { color: '#f1f4f9' },
            ticks: {
              font: { size: 11 },
              color: '#697386',
              callback: (val) => val >= 1000 ? `${val / 1000}k` : val
            }
          }
        }
      }
    });
  },

  renderViewsOverTimeChart() {
    const canvas = document.getElementById('viewsOverTimeChart');
    if (!canvas) return;

    if (viewsOverTimeChartInstance) {
      viewsOverTimeChartInstance.destroy();
    }

    let labels = [];
    let data = [];

    if (currentViewMode === 'day') {
      // Last 14 days
      labels = [
        'Oct 26', 'Oct 27', 'Oct 28', 'Oct 29', 'Oct 30', 'Oct 31',
        'Nov 01', 'Nov 02', 'Nov 03', 'Nov 04', 'Nov 05', 'Nov 06', 'Nov 07', 'Nov 08'
      ];
      data = [4200, 5800, 8900, 11400, 10200, 12600, 14800, 13100, 15400, 14200, 16800, 15900, 17400, 18900];
    } else {
      // Last 12 months
      labels = [
        'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026',
        'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026'
      ];
      data = [18400, 22100, 26800, 31200, 38500, 42000, 46800, 53200, 61000, 74500, 89200, 128450];
    }

    const ctx = canvas.getContext('2d');
    viewsOverTimeChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Views',
          data: data,
          borderColor: '#15966b',
          backgroundColor: 'rgba(21, 150, 107, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: '#15966b',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#172033',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => `Views: ${formatNumber(context.raw)}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 11 },
              color: '#697386'
            }
          },
          y: {
            grid: { color: '#f1f4f9' },
            ticks: {
              font: { size: 11 },
              color: '#697386',
              callback: (val) => val >= 1000 ? `${val / 1000}k` : val
            }
          }
        }
      }
    });
  }
};
