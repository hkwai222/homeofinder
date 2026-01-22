
import React from 'react';
import { AppMode, Language, HistoryRecord } from '../types';
import { TRANSLATIONS } from '../translations';
import MedicalHistory from './MedicalHistory';
import { ShieldCheck, Info } from 'lucide-react';

interface HomeProps {
  onSelectMode: (mode: AppMode) => void;
  language: Language;
  history: HistoryRecord[];
  onDeleteHistory: (id: string) => void;
  onViewHistory: (record: HistoryRecord) => void;
  onImportHistory: (records: HistoryRecord[]) => void;
  remainingUses: number;
  maxUses: number;
}

const Home: React.FC<HomeProps> = ({ 
  onSelectMode, 
  language, 
  history, 
  onDeleteHistory, 
  onViewHistory, 
  onImportHistory,
  remainingUses,
  maxUses
}) => {
  const t = TRANSLATIONS[language];
  const homeT = t.home;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Usage Limit Badge */}
      <div className="flex justify-center mb-10 px-4">
        <div className={`flex items-center gap-3 px-6 py-3 rounded-full border shadow-sm transition-all duration-500 ${remainingUses > 0 ? 'bg-white border-teal-100' : 'bg-orange-50 border-orange-200'}`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${remainingUses > 0 ? 'bg-teal-500' : 'bg-orange-500'}`}></div>
          <span className="text-sm font-bold text-slate-600">
            {t.common.remainingUses}：
            <span className={`text-lg font-black ml-1 ${remainingUses > 0 ? 'text-teal-600' : 'text-orange-600'}`}>
              {remainingUses} / {maxUses}
            </span>
          </span>
          {remainingUses === 0 && (
            <div className="flex items-center gap-1 text-orange-600 ml-2">
              <Info className="w-4 h-4" />
              <span className="text-xs font-bold">{t.common.limitReached}</span>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mb-16 px-4">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
          {homeT.mainTitle} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">{homeT.accentTitle}</span>
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          {homeT.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 mb-20">
        <button
          onClick={() => onSelectMode(AppMode.CONSTITUTION)}
          disabled={remainingUses === 0}
          className={`group relative bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 border-4 border-transparent text-left transition-all overflow-hidden ${remainingUses > 0 ? 'hover:border-teal-500 hover:-translate-y-2 active:scale-95' : 'opacity-80 grayscale cursor-not-allowed'}`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
          <div className="relative z-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${remainingUses > 0 ? 'bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white' : 'bg-slate-100 text-slate-400'}`}>
              <UserMd className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-4">{homeT.constitutionTitle}</h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              {homeT.constitutionDesc}
            </p>
            <div className={`inline-flex items-center gap-2 font-black text-lg transition-all ${remainingUses > 0 ? 'text-teal-600 group-hover:gap-4' : 'text-slate-400'}`}>
              {remainingUses > 0 ? homeT.ctaStart : t.common.limitReached}
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelectMode(AppMode.FIRSTAID)}
          disabled={remainingUses === 0}
          className={`group relative bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 border-4 border-transparent text-left transition-all overflow-hidden ${remainingUses > 0 ? 'hover:border-orange-500 hover:-translate-y-2 active:scale-95' : 'opacity-80 grayscale cursor-not-allowed'}`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
          <div className="relative z-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${remainingUses > 0 ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white' : 'bg-slate-100 text-slate-400'}`}>
              <Bolt className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-4">{homeT.firstaidTitle}</h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              {homeT.firstaidDesc}
            </p>
            <div className={`inline-flex items-center gap-2 font-black text-lg transition-all ${remainingUses > 0 ? 'text-orange-600 group-hover:gap-4' : 'text-slate-400'}`}>
              {remainingUses > 0 ? homeT.ctaQuick : t.common.limitReached}
            </div>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-100 shadow-xl mx-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-orange-500"></div>
        <h4 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-3">
          <div className="w-3 h-8 bg-teal-600 rounded-full"></div>
          {homeT.instructionTitle}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="group">
            <span className="inline-block font-black text-4xl text-teal-100 group-hover:text-teal-600 transition-colors mb-4">01</span>
            <p className="text-slate-600 leading-relaxed font-medium">{homeT.instruction1}</p>
          </div>
          <div className="group">
            <span className="inline-block font-black text-4xl text-teal-100 group-hover:text-teal-600 transition-colors mb-4">02</span>
            <p className="text-slate-600 leading-relaxed font-medium">{homeT.instruction2}</p>
          </div>
          <div className="group">
            <span className="inline-block font-black text-4xl text-teal-100 group-hover:text-teal-600 transition-colors mb-4">03</span>
            <p className="text-slate-600 leading-relaxed font-medium">{homeT.instruction3}</p>
          </div>
          <div className="p-6 bg-teal-50 rounded-[2rem] border border-teal-100 relative group">
            <div className="absolute -top-4 -right-2 bg-teal-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Recommend</div>
            <span className="inline-block font-black text-4xl text-teal-600 mb-4">04</span>
            <p className="text-teal-800 leading-relaxed font-bold">{homeT.instruction4}</p>
          </div>
        </div>
      </div>

      <MedicalHistory 
        history={history} 
        onDelete={onDeleteHistory} 
        onView={onViewHistory} 
        onImport={onImportHistory}
        language={language} 
      />
    </div>
  );
};

const UserMd = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/><path d="M12 11v4"/><path d="M10 13h4"/></svg>
);
const Bolt = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 16V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12"/><path d="M7 7h10"/><path d="M7 11h10"/><path d="M7 15h4"/><path d="m15 22 5-5"/><path d="m20 22-5-5"/></svg>
);

export default Home;
