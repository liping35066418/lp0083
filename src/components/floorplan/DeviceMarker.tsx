import React, { useState } from 'react';

interface DeviceMarkerProps {
  id: string;
  x: number;
  y: number;
  type: 'sensor' | 'camera' | 'router' | 'speaker';
  status: 'online' | 'offline' | 'warning';
  name?: string;
  onClick?: (id: string) => void;
}

const deviceColors = {
  sensor: { online: '#52c41a', offline: '#bfbfbf', warning: '#faad14' },
  camera: { online: '#1890ff', offline: '#bfbfbf', warning: '#faad14' },
  router: { online: '#722ed1', offline: '#bfbfbf', warning: '#faad14' },
  speaker: { online: '#13c2c2', offline: '#bfbfbf', warning: '#faad14' },
};

const DeviceMarker: React.FC<DeviceMarkerProps> = ({
  id,
  x,
  y,
  type,
  status,
  name,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const color = deviceColors[type][status];

  const handleClick = () => {
    onClick?.(id);
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      <g
        style={{
          transform: isHovered ? 'scale(1.2)' : 'scale(1)',
          transformOrigin: 'center center',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {type === 'sensor' && (
          <>
            <circle cx="0" cy="0" r="8" fill={color} />
            <circle cx="0" cy="0" r="4" fill="#fff" />
            {status === 'online' && (
              <circle cx="0" cy="0" r="12" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4">
                <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </>
        )}

        {type === 'camera' && (
          <>
            <rect x="-8" y="-6" width="16" height="12" rx="2" fill={color} />
            <circle cx="0" cy="0" r="3" fill="#fff" />
            <path d="M 8 -2 L 12 -4 L 12 4 L 8 2 Z" fill={color} />
          </>
        )}

        {type === 'router' && (
          <>
            <rect x="-7" y="-5" width="14" height="10" rx="1.5" fill={color} />
            <line x1="-4" y1="-5" x2="-4" y2="-9" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="-5" x2="0" y2="-11" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="4" y1="-5" x2="4" y2="-9" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {type === 'speaker' && (
          <>
            <path d="M -8 -6 L -3 -6 L 0 -10 L 0 10 L -3 6 L -8 6 Z" fill={color} />
            <rect x="-8" y="-4" width="3" height="8" rx="0.5" fill="#fff" />
            {status === 'online' && (
              <>
                <path d="M 3 -4 Q 6 0 3 4" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 6 -6 Q 10 0 6 6" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              </>
            )}
          </>
        )}

        {isHovered && name && (
          <text
            x="0"
            y="22"
            textAnchor="middle"
            fontSize="11"
            fill="#1a1a2e"
            fontWeight="500"
          >
            {name}
          </text>
        )}
      </g>
    </g>
  );
};

export default DeviceMarker;
