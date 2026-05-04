/* Crown + skull hybrid, 8×8 pixel grid */
interface Props {
  size?: number;
}

export function LogoIcon({ size = 14 }: Props) {
  return (
    <svg
      viewBox="0 0 8 8"
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      {/* Crown base */}
      <rect x="1" y="4" width="6" height="3" fill="#d4a030" />
      {/* Crown points */}
      <rect x="1" y="2" width="1" height="2" fill="#d4a030" />
      <rect x="3" y="1" width="2" height="3" fill="#d4a030" />
      <rect x="6" y="2" width="1" height="2" fill="#d4a030" />
      {/* Skull eye sockets */}
      <rect x="2" y="5" width="1" height="1" fill="#0a0008" />
      <rect x="5" y="5" width="1" height="1" fill="#0a0008" />
      {/* Gem in crown peak */}
      <rect x="3" y="1" width="2" height="1" fill="#ff3a7a" />
    </svg>
  );
}
