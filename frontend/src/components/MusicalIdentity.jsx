import OfficialLogo from "./OfficialLogo";

// Curvas e notas inspiradas no pentagrama da marca oficial.
// Elemento decorativo: não representa uma partitura ou um registro histórico.
export function MusicalStaff({ className = "" }) {
  return (
    <svg
      className={`musical-staff ${className}`}
      viewBox="0 0 640 300"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="1.2">
        {[0, 14, 28, 42, 56].map((offset) => (
          <path
            key={offset}
            d={`M-30 ${198 + offset} C145 ${70 + offset} 300 ${302 + offset} 690 ${30 + offset}`}
          />
        ))}
      </g>
      <g fill="currentColor">
        <ellipse
          cx="149"
          cy="169"
          rx="9"
          ry="6"
          transform="rotate(-24 149 169)"
        />
        <path d="M155 167V112h3v54z" />
        <ellipse
          cx="368"
          cy="164"
          rx="9"
          ry="6"
          transform="rotate(-24 368 164)"
        />
        <path d="M374 162v-55h3v54z" />
        <ellipse
          cx="414"
          cy="149"
          rx="9"
          ry="6"
          transform="rotate(-24 414 149)"
        />
        <path d="M420 147V92h3v54zM374 107l49-15v7l-49 15z" />
        <ellipse
          cx="553"
          cy="96"
          rx="9"
          ry="6"
          transform="rotate(-24 553 96)"
        />
        <path d="M559 94V39h3v54z" />
      </g>
    </svg>
  );
}

export function BrandComposition() {
  return (
    <div className="brand-composition">
      <OfficialLogo priority />
    </div>
  );
}

export function ArchiveNotice({ children, className = "" }) {
  return (
    <div className={`archive-notice ${className}`}>
      <div>{children}</div>
    </div>
  );
}
