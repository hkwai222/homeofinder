
import React from 'react';
import { Printer, RotateCcw, AlertTriangle, Coffee, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface AnalysisResultProps {
  report: string | null;
  isLoading: boolean;
  onRestart: () => void;
  language: Language;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ report, isLoading, onRestart, language }) => {
  const t = TRANSLATIONS[language];

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-16 rounded-[2.5rem] shadow-2xl text-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-teal-100 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-teal-600 font-black">AI</span>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-slate-800">{t.result.loadingTitle}</h3>
          <p className="text-slate-500">{t.result.loadingDesc}</p>
        </div>
        <div className="flex justify-center gap-1">
          <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce delay-100"></span>
          <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce delay-200"></span>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
        <header className="bg-slate-900 text-white p-8 md:p-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2">{t.result.reportTitle}</h2>
            <p className="opacity-60 text-sm">{t.result.genTime}：{new Date().toLocaleString(language === 'ZH' ? 'zh-TW' : 'en-US')}</p>
          </div>
          <div className="flex gap-3 no-print">
            <button
              onClick={() => window.print()}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all flex items-center gap-2 font-bold backdrop-blur-sm"
            >
              <Printer className="w-5 h-5" />
              <span className="hidden sm:inline">{t.result.print}</span>
            </button>
            <button
              onClick={onRestart}
              className="bg-teal-600 hover:bg-teal-500 text-white p-3 rounded-xl transition-all flex items-center gap-2 font-bold shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="hidden sm:inline">{t.result.restart}</span>
            </button>
          </div>
        </header>

        <div className="p-8 md:p-12">
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
             {report}
          </div>

          {/* Buy Me A Coffee Section */}
          <div className="mt-12 mb-8 no-print">
            <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <Coffee className="w-8 h-8 text-amber-600" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-amber-900 font-medium leading-relaxed mb-4">
                  {t.result.coffeeMessage}
                </p>
                <a 
                  href="https://buymeacoffee.com/metrofengshui/e/501915" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FFDD00] hover:bg-[#FFCC00] text-black font-black px-8 py-3 rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  <img 
                    src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" 
                    alt="Buy me a coffee" 
                    className="w-5 h-5"
                  />
                  <span>{t.result.coffeeBtn}</span>
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-8 bg-slate-50 rounded-3xl border-2 border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h4 className="text-xl font-bold text-slate-800">{language === 'ZH' ? '醫學免責聲明' : 'Medical Disclaimer'}</h4>
            </div>
            <p className="text-slate-600 leading-relaxed text-base italic">
              {t.common.disclaimer}
            </p>
            <p className="mt-4 text-slate-500 text-sm">
              {t.result.footerNote}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center no-print">
         <button 
           onClick={onRestart}
           className="text-slate-500 font-bold hover:text-slate-800 transition-colors"
         >
           {t.result.backToMenu}
         </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
