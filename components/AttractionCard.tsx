
import React from 'react';
import { Attraction } from '../types';
import { MapPin, Info, ArrowRight } from 'lucide-react';

interface AttractionCardProps {
  attraction: Attraction;
  onClick: (attraction: Attraction) => void;
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1518173946687-a4c8a9ba332f?auto=format&fit=crop&w=800&q=80';

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction, onClick }) => {
  const imgSrc = (attraction.images && attraction.images.length > 0) 
    ? attraction.images[0].src 
    : DEFAULT_IMG;
    
  const category = (attraction.category && attraction.category.length > 0) 
    ? attraction.category[0].name 
    : '一般景點';

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer transform hover:-translate-y-1"
      onClick={() => onClick(attraction)}
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={imgSrc} 
          alt={attraction.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMG; }}
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-800 text-xs font-bold rounded-full shadow-sm">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-emerald-700 transition-colors">
          {attraction.name}
        </h3>
        
        <div className="flex items-start gap-2 text-gray-500 text-sm mb-4">
          <MapPin size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" />
          <span className="line-clamp-1">{attraction.address}</span>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
          {attraction.introduction || '探索台北隱藏的瑰寶...'}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1 text-emerald-600 font-medium text-sm">
            <Info size={16} />
            <span>詳細資訊</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;
