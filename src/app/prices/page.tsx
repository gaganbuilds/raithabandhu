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
  Tag
} from 'lucide-react';
import Link from 'next/link';

export default function PricesPage() {
  const { prices } = useApp();
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/70 backdrop-blur-md border border-emerald-800/10 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 bg-white border border-emerald-800/10 hover:bg-emerald-50 rounded-xl transition-colors shadow-sm cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5 text-emerald-900" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-emerald-950">ताजा मंडी भाव (Mandi Prices)</h1>
            <p className="text-xs text-emerald-800/60 font-medium">Daily agricultural commodity prices across Indian markets.</p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
          Source: AGMARKNET
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-emerald-950/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="फसल, मंडी या राज्य खोजें... (Search crop, market, or state...)"
            className="w-full pl-11 pr-4 py-3 border border-emerald-800/10 rounded-xl text-sm placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
          />
        </div>

        {/* Categories Scroller */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer shrink-0
                ${selectedCategory === cat 
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                  : 'bg-emerald-50/50 border-emerald-850/10 hover:bg-emerald-50 text-emerald-800'
                }
              `}
            >
              {cat === 'All' ? 'सभी (All)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Prices */}
      {filteredPrices.length === 0 ? (
        <div className="text-center py-12 bg-white/50 border border-emerald-800/10 rounded-2xl text-xs text-emerald-800/60 font-medium">
          कोई मंडी भाव नहीं मिला। (No crop rates found matching filters.)
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrices.map((crop) => (
            <div 
              key={crop.id} 
              className="bg-white border border-emerald-850/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex justify-between items-center"
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-950 text-base truncate">{crop.name}</span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/50 text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    {crop.category}
                  </span>
                </div>
                
                <div className="space-y-1 text-xs text-emerald-800/70 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{crop.market} Mandi, {crop.state}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Last updated: {crop.date}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-emerald-950/60 font-semibold block mb-0.5">प्रति क्विंटल (per quintal)</span>
                <span className="text-lg font-black text-emerald-950">₹{crop.price}</span>
                
                <span className={`flex items-center justify-end gap-0.5 text-xs font-bold mt-1.5 ${
                  crop.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {crop.change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{crop.change >= 0 ? '+' : ''}{crop.change}%</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
