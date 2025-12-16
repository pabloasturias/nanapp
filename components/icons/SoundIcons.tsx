import React from 'react';

export interface IconProps {
    className?: string;
    size?: number;
    color?: string;
}

const BaseIcon: React.FC<IconProps & { children: React.ReactNode }> = ({ className, size = 24, color = "currentColor", children }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {children}
    </svg>
);

export const WhiteNoiseIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="M12 6v12" strokeDasharray="1 3" />
        <path d="M6 12h12" strokeDasharray="1 3" />
        <path d="M8 8l8 8" strokeDasharray="1 3" />
        <path d="M16 8l-8 8" strokeDasharray="1 3" />
    </BaseIcon>
);

export const RainIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M8 12l-2 3" />
        <path d="M12 12l-2 3" />
        <path d="M16 12l-2 3" />
        <path d="M10 16l-2 3" />
        <path d="M14 16l-2 3" />
        <path d="M20 10.5A4.5 4.5 0 0 0 15.5 6H15a6 6 0 0 0-11.67 2C3.16 8.5 3 9 3 10a4 4 0 0 0 4 4" />
    </BaseIcon>
);

export const BrownNoiseIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M2 15c3.31 0 5-5 9-5s6 5 9 5" />
        <path d="M3 18c3-1 6-4 9-4s6 4 9 4" opacity="0.5" />
        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
    </BaseIcon>
);

export const OceanIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M2 12s3-4 6-4 6 4 8 4 5-4 6-4" />
        <path d="M2 16s3-4 6-4 6 4 8 4 5-4 6-4" opacity="0.6" />
        <path d="M2 8s3-4 6-4 6 4 8 4 5-4 6-4" opacity="0.3" />
    </BaseIcon>
);

export const HairDryerIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M14 8c0-2.21-1.79-4-4-4H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h5c2.21 0 4-1.79 4-4" />
        <path d="M14 8v4" />
        <path d="M10 17v4" />
        <path d="M17 9l3-1" />
        <path d="M17 12l3 2" />
    </BaseIcon>
);

export const ShushIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M12 4v16" />
        <path d="M8 8v8" />
        <path d="M16 8v8" />
        <path d="M4 11v2" />
        <path d="M20 11v2" />
    </BaseIcon>
);

export const WavesIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </BaseIcon>
);

export const LullabyIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
    </BaseIcon>
);

export const FanIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 12 L12 6" strokeLinecap="round" />
        <path d="M12 12 L16.2426 16.2426" strokeLinecap="round" />
        <path d="M12 12 L7.75736 16.2426" strokeLinecap="round" />
    </BaseIcon>
);
