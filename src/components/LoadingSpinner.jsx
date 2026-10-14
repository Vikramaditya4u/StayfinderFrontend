import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-container">
      <Loader2 className="spinner-icon animate-spin" size={38} />
      <p className="spinner-text">{message}</p>
    </div>
  );
}
