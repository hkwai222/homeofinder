
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import StepForm from './components/StepForm';
import AnalysisResult from './components/AnalysisResult';
import { AppMode, UserData, Language, HistoryRecord } from './types';
import { getConfigs } from './constants';
import { startAnalysisStream } from './services/geminiService';
import { TRANSLATIONS } from './translations';

const STORAGE_KEY = 'homeopathy_history_v1';
const USAGE_KEY = 'homeopathy_usage_stats_v1';
const DAILY_LIMIT = 5;

// 擴展 window 型別以支援 aistudio 工具
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

// Fixed: Added return statement and default export to fix "Module has no default export" and "Type '() => void' is not assignable to type 'FC<{}>'" errors.
const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [language, setLanguage] = useState<Language>('ZH');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [usageCount, setUsageCount] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(true);

  // 初始化語言、歷史紀錄與使用量統計
  useEffect(() => {
    const checkApiKey = async () => {
      // 檢查環境變數
      const key = process.env.API_KEY;
      if (key && key !== 'undefined' && key !== '') {
        setHasApiKey(true);
        return;
      }
      
      // 檢查是否已透過 aistudio 選擇過 Key
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else {
        setHasApiKey(false);
      }
    };
    checkApiKey();

    const userLang = navigator.language.toLowerCase();
    if (userLang.startsWith('zh')) {
      setLanguage('ZH');
    } else {
      setLanguage('EN');
    }

    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }

    const savedUsage = localStorage.getItem(USAGE_KEY);
    const today = new Date().toDateString();
    
    if (savedUsage) {
      try {
        const stats = JSON.parse(savedUsage);
        if (stats.date === today) {
          setUsageCount(stats.count);
        } else {
          const newStats = { date: today, count: 0 };
          localStorage.setItem(USAGE_KEY, JSON.stringify(newStats));
          setUsageCount(0);
        }
      } catch (e) {
        setUsageCount(0);
      }
    } else {
      localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const incrementUsage = () => {
    const today = new Date().toDateString();
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count: newCount }));
  };

  const handleOpenKeyPicker = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // 觸發選擇後，直接假設成功並嘗試讓使用者繼續
        setHasApiKey(true);
      } catch (e) {
        console.error("Failed to open key picker", e);
      }
    } else {
      alert(language === 'ZH' ? "請在 Vercel 設置中正確配置 API_KEY 環境變數。" : "Please configure the API_KEY environment variable in Vercel settings.");
    }
  };

  const handleModeSelection = (selectedMode: AppMode) => {
    setMode(selectedMode);
    setReport(null);
  };

  const handleFormSubmit = async (data: UserData, photo: string | null) => {
    const t = TRANSLATIONS[language].common;

    // 檢查額度
    if (usageCount >= DAILY_LIMIT) {
      alert(`${t.limitReached}\n\n${t.limitNote}`);
      return;
    }

    setLoading(true);
    setMode(AppMode.RESULT);
    setReport(""); 
    
    try {
      const streamResponse = await startAnalysisStream(mode, data, photo || undefined);
      
      let fullText = "";
      let hasIncremented = false;

      for await (const chunk of streamResponse) {
        if (loading) setLoading(false);
        
        if (!hasIncremented) {
          incrementUsage();
          hasIncremented = true;
        }

        // Correct: access text property directly as per Gemini SDK rules
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          setReport(fullText);
        }
      }
      
      const newRecord: HistoryRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mode: mode,
        data: { ...data },
        report: fullText
      };
      setHistory(prev => [newRecord, ...prev]);

    } catch (error: any) {
      console.error("Analysis failed:", error);
      setLoading(false);
      
      // 處理 API Key 相關錯誤
      if (error.message === "MISSING_API_KEY" || error.message?.includes('API key')) {
        setHasApiKey(false);
        const keyMsg = language === 'ZH' 
          ? "需要授權 API Key 才能繼續分析。請點擊頁面頂端的授權按鈕。" 
          : "API Key authorization is required. Please click the authorize button at the top of the page.";
        alert(keyMsg);
      } else if (error.message?.includes("Requested entity was not found")) {
        // Reset key selection state and prompt user to select key again if entity not found error occurs
        setHasApiKey(false);
        const resetMsg = language === 'ZH'
          ? "API Key 效期已過或無效，請重新授權。"
          : "API Key expired or invalid, please authorize again.";
        alert(resetMsg);
      } else {
        alert(language === 'ZH' ? "分析發生錯誤，請稍後再試。" : "An error occurred during analysis. Please try again later.");
      }
      setMode(AppMode.HOME);
    }
  };

  const currentConfig = (mode === AppMode.CONSTITUTION || mode === AppMode.FIRSTAID) 
    ? getConfigs(language)[mode] 
    : null;

  return (
    <Layout language={language} onLanguageChange={setLanguage}>
      {!hasApiKey && (
        <div className="max-w-4xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="bg-orange-50 border border-orange-200 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-orange-900">{language === 'ZH' ? '需要 API 金鑰授權' : 'API Key Authorization Required'}</h4>
                <p className="text-orange-700 text-sm">{language === 'ZH' ? '使用此進階分析功能需要您授權一個 API Key。' : 'Using this advanced analysis feature requires you to authorize an API Key.'}</p>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-xs text-orange-600 underline mt-1 block">
                  {language === 'ZH' ? '關於計費與金鑰說明' : 'About billing and API keys'}
                </a>
              </div>
            </div>
            <button
              onClick={handleOpenKeyPicker}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg transition-all active:scale-95 whitespace-nowrap"
            >
              {language === 'ZH' ? '立即授權' : 'Authorize Now'}
            </button>
          </div>
        </div>
      )}

      {mode === AppMode.HOME && (
        <Home 
          onSelectMode={handleModeSelection} 
          language={language}
          history={history}
          onDeleteHistory={(id) => setHistory(prev => prev.filter(h => h.id !== id))}
          onViewHistory={(record) => {
            setReport(record.report);
            setMode(AppMode.RESULT);
          }}
          onImportHistory={(records) => setHistory(records)}
          remainingUses={DAILY_LIMIT - usageCount}
          maxUses={DAILY_LIMIT}
        />
      )}

      {currentConfig && (
        <StepForm 
          config={currentConfig} 
          onBack={() => setMode(AppMode.HOME)}
          onSubmit={handleFormSubmit}
          language={language}
        />
      )}

      {mode === AppMode.RESULT && (
        <AnalysisResult 
          report={report} 
          isLoading={loading} 
          onRestart={() => setMode(AppMode.HOME)}
          language={language}
        />
      )}
    </Layout>
  );
};

const ShieldAlert = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
);

export default App;
