
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { Globe, AlertTriangle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, language, onLanguageChange }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <nav className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50 no-print shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <span className="font-black text-xl">H</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">{t.nav.title}</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-sm text-slate-500 font-medium">
              {t.nav.subtitle}
            </div>
            <button
              onClick={() => onLanguageChange(language === 'ZH' ? 'EN' : 'ZH')}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full text-sm font-bold text-slate-700 transition-all border border-slate-200"
            >
              <Globe className="w-4 h-4" />
              {language === 'ZH' ? 'EN' : '繁中'}
            </button>
          </div>
        </div>
      </nav>
      
      <main className="px-4 py-8">
        {children}
      </main>

      <footer className="mt-12 max-w-4xl mx-auto px-6 no-print">
        <div className="bg-slate-200/50 rounded-2xl p-6 border border-slate-200 text-slate-500 text-sm leading-relaxed">
          <div className="flex items-start gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
            <span className="font-bold text-slate-700">{language === 'ZH' ? '免責聲明' : 'Disclaimer'}</span>
          </div>
          <p>{t.common.disclaimer}</p>
        </div>
        
        <div className="mt-8 text-center text-slate-400 text-xs">
          <p>© 2024 Homeopathy AI Assistant. All rights reserved.</p>
          <p className="mt-1">{language === 'ZH' ? '結合尖端 AI 技術與經典順勢療法原則' : 'Combining cutting-edge AI with classical homeopathic principles'}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
