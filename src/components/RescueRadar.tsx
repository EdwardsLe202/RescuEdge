import React from "react";

export default function RescueRadar() {
  return (
    <div className="w-full h-full relative flex items-center justify-center bg-[#090d16]">
      {/* CSS style block for keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes flow-dots {
          to { stroke-dashoffset: -20; }
        }
        @keyframes central-glow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.4)); }
          50% { filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.8)); }
        }
      `}} />

      {/* Radar screen layout */}
      <svg 
        viewBox="0 0 400 600" 
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full bg-[#090d16] relative overflow-hidden"
      >
        <defs>
          <radialGradient id="radial-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="radar-gradient" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Faint Tactical Coordinate Grid Lines */}
        <line x1="50" y1="0" x2="50" y2="600" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="100" y1="0" x2="100" y2="600" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="150" y1="0" x2="150" y2="600" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="200" y1="0" x2="200" y2="600" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <line x1="250" y1="0" x2="250" y2="600" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="300" y1="0" x2="300" y2="600" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="350" y1="0" x2="350" y2="600" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

        <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="0" y1="250" x2="400" y2="250" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="0" y1="300" x2="400" y2="300" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <line x1="0" y1="350" x2="400" y2="350" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="0" y1="400" x2="400" y2="400" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="0" y1="450" x2="400" y2="450" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="0" y1="500" x2="400" y2="500" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="0" y1="550" x2="400" y2="550" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

        {/* Faint Radar Rings (Subtle reference guides centered on HQ) */}
        <circle cx="200" cy="300" r="280" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="1" />
        {/* Active Scanning Boundary Ring with high-tech double border */}
        <circle cx="200" cy="300" r="180" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.4" />
        <circle cx="200" cy="300" r="175" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4,4" opacity="0.25" />
        <circle cx="200" cy="300" r="90" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
        
        {/* Radar ambient green radial glow (contained inside the r=180 circle) */}
        <circle cx="200" cy="300" r="180" fill="url(#radial-glow)" />

        {/* Sweeping Sonar Scanner Line (restricted inside r=180 circle) */}
        <g style={{ animation: 'radar-sweep 10s linear infinite', transformOrigin: '200px 300px' }}>
          <path d="M200,300 L200,120 A180,180 0 0,1 380,300 Z" fill="url(#radar-gradient)" />
          <line x1="200" y1="300" x2="200" y2="120" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
        </g>

        {/* Connection flow lines mapping target feeds (red dots flowing outwards to targets) */}
        <path d="M200,300 L70,140" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4,4" style={{ animation: 'flow-dots 1.5s linear infinite' }} fill="none" />
        <path d="M200,300 L330,150" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4,4" style={{ animation: 'flow-dots 1.2s linear infinite' }} fill="none" />
        <path d="M200,300 L80,220" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4,4" style={{ animation: 'flow-dots 1.8s linear infinite' }} fill="none" />
        <path d="M200,300 L320,240" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4,4" style={{ animation: 'flow-dots 1.4s linear infinite' }} fill="none" />
        <path d="M200,300 L70,380" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4,4" style={{ animation: 'flow-dots 1.6s linear infinite' }} fill="none" />
        <path d="M200,300 L330,370" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4,4" style={{ animation: 'flow-dots 1.7s linear infinite' }} fill="none" />
        <path d="M200,300 L120,460" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4,4" style={{ animation: 'flow-dots 1.3s linear infinite' }} fill="none" />
        <path d="M200,300 L280,450" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4,4" style={{ animation: 'flow-dots 1.9s linear infinite' }} fill="none" />
        <path d="M200,300 L210,180" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4,4" style={{ animation: 'flow-dots 1.1s linear infinite' }} fill="none" />
        <path d="M200,300 L180,420" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4,4" style={{ animation: 'flow-dots 1.5s linear infinite' }} fill="none" />

        {/* NODE 1: Human Target 01 */}
        <g>
          <circle cx="70" cy="140" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="0s" repeatCount="indefinite" />
          </circle>
          <circle cx="70" cy="140" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="70" cy="140" r="11" fill="#ef4444" />
          <circle cx="70" cy="136" r="3.2" fill="white" />
          <path d="M64,144.5 C64,142 66.5,140 70,140 C73.5,140 76,142 76,144.5 Z" fill="white" />
          <rect x="56" y="126" width="28" height="28" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3,3" />
          <rect x="59" y="118" width="22" height="8" fill="#ef4444" rx="1" />
          <text x="70" y="124" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HUMAN</text>
          <text x="70" y="166" fill="#ef4444" fontSize="8" fontWeight="800" fontFamily="monospace" textAnchor="middle" letterSpacing="0.05em">TARGET 01</text>
        </g>

        {/* NODE 2: Human Target 02 */}
        <g>
          <circle cx="330" cy="150" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="0.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="330" cy="150" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="330" cy="150" r="11" fill="#ef4444" />
          <circle cx="330" cy="146" r="3.2" fill="white" />
          <path d="M324,154.5 C324,152 326.5,150 330,150 C333.5,150 336,152 336,154.5 Z" fill="white" />
          <rect x="316" y="136" width="28" height="28" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3,3" />
          <rect x="319" y="128" width="22" height="8" fill="#ef4444" rx="1" />
          <text x="330" y="134" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HUMAN</text>
          <text x="330" y="176" fill="#ef4444" fontSize="8" fontWeight="800" fontFamily="monospace" textAnchor="middle" letterSpacing="0.05em">TARGET 02</text>
        </g>

        {/* NODE 3: Human Target 03 */}
        <g>
          <circle cx="80" cy="220" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="80" cy="220" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="80" cy="220" r="11" fill="#ef4444" />
          <circle cx="80" cy="216" r="3.2" fill="white" />
          <path d="M74,224.5 C74,222 76.5,220 80,220 C83.5,220 86,222 86,224.5 Z" fill="white" />
          <rect x="66" y="206" width="28" height="28" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3,3" />
          <rect x="69" y="198" width="22" height="8" fill="#ef4444" rx="1" />
          <text x="80" y="204" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HUMAN</text>
          <text x="80" y="246" fill="#ef4444" fontSize="8" fontWeight="800" fontFamily="monospace" textAnchor="middle" letterSpacing="0.05em">TARGET 03</text>
        </g>

        {/* NODE 4: Human Target 04 */}
        <g>
          <circle cx="320" cy="240" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="0.9s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="0.9s" repeatCount="indefinite" />
          </circle>
          <circle cx="320" cy="240" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="2.1s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="2.1s" repeatCount="indefinite" />
          </circle>
          <circle cx="320" cy="240" r="11" fill="#ef4444" />
          <circle cx="320" cy="236" r="3.2" fill="white" />
          <path d="M314,244.5 C314,242 316.5,240 320,240 C323.5,240 326,242 326,244.5 Z" fill="white" />
          <rect x="306" y="226" width="28" height="28" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3,3" />
          <rect x="309" y="218" width="22" height="8" fill="#ef4444" rx="1" />
          <text x="320" y="224" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HUMAN</text>
          <text x="320" y="266" fill="#ef4444" fontSize="8" fontWeight="800" fontFamily="monospace" textAnchor="middle" letterSpacing="0.05em">TARGET 04</text>
        </g>

        {/* NODE 5: Human Target 05 */}
        <g>
          <circle cx="70" cy="380" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="0.1s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="0.1s" repeatCount="indefinite" />
          </circle>
          <circle cx="70" cy="380" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="1.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="1.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="70" cy="380" r="11" fill="#ef4444" />
          <circle cx="70" cy="376" r="3.2" fill="white" />
          <path d="M64,384.5 C64,382 66.5,380 70,380 C73.5,380 76,382 76,384.5 Z" fill="white" />
          <rect x="56" y="366" width="28" height="28" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3,3" />
          <rect x="59" y="358" width="22" height="8" fill="#ef4444" rx="1" />
          <text x="70" y="364" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HUMAN</text>
          <text x="70" y="406" fill="#ef4444" fontSize="8" fontWeight="800" fontFamily="monospace" textAnchor="middle" letterSpacing="0.05em">TARGET 05</text>
        </g>

        {/* NODE 6: Human Target 06 */}
        <g>
          <circle cx="330" cy="370" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="330" cy="370" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="1.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="330" cy="370" r="11" fill="#ef4444" />
          <circle cx="330" cy="366" r="3.2" fill="white" />
          <path d="M324,374.5 C324,372 326.5,370 330,370 C333.5,370 336,372 336,374.5 Z" fill="white" />
          <rect x="316" y="356" width="28" height="28" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3,3" />
          <rect x="319" y="348" width="22" height="8" fill="#ef4444" rx="1" />
          <text x="330" y="354" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HUMAN</text>
          <text x="330" y="396" fill="#ef4444" fontSize="8" fontWeight="800" fontFamily="monospace" textAnchor="middle" letterSpacing="0.05em">TARGET 06</text>
        </g>

        {/* NODE 7: Human Target 07 */}
        <g>
          <circle cx="120" cy="460" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="0.7s" repeatCount="indefinite" />
          </circle>
          <circle cx="120" cy="460" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="1.9s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="1.9s" repeatCount="indefinite" />
          </circle>
          <circle cx="120" cy="460" r="11" fill="#ef4444" />
          <circle cx="120" cy="456" r="3.2" fill="white" />
          <path d="M114,464.5 C114,462 116.5,460 120,460 C123.5,460 126,462 126,464.5 Z" fill="white" />
          <rect x="106" y="446" width="28" height="28" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3,3" />
          <rect x="109" y="438" width="22" height="8" fill="#ef4444" rx="1" />
          <text x="120" y="444" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HUMAN</text>
          <text x="120" y="486" fill="#ef4444" fontSize="8" fontWeight="800" fontFamily="monospace" textAnchor="middle" letterSpacing="0.05em">TARGET 07</text>
        </g>

        {/* NODE 8: Human Target 08 */}
        <g>
          <circle cx="280" cy="450" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="280" cy="450" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="280" cy="450" r="11" fill="#ef4444" />
          <circle cx="280" cy="446" r="3.2" fill="white" />
          <path d="M274,454.5 C274,452 276.5,450 280,450 C283.5,450 286,452 286,454.5 Z" fill="white" />
          <rect x="266" y="436" width="28" height="28" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3,3" />
          <rect x="269" y="428" width="22" height="8" fill="#ef4444" rx="1" />
          <text x="280" y="434" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HUMAN</text>
          <text x="280" y="476" fill="#ef4444" fontSize="8" fontWeight="800" fontFamily="monospace" textAnchor="middle" letterSpacing="0.05em">TARGET 08</text>
        </g>

        {/* NODE 9: Human Target 09 */}
        <g>
          <circle cx="210" cy="180" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="0.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="0.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="210" cy="180" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="1.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="210" cy="180" r="11" fill="#ef4444" />
          <circle cx="210" cy="176" r="3.2" fill="white" />
          <path d="M204,184.5 C204,182 206.5,180 210,180 C213.5,180 216,182 216,184.5 Z" fill="white" />
          <rect x="196" y="166" width="28" height="28" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3,3" />
          <rect x="199" y="158" width="22" height="8" fill="#ef4444" rx="1" />
          <text x="210" y="164" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HUMAN</text>
          <text x="210" y="206" fill="#ef4444" fontSize="8" fontWeight="800" fontFamily="monospace" textAnchor="middle" letterSpacing="0.05em">TARGET 09</text>
        </g>

        {/* NODE 10: Human Target 10 */}
        <g>
          <circle cx="180" cy="420" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="0.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="180" cy="420" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" from="11" to="35" dur="2.4s" begin="1.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin="1.7s" repeatCount="indefinite" />
          </circle>
          <circle cx="180" cy="420" r="11" fill="#ef4444" />
          <circle cx="180" cy="416" r="3.2" fill="white" />
          <path d="M174,424.5 C174,422 176.5,420 180,420 C183.5,420 186,422 186,424.5 Z" fill="white" />
          <rect x="166" y="406" width="28" height="28" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3,3" />
          <rect x="169" y="398" width="22" height="8" fill="#ef4444" rx="1" />
          <text x="180" y="404" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HUMAN</text>
          <text x="180" y="446" fill="#ef4444" fontSize="8" fontWeight="800" fontFamily="monospace" textAnchor="middle" letterSpacing="0.05em">TARGET 10</text>
        </g>

        {/* CENTRAL COORDINATION HUB (RescuEdge Logo representing base search team / controller) */}
        <g style={{ animation: 'central-glow 3s ease-in-out infinite' }}>
          {/* Double radiating circles */}
          <circle cx="200" cy="300" r="20" fill="none" stroke="#10b981" strokeWidth="1.5">
            <animate attributeName="r" from="20" to="56" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="300" r="20" fill="none" stroke="#10b981" strokeWidth="1.5">
            <animate attributeName="r" from="20" to="56" dur="3s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="3s" begin="1.5s" repeatCount="indefinite" />
          </circle>
          {/* Circle base with white background to make the logo pop */}
          <circle cx="200" cy="300" r="20" fill="white" stroke="#10b981" strokeWidth="2" />
          {/* Logo image centered */}
          <image href="/images/rescuedge.png" x="183" y="283" width="34" height="34" />
          <text x="200" y="344" fill="#10b981" fontSize="9" fontWeight="900" fontFamily="monospace" textAnchor="middle" letterSpacing="0.1em">RESCUEDGE</text>
          <text x="200" y="354" fill="#a7f3d0" fontSize="7" fontWeight="500" fontFamily="monospace" textAnchor="middle">ACTIVE SCAN</text>
        </g>
      </svg>
    </div>
  );
}
