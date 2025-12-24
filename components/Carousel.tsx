import React, { useState, useEffect } from 'react';
import { IMAGES } from '../constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PHOTOS = [IMAGES.MAIN, IMAGES.GALLERY_1, IMAGES.GALLERY_2, IMAGES.GALLERY_3];

export const Carousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % PHOTOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % PHOTOS.length);
  const prev = () => setCurrent((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700/50 group bg-slate-800">
      {PHOTOS.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={src} alt={`Hugo Moment ${index}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
        </div>
      ))}
      
      {/* Controls */}
      <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={prev} className="bg-black/50 hover:bg-indigo-600 text-white p-3 rounded-full backdrop-blur-sm transition-all">
          <ChevronLeft />
        </button>
        <button onClick={next} className="bg-black/50 hover:bg-indigo-600 text-white p-3 rounded-full backdrop-blur-sm transition-all">
          <ChevronRight />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
        {PHOTOS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'bg-indigo-500 w-8' : 'bg-white/30 w-2 hover:bg-white/50'
            }`} 
          />
        ))}
      </div>
    </div>
  );
};