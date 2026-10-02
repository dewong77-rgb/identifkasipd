const P = {
  check: 'M5 12.5l4.5 4.5L19 7.5',
  circle: 'M12 4a8 8 0 100 16 8 8 0 000-16z',
  half: 'M12 4a8 8 0 100 16V4z',
  alert: 'M12 8v5m0 3.5h.01M10.3 4.2L2.8 17.5A2 2 0 004.5 20.5h15a2 2 0 001.7-3L13.7 4.2a2 2 0 00-3.4 0z',
  info: 'M12 11v5m0-8.5h.01M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17z',
  search: 'M11 4a7 7 0 105 11.9l4 4M11 4a7 7 0 010 14',
  plus: 'M12 5v14M5 12h14',
  x: 'M6 6l12 12M18 6L6 18',
  refresh: 'M4 12a8 8 0 0114-5.3L20 9M20 4v5h-5M20 12a8 8 0 01-14 5.3L4 15M4 20v-5h5',
  back: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  chev: 'M6 9l6 6 6-6',
  chart: 'M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3',
  home: 'M4 11l8-7 8 7v8a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z',
  send: 'M4 12l16-8-6 16-3-7z',
  school: 'M3 10l9-5 9 5-9 5zM7 12.5V17c0 1 2.2 2 5 2s5-1 5-2v-4.5',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20a7.5 7.5 0 0115 0',
};

export default function Icon({ name, size = 20, className = '', strokeWidth = 2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={P[name]} />
    </svg>
  );
}

export function Spinner({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" fill="none" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
