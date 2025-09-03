'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '../assets/logo.png';

const LoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const hideLoading = () => {
      setIsVisible(false);
    };

    // Set minimum display time of 2 seconds
    timer = setTimeout(() => {
      // Check if page is fully loaded
      if (document.readyState === 'complete') {
        hideLoading();
      } else {
        // Wait for page to finish loading
        const handleLoad = () => {
          hideLoading();
          window.removeEventListener('load', handleLoad);
        };
        window.addEventListener('load', handleLoad);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', () => {});
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-[10000] transition-opacity duration-1000" style={{ zIndex: 10000 }}>
      <div className="text-center">
        <div className="relative">
          {/* Circular loading spinner */}
          <div className="w-32 h-32 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          {/* Logo in the center of the circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={logo}
              alt="Digital Indian Logo"
              height={64}
              width={64}
              className="h-16 w-auto"
            />
          </div>
        </div>

        {/* Company name below the circle */}
        <div className="mt-8">
          <h1 className="text-3xl font-bold">
            <span className="text-orange-500">DIGITAL</span>
            <span className="text-green-500 ml-2">INDIAN</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
