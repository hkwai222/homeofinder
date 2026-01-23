
import React, { useState, useEffect, useCallback } from 'react';
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

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [language, setLanguage] = useState<Language>('ZH');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [usageCount, setUsageCount] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(true);

  // 檢查是否已有金鑰授權
  const checkApiKeyStatus = useCallback(async () => {
    // 檢查環境變數是否已直接可用
    const key = process.env.API_KEY;
    const isKeySet = !!(key && key !== 'undefined' && key !== '');
    
    if (isKeySet) {
      setHasApiKey(true);
      return true;
    } else if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
      return selected;
    } else {
      setHasApiKey(false);
      return false;
    }
  }, []);

  // 初始化語言、歷史紀錄與使用量統計
  useEffect(() => {
    checkApiKeyStatus();

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
  }, [checkApiKeyStatus]);

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
        // 按照規範，調用後應直接假設授權成功並繼續，不等待 race condition
        setHasApiKey(true);
      } catch (e) {
        console.error("Failed to open key picker", e);
      }
    } else {
      alert(language === 'ZH' ? "當前環境不支援金鑰選擇器。" : "Key picker not supported.");
    }
  };

  const handleFormSubmit = async (data: UserData, photo: string | null) => {
    const t = TRANSLATIONS[language].common;

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
      
      const errorStr = error.toString();
      
      // 處理 API 金鑰失效或缺失的特定錯誤
      if (errorStr.includes("API_KEY_NOT_FOUND") || 
          errorStr.includes("API key") || 
          errorStr.includes("apiKey") ||
          errorStr.includes("set when running in a browser") ||
          errorStr.includes("Requested entity was not found") ||
          errorStr.includes("403") ||
          errorStr.includes("401")) {
        
        setHasApiKey(false);
        const keyMsg = language === 'ZH'
          ? "API 金鑰授權無效或已過期，請點擊頁面頂部的「立即授權」重新選取金鑰。請確保選擇一個已開啟計費功能 (Paid) 的項目。"
          : "API Key authorization failed or expired. Please click 'Authorize Now' to select a valid key from a paid project.";
        alert(keyMsg);
      } else {
        alert(language === 'ZH' ? `分析失敗：${error.message || '連線不穩定'}` : `Analysis failed: ${error.message || 'Connection error'}`);
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
        <div className="max-w-4xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-900/5">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 shrink-0 shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-black text-xl text-orange-900">{language === 'ZH' ? '需要 API 金鑰授權' : 'API Key Authorization Required'}</h4>
                <p className="text-orange-700 font-medium leading-relaxed">{language === 'ZH' ? '為了使用進階的 AI 臨床分析，系統需要您授權一個已啟用的 API 金鑰。' : 'Advanced analysis requires an authorized API key.'}</p>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-xs text-orange-600 underline mt-2 inline-block font-bold hover:text-orange-800 transition-colors">
                  {language === 'ZH' ? '關於計費說明與授權教學' : 'View billing info and auth guide'}
                </a>
              </div>
            </div>
            <button
              onClick={handleOpenKeyPicker}
              className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-600/20 transition-all active:scale-95 whitespace-nowrap"
            >
              {language === 'ZH' ? '立即授權' : 'Authorize Now'}
            </button>
          </div>
        </div>
      )}

      {mode === AppMode.HOME && (
        <Home 
          onSelectMode={(m) => setMode(m)} 
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
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
);

export default App;
