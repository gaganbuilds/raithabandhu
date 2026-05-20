'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Search, 
  ArrowLeft, 
  Building, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function SchemesPage() {
  const { schemes } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredSchemes = schemes.filter((scheme) => 
    scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/70 backdrop-blur-md border border-emerald-800/10 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 bg-white border border-emerald-800/10 hover:bg-emerald-50 rounded-xl transition-colors shadow-sm cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5 text-emerald-900" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-emerald-950">सरकारी योजनाएं (Government Schemes)</h1>
            <p className="text-xs text-emerald-800/60 font-medium">Browse central subsidies, farm loans, and financial aid schemes.</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-emerald-800/10 p-4.5 rounded-2xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-emerald-950/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="योजना का नाम या मंत्रालय खोजें... (Search scheme or ministry...)"
            className="w-full pl-11 pr-4 py-3 border border-emerald-800/10 rounded-xl text-sm placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
          />
        </div>
      </div>

      {/* Schemes Accordion List */}
      {filteredSchemes.length === 0 ? (
        <div className="text-center py-12 bg-white/50 border border-emerald-800/10 rounded-2xl text-xs text-emerald-800/60 font-medium">
          कोई योजना नहीं मिली। (No schemes found matching search criteria.)
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSchemes.map((scheme) => {
            const isExpanded = expandedId === scheme.id;
            return (
              <div 
                key={scheme.id}
                className="bg-white border border-emerald-850/10 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-emerald-800/20"
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleExpand(scheme.id)}
                  className="w-full flex justify-between items-center px-6 py-5 cursor-pointer text-left focus:outline-none"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Building className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-wider truncate">
                        {scheme.ministry}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-emerald-950 text-base leading-tight">
                      {scheme.name}
                    </h3>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 p-2 rounded-xl shrink-0">
                    {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                  </div>
                </button>

                {/* Expandable Details */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-emerald-800/5 bg-emerald-50/10 space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">विवरण (Description)</h4>
                      <p className="text-xs text-stone-700 leading-relaxed font-medium">{scheme.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Eligibility */}
                      <div className="bg-amber-50/30 border border-amber-200/50 p-4 rounded-xl space-y-1.5">
                        <h4 className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="h-4 w-4 shrink-0" />
                          <span>पात्रता (Eligibility)</span>
                        </h4>
                        <p className="text-xs text-stone-700 leading-relaxed font-medium">{scheme.eligibility}</p>
                      </div>

                      {/* Benefits */}
                      <div className="bg-emerald-50/50 border border-emerald-200/50 p-4 rounded-xl space-y-1.5">
                        <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4 shrink-0" />
                          <span>लाभ (Benefits)</span>
                        </h4>
                        <p className="text-xs text-stone-700 leading-relaxed font-medium">{scheme.benefits}</p>
                      </div>
                    </div>

                    {/* Official Portal Button */}
                    <div className="flex justify-end pt-2">
                      <a
                        href={scheme.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <span>आधिकारिक वेबसाइट पर जाएं (Official Link)</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
