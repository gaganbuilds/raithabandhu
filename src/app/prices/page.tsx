'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ArrowLeft, 
  MapPin, 
  CalendarDays,
  Tag,
  Building,
  TrendingDown as ArrowDownRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function PricesPage() {
  const { prices, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Cereals', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Spices'];

  const filteredPrices = prices.filter((crop) => {
    const matchesSearch = 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.state.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Top profitable crops list
  const profitableCrops = [
    { name: 'Basmati Paddy (बासमती धान)', price: '₹4,850/Qtl', profit: '+12%', color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Mustard Seeds (सरसों)', price: '₹5,600/Qtl', profit: '+9.4%', color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Garlic (लहसुन)', price: '₹12,400/Qtl', profit: '+15.2%', color: 'text-emerald-600 bg-emerald-50' }
  ];

  // Mandi centers nearby
  const nearMarkets = [
    { name: 'Mandya APMC', distance: '4.2 km', district: 'Mandya, Karnataka', status: 'Open' },
    { name: 'Maddur Sub-Market', distance: '12 km', district: 'Mandya, Karnataka', status: 'Open' }
  ];

  // SVG Trend Chart Coordinates
  // Let's draw an SVG path for wheat prices over 7 days: [2150, 2200, 2180, 2250, 2240, 2300, 2350]
  // Normalized to SVG dimensions 300x80
  const wheatPoints = "0,65 50,55 100,60 150,45 200,48 250,30 300,10";
  const paddyPoints = "0,70 50,72 100,50 150,55 200,30 250,22 300,5";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 bg-white border border-emerald-800/10 hover:bg-emerald-50 rounded-xl transition-colors shadow-sm cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5 text-emerald-900" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-emerald-950">{t('prices')}</h1>
            <p className="text-xs text-emerald-800/60 font-medium">Daily mandi rate indexes directly synced from market committees.</p>
          </div>
        </div>
      </div>

      {/* SVG Charts & Mandi Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Weekly Trend charts */}
        <div className="md:col-span-8 bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-emerald-800/5 pb-2.5">
            <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿ ಚಾರ್ಟ್ (Mandi Weekly Price Trends)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Wheat chart */}
            <div className="border border-emerald-800/10 p-4 rounded-xl space-y-3 bg-stone-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Wheat Price Index (गेहूं)</h4>
                  <span className="text-[10px] text-stone-500 font-semibold">Khanna Mandi, Punjab</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold block text-emerald-700">+8.5%</span>
                  <span className="text-[9px] text-stone-500">7 Days</span>
                </div>
              </div>
              
              {/* Inline SVG Chart */}
              <div className="h-20 w-full pt-2">
                <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="300" y2="40" stroke="rgba(4,120,87,0.06)" strokeWidth="1" />
                  <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(4,120,87,0.06)" strokeWidth="1" />
                  {/* Line Path */}
                  <polyline
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={wheatPoints}
                  />
                  {/* Area fill */}
                  <polygon
                    fill="rgba(5,150,105,0.08)"
                    points={`0,80 ${wheatPoints} 300,80`}
                  />
                </svg>
              </div>
            </div>

            {/* Paddy chart */}
            <div className="border border-emerald-800/10 p-4 rounded-xl space-y-3 bg-stone-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Paddy Price Index (धान)</h4>
                  <span className="text-[10px] text-stone-500 font-semibold">Mandya Mandi, Karnataka</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold block text-emerald-700">+11.2%</span>
                  <span className="text-[9px] text-stone-500">7 Days</span>
                </div>
              </div>
              
              {/* Inline SVG Chart */}
              <div className="h-20 w-full pt-2">
                <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                  <line x1="0" y1="40" x2="300" y2="40" stroke="rgba(4,120,87,0.06)" strokeWidth="1" />
                  <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(4,120,87,0.06)" strokeWidth="1" />
                  <polyline
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={paddyPoints}
                  />
                  <polygon
                    fill="rgba(5,150,105,0.08)"
                    points={`0,80 ${paddyPoints} 300,80`}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Profitable Crops and Nearest markets */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">{t('profitableCrops')}</h3>
            <div className="space-y-3">
              {profitableCrops.map((crop, idx) => (
                <div key={idx} className="flex justify-between items-center bg-stone-50/60 p-3 border border-stone-200/50 rounded-xl">
                  <div>
                    <span className="text-[10px] font-extrabold text-stone-400">#0{idx+1}</span>
                    <h4 className="text-xs font-bold text-emerald-950">{crop.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold block">{crop.price}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${crop.color}`}>{crop.profit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Near Markets APMC Status */}
      <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
          <Building className="h-4.5 w-4.5 text-emerald-600" />
          <span>ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆ ಸಮಿತಿಗಳು (Nearest Market Centers)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nearMarkets.map((mkt, idx) => (
            <div key={idx} className="border border-emerald-800/10 p-4 rounded-xl flex justify-between items-center bg-stone-50/50">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{mkt.name}</span>
                </h4>
                <p className="text-[10px] text-stone-500 font-semibold">{mkt.district} • {mkt.distance}</p>
              </div>
              <span className="bg-emerald-100 text-emerald-850 text-[10px] font-bold border border-emerald-200 px-2.5 py-1 rounded-lg">
                {mkt.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Prices Search List */}
      <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-bold text-sm text-emerald-950">Daily Mandi Indexes</h3>
            <p className="text-[11px] text-emerald-800/50 font-semibold">Search commodities prices across regional sub-markets.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-800/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search crop, mandi, state..."
              className="w-full pl-9 pr-4 py-2 border border-emerald-800/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
            />
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-2 overflow-x-auto pb-1 border-b border-emerald-850/5 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shrink-0
                ${selectedCategory === cat 
                  ? 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-sm' 
                  : 'bg-emerald-50/50 border-emerald-850/15 text-emerald-850 hover:bg-emerald-50'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Prices Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrices.map((crop) => {
            const isUp = crop.change >= 0;
            return (
              <div 
                key={crop.id}
                className="bg-stone-50/50 border border-emerald-800/10 rounded-xl p-4.5 flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="font-extrabold text-emerald-950 text-sm">{crop.name}</h4>
                    <span className="text-[10px] bg-white border border-emerald-850/10 px-2 py-0.5 rounded text-emerald-800 font-bold shrink-0">
                      {crop.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[10px] text-stone-500 font-semibold mt-2.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{crop.market}, {crop.state}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-emerald-850/5 pt-3.5 mt-4">
                  <div>
                    <span className="text-[9px] text-stone-400 block font-bold">MANDI RATE</span>
                    <span className="text-sm font-black text-emerald-950">₹{crop.price.toLocaleString('en-IN')}/Qtl</span>
                  </div>
                  
                  <div className={`flex items-center gap-1 font-bold text-xs ${isUp ? 'text-emerald-700' : 'text-red-600'}`}>
                    {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>{isUp ? '+' : ''}{crop.change}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
