'use client';

import React from 'react';
import { 
  WeatherWidget, 
  QuickActions, 
  CropPricesWidget, 
  RemindersWidget, 
  FarmActivitiesWidget 
} from '../components/DashboardCards';
import { useApp } from '../context/AppContext';
import { Sprout, Mic, ArrowRight, Bell } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { reminders } = useApp();
  const pendingReminders = reminders.filter(r => !r.completed).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 backdrop-blur-md border border-emerald-800/10 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-emerald-950 tracking-tight flex items-center gap-2">
            <Sprout className="h-7 w-7 text-emerald-600" />
            राम राम, करन सिंह! (Welcome Back!)
          </h1>
          <p className="text-sm text-emerald-800/60 font-medium mt-1">
            यहाँ आपके खेतों की आज की रिपोर्ट है (Here is the update for your fields in Khanna).
          </p>
        </div>
        {pendingReminders > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-inner animate-pulse">
            <Bell className="h-4.5 w-4.5 text-amber-600 shrink-0" />
            <span>{pendingReminders} कार्य बाकी हैं (reminders pending)</span>
          </div>
        )}
      </div>

      {/* Hero voice CTA */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-emerald-700/30">
        <div className="space-y-2">
          <span className="bg-emerald-700 text-emerald-200 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
            Voice-First Feature
          </span>
          <h2 className="text-xl font-bold tracking-tight">अपनी आवाज़ में खेत की रिपोर्ट दर्ज करें</h2>
          <p className="text-sm text-emerald-100/85 max-w-xl leading-relaxed">
            टाइप करने की कोई ज़रूरत नहीं! माइक बटन दबाकर बोलें: <code className="bg-emerald-900/50 px-1.5 py-0.5 rounded font-mono text-xs text-amber-300">&quot;गेहूं का भाव बताओ&quot;</code> या <code className="bg-emerald-900/50 px-1.5 py-0.5 rounded font-mono text-xs text-amber-300">&quot;कल सुबह पानी देने का रिमाइंडर लगाओ&quot;</code>।
          </p>
        </div>
        <Link 
          href="/voice" 
          className="flex items-center gap-2.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 text-sm shrink-0 cursor-pointer"
        >
          <Mic className="h-5 w-5" />
          <span>बात करें (Talk Now)</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid Row 1: Weather & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherWidget />
        <QuickActions />
      </div>

      {/* Grid Row 2: Prices, Reminders, Activities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CropPricesWidget />
        <RemindersWidget />
        <FarmActivitiesWidget />
      </div>
    </div>
  );
}
