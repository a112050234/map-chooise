
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, RefreshCcw, Map as MapIcon, Compass, Trees, Camera, Palette } from 'lucide-react';
import { Attraction, TaipeiAPIResponse } from './types';
import AttractionCard from './components/AttractionCard';
import AttractionModal from './components/AttractionModal';
import AIChatPanel from './components/AIChatPanel';

const API_URL = "https://www.travel.taipei/open-api/zh-tw/Attractions/All?page=1";
const PROXY_SERVER = "https://corsproxy.io/?";
const FULL_URL = PROXY_SERVER + encodeURIComponent(API_URL);

const App: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  const categories = ['全部', '自然風景', '歷史建築', '藝文館所', '宗教信仰', '其他'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(FULL_URL, {
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const result: TaipeiAPIResponse = await response.json();
      setAttractions(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '連線至 API 時發生未知錯誤');
    } finally {
      setLoading(false);
    }
  };

  const filteredAttractions = useMemo(() => {
    return attractions.filter(attr => {
      const matchesSearch = 
        attr.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        attr.introduction.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeCategory === '全部') return matchesSearch;
      
      const matchesCategory = attr.category.some(cat => cat.name.includes(activeCategory));
      return matchesSearch && matchesCategory;
    });
  }, [attractions, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header / Hero */}
      <header className="relative bg-emerald-900 overflow-hidden h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552912810-7493a1098675?auto=format&fit=crop&w=1600&q=80" 
            className="w-full h-full object-cover opacity-30 scale-105"
            alt="Taipei Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-400/30">
              <Compass className="text-emerald-400 w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            台北景點隨手查
          </h1>
          <p className="text-emerald-100/80 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
            探索城市的綠意、歷史與隱藏角落。結合實時開放資料與 AI 智慧導覽。
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="text-emerald-600 w-5 h-5 transition-transform group-focus-within:scale-110" />
            </div>
            <input
              type="text"
              placeholder="搜尋景點名稱、簡介或關鍵字..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-14 pr-4 py-5 bg-white border-0 rounded-2xl shadow-2xl focus:ring-4 focus:ring-emerald-500/30 focus:outline-none text-gray-800 placeholder-gray-400 transition-all text-lg"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 -mt-10 pb-20 relative z-20">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                activeCategory === cat 
                  ? 'bg-emerald-600 text-white shadow-emerald-200 shadow-lg translate-y-[-2px]' 
                  : 'bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="flex-grow"></div>
          <div className="text-sm font-medium text-gray-400 bg-white px-4 py-2 rounded-xl shadow-sm">
            共 <span className="text-emerald-600">{filteredAttractions.length}</span> 個景點
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">正在探索台北的美麗角落...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
            <h2 className="text-2xl font-bold text-red-700 mb-2">喔不！發生了一些錯誤</h2>
            <p className="text-red-600 mb-8">{error}</p>
            <button 
              onClick={fetchData}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition-colors font-bold shadow-lg"
            >
              <RefreshCcw size={18} />
              重新整理
            </button>
          </div>
        ) : filteredAttractions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAttractions.map(attr => (
              <AttractionCard 
                key={attr.id} 
                attraction={attr} 
                onClick={setSelectedAttraction} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
              <Search className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">找不到相關景點</h3>
            <p className="text-gray-500">嘗試更換關鍵字或選擇其他分類看看吧！</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <MapIcon size={24} />
            </div>
            <div>
              <p className="font-bold text-emerald-900">Taipei Nature Explorer</p>
              <p className="text-sm text-gray-400">© 2024 Explore the beauty of Taipei</p>
            </div>
          </div>
          <div className="flex gap-6">
             <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-emerald-600 cursor-pointer">
               <Trees size={20} />
               <span className="text-[10px]">Nature</span>
             </div>
             <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-emerald-600 cursor-pointer">
               <Camera size={20} />
               <span className="text-[10px]">Photo</span>
             </div>
             <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-emerald-600 cursor-pointer">
               <Palette size={20} />
               <span className="text-[10px]">Art</span>
             </div>
          </div>
          <div className="text-sm text-gray-400">
            資料來源：<a href="https://www.travel.taipei/zh-tw/open-api" className="text-emerald-600 hover:underline">臺北市政府觀光傳播局</a>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <AttractionModal 
        attraction={selectedAttraction} 
        onClose={() => setSelectedAttraction(null)} 
      />
      <AIChatPanel />
    </div>
  );
};

export default App;
