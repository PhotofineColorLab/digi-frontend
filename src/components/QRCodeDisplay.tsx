import React from 'react';
import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
  value: string;
  albumName: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, albumName }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg">
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <QRCode
          value={value}
          size={200}
          level="H"
          fgColor="#3B82F6"
          bgColor="#FFFFFF"
        />
      </div>
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-500">Scan to view album</p>
        <p className="font-medium text-gray-700 mt-1">{albumName}</p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;