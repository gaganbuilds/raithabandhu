'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Circle, 
  Clock, 
  PlusCircle, 
  Mic, 
  ChevronRight, 
  Sparkles, 
  CloudSun 
} from 'lucide-react';

// Weather Widget (Bonus premium feel!)
export const WeatherWidget: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between h-48 relative overflow-hidden group">
      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-15 scale-150 group-hover:scale-160 transition-transform duration-500">
        <CloudSun className="h-40 w-40" />
      </div>
      <div className="flex justify-between items-start z-10">
        <div>
          <h4 className="text-sm font-semibold tracking-wider opacity-90 uppercase">Mausam (मौसम)</h4>
          <p className="text-xs opacity-75">Khanna, Punjab • Today</p>
        </div>
        <span className="text-3xl font-extrabold">34°C</span>
      </div>
      <div className="z-10">
        <span className="text-2xl font-bold tracking-tight">Sunny / धूप</span>
        <div className="flex gap-4 mt-2.5 text-xs opacity-90">
          <div>Humidity: <span className="font-semibold">45%</span></div>
          <div>Wind: <span className="font-semibold">12 km/h</span></div>
        </div>
      </div>
    </div>
  );
};

// Quick Actions Widget
export const QuickActions: React.FC = () => {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-emerald-800/10 rounded-2xl p-6 shadow-lg flex flex-col justify-between h-48">
      <div>
        <h3 className="font-bold text-emerald-950 text-base mb-1">Quick Actions (त्वरित कार्य)</h3>
        <p className="text-xs text-emerald-800/60 leading-normal">Common voice commands or assistant options.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Link 
          href="/voice" 
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 text-center cursor-pointer"
        >
          <Mic className="h-4 w-4" />
          <span>Speak (बोलें)</span>
        </Link>
        <Link 
          href="/chatbot" 
          className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-700/20 font-semibold text-xs py-3 px-4 rounded-xl transition-all active:scale-95 text-center cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-emerald-700" />
          <span>AI Chat (चैट)</span>
        </Link>
      </div>
    </div>
  );
};

// Crop Prices Widget
export const CropPricesWidget: React.FC = () => {
  const { prices } = useApp();
  const topPrices = prices.slice(0, 3); // top 3 for dashboard

  return (
    <div className="bg-white/80 backdrop-blur-md border border-emerald-800/10 rounded-2xl p-6 shadow-lg flex flex-col justify-between min-h-64">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-emerald-950 text-base">Crop Prices (मंडी भाव)</h3>
          <Link href="/prices" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-0.5 cursor-pointer">
            <span>View All</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {topPrices.map((crop) => (
            <div key={crop.id} className="flex justify-between items-center py-2 border-b border-emerald-800/5 last:border-b-0">
              <div>
                <p className="text-sm font-bold text-emerald-950">{crop.name}</p>
                <p className="text-[10px] text-emerald-800/60 font-medium">{crop.market} Mandi • {crop.state}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-emerald-950">₹{crop.price}/q</p>
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                  crop.change >= 0 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {crop.change >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  {crop.change >= 0 ? '+' : ''}{crop.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Reminders Widget
export const RemindersWidget: React.FC = () => {
  const { reminders, toggleReminder } = useApp();
  const activeReminders = reminders.filter(r => !r.completed).slice(0, 3);

  return (
    <div className="bg-white/80 backdrop-blur-md border border-emerald-800/10 rounded-2xl p-6 shadow-lg flex flex-col justify-between min-h-64">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-emerald-950 text-base">Reminders (रिमाइंडर्स)</h3>
          <Link href="/reminders" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-0.5 cursor-pointer">
            <span>View All</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        
        {activeReminders.length === 0 ? (
          <div className="text-center py-8 text-xs text-emerald-800/50">
            No active reminders. Click &apos;View All&apos; to schedule.
          </div>
        ) : (
          <div className="space-y-3">
            {activeReminders.map((rem) => (
              <div key={rem.id} className="flex items-start gap-3 py-2 border-b border-emerald-800/5 last:border-b-0">
                <button 
                  onClick={() => toggleReminder(rem.id)} 
                  className="mt-0.5 text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer shrink-0"
                >
                  <Circle className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-emerald-950 leading-tight">{rem.title}</p>
                  <div className="flex gap-2 items-center text-[10px] text-emerald-800/60 font-medium mt-1">
                    <span>{rem.date}</span>
                    <span>•</span>
                    <span>{rem.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Farm Activities Widget
export const FarmActivitiesWidget: React.FC = () => {
  const { activities } = useApp();
  const recentActivities = activities.slice(0, 3); // top 3

  return (
    <div className="bg-white/80 backdrop-blur-md border border-emerald-800/10 rounded-2xl p-6 shadow-lg flex flex-col justify-between min-h-64">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-emerald-950 text-base">Recent Activities (हालिया कार्य)</h3>
          <Link href="/timeline" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-0.5 cursor-pointer">
            <span>View Timeline</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-4 relative border-l border-emerald-800/10 ml-2 pl-4">
          {recentActivities.map((act) => (
            <div key={act.id} className="relative group">
              <span className="absolute -left-[22px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 ring-4 ring-white shadow-sm" />
              <div>
                <p className="text-sm font-bold text-emerald-950 leading-tight">{act.title}</p>
                <p className="text-[10px] text-emerald-800/50 font-semibold mt-0.5">{act.date}</p>
                <p className="text-xs text-emerald-950/70 mt-1 line-clamp-2 leading-relaxed">{act.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
