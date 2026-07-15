export function CarIllustration() {
  return (
    <svg viewBox="0 0 920 420" role="img" aria-label="Blue sports car in front of a city" className="h-full w-full">
      <defs>
        <linearGradient id="carBody" x1="120" x2="780" y1="250" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0a5faf" />
          <stop offset="0.45" stopColor="#178ed1" />
          <stop offset="1" stopColor="#0b4d91" />
        </linearGradient>
        <linearGradient id="carHighlight" x1="170" x2="710" y1="250" y2="330" gradientUnits="userSpaceOnUse">
          <stop stopColor="#40d8ff" />
          <stop offset="1" stopColor="#b8f4ff" stopOpacity="0.75" />
        </linearGradient>
        <radialGradient id="glow" cx="0" cy="0" r="1" gradientTransform="translate(264 252) rotate(70) scale(32)">
          <stop stopColor="#62e4ff" />
          <stop offset="1" stopColor="#62e4ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="920" height="420" rx="36" fill="#102133" />
      <g opacity="0.52">
        <path d="M0 238h920v94H0z" fill="#203448" />
        <path d="M72 238v-64h38v64h32v-118h56v118h30v-82h54v82h40V92h48v146h46V134h70v104h42V73h92v165h36V158h60v80h36V109h48v129h62v94H0v-94z" fill="#07111d" />
        <path d="M180 100h8v44h-8zm16 0h8v44h-8zm16 0h8v44h-8zm226 74h8v44h-8zm24 0h8v44h-8zm24 0h8v44h-8zm178-44h8v54h-8zm20 0h8v54h-8z" fill="#cfe9f7" opacity="0.38" />
      </g>
      <path d="M80 308h116M716 316h140" stroke="#9ac7dc" strokeWidth="10" opacity="0.18" />
      <ellipse cx="461" cy="354" rx="348" ry="23" fill="#02050a" opacity="0.9" />
      <path d="M132 273l64-62c29-28 76-45 129-51l160-18c50-6 86 3 125 25l90 50c38 22 76 43 126 54l34 8c9 2 16 10 15 19l-6 40-98 10-26-60-465 12-32 57H166l-47-48 9-27c1-4 2-7 4-9z" fill="url(#carBody)" stroke="#063b70" strokeWidth="5" />
      <path d="M306 166l174-20c52-6 83 0 119 20l70 40-246 3-132-17z" fill="#aab9b9" opacity="0.9" stroke="#06111c" strokeWidth="5" />
      <path d="M420 209l-162-14-88 69 148 8 90 52 265 9-50-55 65-70" fill="#0b68aa" opacity="0.9" />
      <path d="M187 286c112 3 242 7 394 15 86 5 161 11 226 18" stroke="url(#carHighlight)" strokeWidth="10" strokeLinecap="round" opacity="0.86" />
      <path d="M318 162l-46 31 73-22 52-23z" fill="#050a10" />
      <path d="M564 168l-64 39 119-3 51 25 50-18-112-54z" fill="#03070d" />
      <path d="M126 278l58 12-16 38-43-19z" fill="#44a8de" opacity="0.95" />
      <path d="M808 290l55 15-8 28-63-1z" fill="#16a4e4" />
      <path d="M150 270h30" stroke="#ef4444" strokeWidth="9" strokeLinecap="round" />
      <path d="M210 224c44-8 90-12 139-13" stroke="#6be4ff" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
      <path d="M463 213l-30 63c-8 16-27 21-42 11l-74-49" fill="none" stroke="#062a4b" strokeWidth="4" />
      <path d="M476 212l164-1" stroke="#062a4b" strokeWidth="5" />
      <path d="M512 233h24" stroke="#03111e" strokeWidth="6" strokeLinecap="round" />
      <circle cx="260" cy="333" r="57" fill="#07090d" />
      <circle cx="260" cy="333" r="42" fill="#d9dde0" />
      <circle cx="260" cy="333" r="16" fill="#20242b" />
      <g stroke="#4b5563" strokeWidth="5">
        {Array.from({ length: 14 }).map((_, index) => {
          const angle = (index * Math.PI * 2) / 14;
          const x1 = 260 + Math.cos(angle) * 19;
          const y1 = 333 + Math.sin(angle) * 19;
          const x2 = 260 + Math.cos(angle) * 40;
          const y2 = 333 + Math.sin(angle) * 40;
          return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <circle cx="690" cy="333" r="57" fill="#07090d" />
      <circle cx="690" cy="333" r="42" fill="#d9dde0" />
      <circle cx="690" cy="333" r="16" fill="#20242b" />
      <g stroke="#4b5563" strokeWidth="5">
        {Array.from({ length: 14 }).map((_, index) => {
          const angle = (index * Math.PI * 2) / 14;
          const x1 = 690 + Math.cos(angle) * 19;
          const y1 = 333 + Math.sin(angle) * 19;
          const x2 = 690 + Math.cos(angle) * 40;
          const y2 = 333 + Math.sin(angle) * 40;
          return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <circle cx="264" cy="252" r="44" fill="url(#glow)" />
    </svg>
  );
}
