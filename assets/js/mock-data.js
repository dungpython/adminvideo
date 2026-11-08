/**
 * VideoAdmin - Milestone 1 Mock Data Store
 * Provides initial mock data for Dashboard, Video List, and Category views.
 */

export const MOCK_CATEGORIES = [
  { id: 1, name: 'Tutorials', description: 'Step-by-step programming and tech guides', count: 4 },
  { id: 2, name: 'Vlogs', description: 'Weekly updates and behind the scenes', count: 3 },
  { id: 3, name: 'Gaming', description: 'Gameplay highlights and walkthroughs', count: 2 },
  { id: 4, name: 'Product Reviews', description: 'Hardware and gadget hands-on reviews', count: 3 },
  { id: 5, name: 'Podcasts', description: 'Tech conversations and interviews', count: 2 }
];

export const MOCK_VIDEOS = [
  {
    id: 1,
    title: 'Building Modern Web Apps with Vanilla JavaScript',
    description: 'A comprehensive walkthrough on structuring modular vanilla JS applications without frameworks.',
    thumbnail_url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/vanilla-js-apps.mp4',
    file_name: 'vanilla-js-apps.mp4',
    file_size_bytes: 420000000, // ~400 MB
    category_id: 1,
    category_name: 'Tutorials',
    tags: ['JavaScript', 'Frontend', 'Vanilla'],
    views: 45200,
    status: 'active',
    created_at: '2026-10-28 14:20:00'
  },
  {
    id: 2,
    title: 'SQLite WASM in the Browser: In-Depth Guide',
    description: 'Learn how to compile and run SQLite in the client with sql.js and persist bytes in IndexedDB.',
    thumbnail_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/sqlite-wasm.mp4',
    file_name: 'sqlite-wasm.mp4',
    file_size_bytes: 385000000, // ~367 MB
    category_id: 1,
    category_name: 'Tutorials',
    tags: ['SQLite', 'WASM', 'Database'],
    views: 38400,
    status: 'active',
    created_at: '2026-10-29 09:15:00'
  },
  {
    id: 3,
    title: 'Desk Setup 2026: Ergonomic Coding Workstation Tour',
    description: 'Full walkthrough of my dual-monitor setup, standing desk, mechanical keyboard, and lighting.',
    thumbnail_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/desk-setup.mp4',
    file_name: 'desk-setup.mp4',
    file_size_bytes: 580000000, // ~553 MB
    category_id: 2,
    category_name: 'Vlogs',
    tags: ['Workspace', 'Setup', 'Productivity'],
    views: 24300,
    status: 'active',
    created_at: '2026-10-31 18:30:00'
  },
  {
    id: 4,
    title: 'Mechanical Keyboard Review: Custom 75% Gasket Mount',
    description: 'Sound test, switch comparison, and daily driving review after 3 months of use.',
    thumbnail_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/keyboard-review.mp4',
    file_name: 'keyboard-review.mp4',
    file_size_bytes: 310000000,
    category_id: 4,
    category_name: 'Product Reviews',
    tags: ['Hardware', 'Keyboards', 'Review'],
    views: 19800,
    status: 'active',
    created_at: '2026-11-01 11:00:00'
  },
  {
    id: 5,
    title: 'Deep Dive into CSS Grid and Modern Layouts',
    description: 'Master grid template areas, auto-fit, minmax, and subgrid for fluid web interfaces.',
    thumbnail_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/css-grid-deep-dive.mp4',
    file_name: 'css-grid-deep-dive.mp4',
    file_size_bytes: 460000000,
    category_id: 1,
    category_name: 'Tutorials',
    tags: ['CSS', 'WebDev', 'Design'],
    views: 18200,
    status: 'active',
    created_at: '2026-11-02 16:45:00'
  },
  {
    id: 6,
    title: 'The Future of AI Agent Pair Programming - Podcast #42',
    description: 'Special guest discussion on autonomous developer agents, safety boundaries, and workflow changes.',
    thumbnail_url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/podcast-ai-agents.mp4',
    file_name: 'podcast-ai-agents.mp4',
    file_size_bytes: 620000000,
    category_id: 5,
    category_name: 'Podcasts',
    tags: ['AI', 'Coding', 'Podcast'],
    views: 15600,
    status: 'active',
    created_at: '2026-11-03 10:00:00'
  },
  {
    id: 7,
    title: 'Speedrun Coding Challenge: Zero to Deployed App in 1 Hour',
    description: 'Can we build and launch a functional static web application from scratch within 60 minutes?',
    thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/speedrun-coding.mp4',
    file_name: 'speedrun-coding.mp4',
    file_size_bytes: 390000000,
    category_id: 2,
    category_name: 'Vlogs',
    tags: ['Challenge', 'Speedrun', 'WebDev'],
    views: 14100,
    status: 'active',
    created_at: '2026-11-04 13:20:00'
  },
  {
    id: 8,
    title: 'Retro Gaming Emulation on Low-Power Mini PC',
    description: 'Testing PS2, GameCube, and Dreamcast emulation performance on budget hardware.',
    thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/retro-gaming-mini-pc.mp4',
    file_name: 'retro-gaming-mini-pc.mp4',
    file_size_bytes: 475000000,
    category_id: 3,
    category_name: 'Gaming',
    tags: ['Gaming', 'Retro', 'Hardware'],
    views: 12500,
    status: 'active',
    created_at: '2026-11-04 20:10:00'
  },
  {
    id: 9,
    title: 'Ultralight Wireless Mouse Comparison & Sensor Benchmark',
    description: 'Testing weight distribution, latency, polling rates, and battery endurance across top contenders.',
    thumbnail_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/mouse-benchmark.mp4',
    file_name: 'mouse-benchmark.mp4',
    file_size_bytes: 280000000,
    category_id: 4,
    category_name: 'Product Reviews',
    tags: ['Peripherals', 'Review', 'Hardware'],
    views: 9400,
    status: 'active',
    created_at: '2026-11-05 15:40:00'
  },
  {
    id: 10,
    title: 'A Day in the Life of a Remote Software Engineer',
    description: 'From morning coffee and standup meetings to architecture design and evening workout.',
    thumbnail_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/day-in-life.mp4',
    file_name: 'day-in-life.mp4',
    file_size_bytes: 510000000,
    category_id: 2,
    category_name: 'Vlogs',
    tags: ['Lifestyle', 'RemoteWork', 'Software'],
    views: 8900,
    status: 'active',
    created_at: '2026-11-06 08:30:00'
  },
  {
    id: 11,
    title: 'Web Audio API: Synthesizers & Sound FX in JavaScript',
    description: 'Learn how to generate waveforms, create filters, and trigger sound effects directly in the browser.',
    thumbnail_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/web-audio-api.mp4',
    file_name: 'web-audio-api.mp4',
    file_size_bytes: 340000000,
    category_id: 1,
    category_name: 'Tutorials',
    tags: ['Audio', 'JavaScript', 'Creative'],
    views: 7300,
    status: 'active',
    created_at: '2026-11-06 17:00:00'
  },
  {
    id: 12,
    title: 'Indie Game Spotlight: Pixel Art Metroidvania Showcase',
    description: 'Exploring captivating atmosphere, tight combat controls, and soundtrack design.',
    thumbnail_url: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/indie-game-spotlight.mp4',
    file_name: 'indie-game-spotlight.mp4',
    file_size_bytes: 410000000,
    category_id: 3,
    category_name: 'Gaming',
    tags: ['Indie', 'Gaming', 'PixelArt'],
    views: 6100,
    status: 'active',
    created_at: '2026-11-07 12:15:00'
  },
  {
    id: 13,
    title: 'Noise Cancelling Headphones Head-to-Head: Flight Test',
    description: 'Real-world cabin noise cancellation, voice microphone isolation, and comfort comparison.',
    thumbnail_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/anc-headphones.mp4',
    file_name: 'anc-headphones.mp4',
    file_size_bytes: 325000000,
    category_id: 4,
    category_name: 'Product Reviews',
    tags: ['Audio', 'Headphones', 'ANC'],
    views: 5400,
    status: 'active',
    created_at: '2026-11-07 19:40:00'
  },
  {
    id: 14,
    title: 'Open Source Maintainer Realities - Podcast #43',
    description: 'Discussion on funding open source, dealing with burnout, and managing community PRs.',
    thumbnail_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&auto=format&fit=crop&q=80',
    video_url: 'https://example.com/videos/podcast-open-source.mp4',
    file_name: 'podcast-open-source.mp4',
    file_size_bytes: 490000000,
    category_id: 5,
    category_name: 'Podcasts',
    tags: ['OpenSource', 'Community', 'Podcast'],
    views: 4800,
    status: 'active',
    created_at: '2026-11-08 10:00:00'
  }
];

// Helper formatters
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatNumber(num) {
  return new Intl.NumberFormat().format(num || 0);
}
