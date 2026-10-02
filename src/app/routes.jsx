import { lazy } from 'react';

// Daftar menu. Menambah menu baru: buat folder di src/features, lalu tambah satu baris di sini.
// needsSession: layar hanya bisa dibuka setelah petugas memilih sekolah.
export const ROUTES = [
  { path: '/', title: 'Beranda', nav: true, Component: lazy(() => import('@/features/beranda')) },
  { path: '/dukung', title: 'Data dukung', needsSession: true, Component: lazy(() => import('@/features/dukung')) },
  { path: '/wawancara', title: 'Wawancara', needsSession: true, Component: lazy(() => import('@/features/wawancara')) },
  { path: '/tinjau', title: 'Tinjau dan kirim', needsSession: true, Component: lazy(() => import('@/features/tinjau')) },
  { path: '/sukses', title: 'Terkirim', needsSession: true, Component: lazy(() => import('@/features/sukses')) },
  { path: '/panduan', title: 'Panduan', nav: true, Component: lazy(() => import('@/features/panduan')) },
  { path: '/dashboard', title: 'Dashboard', nav: true, Component: lazy(() => import('@/features/dashboard')) },
];
