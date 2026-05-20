'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Sprout, 
  Droplet, 
  ShieldAlert, 
  BadgeIndianRupee, 
  CheckCircle, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  TrendingUp 
} from 'lucide-react';
import Link from 'next/link';

export default function TimelinePage() {
  const { activities, addActivity } = useApp();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState<'soil' | 'water' | 'crop' | 'pest' | 'harvest' | 'finance'>('crop');
  const [status, setStatus] = useState<'Completed' | 'Scheduled'>('Completed');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addActivity({
      title,
      notes,
      type,
      status
    });
    setTitle('');
    setNotes('');
    setShowForm(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'soil': return <TrendingUp className="h-5 w-5 text-amber-700" />;
      case 'water': return <Droplet className="h-5 w-5 text-blue-600" />;
      case 'pest': return <ShieldAlert className="h-5 w-5 text-red-600" />;
      case 'harvest': return <Sprout className="h-5 w-5 text-emerald-600" />;
      case 'finance': return <BadgeIndianRupee className="h-5 w-5 text-green-700" />;
      default: return <Sprout className="h-5 w-5 text-emerald-700" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'soil': return 'bg-amber-100 border-amber-300';
      case 'water': return 'bg-blue-50 border-blue-200';
      case 'pest': return 'bg-red-50 border-red-200';
      case 'harvest': return 'bg-emerald-50 border-emerald-200';
      case 'finance': return 'bg-green-50 border-green-200';
      default: return 'bg-stone-50 border-stone-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/70 backdrop-blur-md border border-emerald-800/10 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 bg-white border border-emerald-800/10 hover:bg-emerald-50 rounded-xl transition-colors shadow-sm cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5 text-emerald-900" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-emerald-950">कृषि समय रेखा (Farm Timeline)</h1>
            <p className="text-xs text-emerald-800/60 font-medium">Record and track history of actions taken on your crops.</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>कार्य जोड़ें (Add Task)</span>
        </button>
      </div>

      {/* New Activity Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-emerald-800/10 p-6 rounded-2xl shadow-lg space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <h3 className="font-bold text-sm text-emerald-950 border-b border-emerald-800/5 pb-2">नया कार्य दर्ज करें (Log New Activity)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">कार्य का नाम (Activity Name) *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="उदा. धान में यूरिया डाला (e.g. Applied Urea)"
                className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">कार्य का प्रकार (Activity Type)</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full border border-emerald-800/10 bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              >
                <option value="crop">फसल देखभाल (Crop Care)</option>
                <option value="water">सिंचाई (Irrigation)</option>
                <option value="pest">कीटनाशक (Pest Control)</option>
                <option value="soil">मिट्टी जांच (Soil Health)</option>
                <option value="harvest">कटाई (Harvesting)</option>
                <option value="finance">लोन/खर्च (Finance)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">विवरण / नोट्स (Notes & Description)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="खेत का हिस्सा, खाद की मात्रा आदि दर्ज करें (Details like fertilizer dosage, field sector...)"
              rows={3}
              className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium resize-none"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs text-emerald-950 font-bold cursor-pointer">
                <input 
                  type="radio" 
                  checked={status === 'Completed'} 
                  onChange={() => setStatus('Completed')}
                  className="text-emerald-600 focus:ring-emerald-500" 
                />
                <span>पूरा हो गया (Completed)</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-emerald-950 font-bold cursor-pointer">
                <input 
                  type="radio" 
                  checked={status === 'Scheduled'} 
                  onChange={() => setStatus('Scheduled')}
                  className="text-emerald-600 focus:ring-emerald-500" 
                />
                <span>शेड्यूल किया (Scheduled)</span>
              </label>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-emerald-800/10 hover:bg-emerald-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Save Log
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Timeline List */}
      <div className="relative border-l-2 border-emerald-800/10 ml-4 pl-6 space-y-6">
        {activities.map((act) => (
          <div key={act.id} className="relative group">
            {/* Timeline point */}
            <span className={`absolute -left-[35px] top-1.5 flex h-7.5 w-7.5 items-center justify-center rounded-full border border-emerald-800/10 bg-white shadow-sm transition-transform group-hover:scale-110`}>
              {getActivityIcon(act.type)}
            </span>
            
            <div className={`border rounded-2xl p-5 shadow-sm transition-shadow hover:shadow-md bg-white/70 backdrop-blur-sm ${getActivityColor(act.type)}`}>
              <div className="flex justify-between items-start gap-4 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-emerald-950 leading-snug">{act.title}</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800/50 uppercase tracking-wide mt-0.5">
                    <Calendar className="h-3 w-3" />
                    {act.date}
                  </span>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                  act.status === 'Completed' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : act.status === 'Delayed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                }`}>
                  {act.status}
                </span>
              </div>
              <p className="text-xs text-stone-700 font-medium leading-relaxed">{act.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
