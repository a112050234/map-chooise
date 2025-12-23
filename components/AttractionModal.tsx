
import React, { useEffect, useState } from 'react';
import { Attraction } from '../types';
import { X, MapPin, Clock, Phone, Globe, Sparkles, MessageSquare } from 'lucide-react';
import { getTravelSummary } from '../services/geminiService';

interface AttractionModalProps {
  attraction: Attraction | null;
  onClose: () => void;
}

const AttractionModal: React.FC<AttractionModalProps> = ({ attraction, onClose }) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    if (attraction) {
      setAiSummary(null);
      fetchSummary();
    }
  }, [attraction]);

  const fetchSummary = async () => {
    if (!attraction) return;
    setIsLoadingSummary(true);
    const summary = await getTravelSummary(attraction.name, attraction.introduction);
    setAiSummary(summary);
    setIsLoadingSummary(false);
  };

  if (!attraction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        
        {/* Left Side: Image Gallery/Main Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-200 relative">
          <img 
            src={attraction.images?.[0]?.src || 'https://picsum.photos/800/1200'} 
            className="w-full h-full object-cover"
            alt={attraction.name}
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors md:hidden"
          >
            <X size={24} />
          </button>
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
          <div className="p-6 flex justify-between items-start">
            <h2 className="text-3xl font-bold text-emerald-900 leading-tight">
              {attraction.name}
            </h2>
            <button 
              onClick={onClose}
              className="hidden md:block p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-6 pb-6 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* AI Insights Section */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles size={48} className="text-emerald-900" />
              </div>
              <div className="flex items-center gap-2 mb-3 text-emerald-800 font-bold">
                <Sparkles size={18} className="animate-pulse" />
                <span>AI 隨身導遊建議</span>
              </div>
              {isLoadingSummary ? (
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                  <span className="text-emerald-600 text-sm italic ml-2">正在為您整理在地情報...</span>
                </div>
              ) : (
                <p className="text-emerald-900/80 text-sm leading-relaxed italic">
                  {aiSummary || "無法取得 AI 摘要。"}
                </p>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="text-emerald-600 mt-1 flex-shrink-0" size={18} />
                <div>
                  <p className="font-semibold text-gray-800">地點</p>
                  <p className="text-gray-600 text-sm">{attraction.address}</p>
                </div>
              </div>
              
              {attraction.open_time && (
                <div className="flex items-start gap-3">
                  <Clock className="text-emerald-600 mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="font-semibold text-gray-800">開放時間</p>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{attraction.open_time}</p>
                  </div>
                </div>
              )}

              {attraction.tel && (
                <div className="flex items-start gap-3">
                  <Phone className="text-emerald-600 mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="font-semibold text-gray-800">聯絡電話</p>
                    <p className="text-gray-600 text-sm">{attraction.tel}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <MessageSquare size={18} className="text-emerald-600" />
                景點簡介
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {attraction.introduction}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {attraction.official_site && (
                <a 
                  href={attraction.official_site} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Globe size={18} />
                  <span>官方網站</span>
                </a>
              )}
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.name + ' ' + attraction.address)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MapPin size={18} />
                <span>地圖導航</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionModal;
