
import React from 'react';

interface QRCodeProps {
  data: string;
  size?: number;
  className?: string;
}

/**
 * Robust QR Code generator using Google Chart API fallback.
 * This ensures no external JS heavy libraries are needed that might break in sandboxed environments.
 */
export const QRCodeComponent: React.FC<QRCodeProps> = ({ data, size = 150, className = "" }) => {
  const encodedData = encodeURIComponent(data);
  const url = `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodedData}&choe=UTF-8`;

  return (
    <div className={`inline-block bg-white p-2 rounded-xl shadow-inner ${className}`}>
      <img 
        src={url} 
        alt="Agri-Trust Verification QR" 
        width={size} 
        height={size}
        className="block"
      />
    </div>
  );
};
