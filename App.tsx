
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
  /* Fix: Define AIStudio interface to ensure compatibility with global declarations */
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

  // 初始化語言、歷史紀錄與使用量統計
  useEffect(() => {
    const checkApiKey = async () => {
      // 優先檢查是否已經有注入好的 API_KEY
      if (process.env.API_KEY && process.env.API_KEY !== 'undefined') {
        setHasApiKey(true);
        return;
      }
      
      // 如果沒有 env，檢查環境是否支援 aistudio 選擇器
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else {
        // 如果是在獨立 Vercel 部署且沒設好 env，設為 false 以顯示提示
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
      await window.aistudio.openSelectKey();
      // 根據 race condition 處理指導方針，調用後直接假設已有 key 並繼續
      setHasApiKey(true);
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
      
      // 如果是因為 API Key 問題失敗，引導重新選擇
      if (error.message?.includes('API key')) {
        setHasApiKey(false);
      }

      const errorMsg = language === 'ZH' 
        ? `分析失敗：${error.message || '請檢查網路連線或 API Key 設置'}` 
        : `Analysis failed: ${error.message || 'Please check your connection or API Key settings'}`;
      alert(errorMsg);
      setMode(AppMode.HOME);
      setReport(null);
      setLoading(false);
    }
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleViewHistory = (record: HistoryRecord) => {
    setReport(record.report);
    setMode(AppMode.RESULT);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImportHistory = (records: HistoryRecord[]) => {
    setHistory(prev => {
      const combined = [...records, ...prev];
      const uniqueIds = new Set();
      return combined.filter(item => {
        if (!uniqueIds.has(item.id)) {
          uniqueIds.add(item.id);
          return true;
        }
        return false;
      });
    });
  };

  const handleRestart = () => {
    setMode(AppMode.HOME);
    setReport(null);
    setLoading(false);
  };

  const configs = getConfigs(language);

  return (
    <Layout language={language} onLanguageChange={setLanguage}>
      {/* API Key 狀態提示區 */}
      {!hasApiKey && (
        <div className="max-w-xl mx-auto mb-8 bg-rose-50 border-2 border-rose-200 p-6 rounded-3xl text-center shadow-sm animate-in fade-in slide-in-from-top-4">
          <p className="text-rose-700 font-bold mb-4">
            {language === 'ZH' ? '⚠️ 尚未檢測到有效的 API Key。' : '⚠️ No valid API Key detected.'}
          </p>
          <button 
            onClick={handleOpenKeyPicker}
            className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg active:scale-95"
          >
            {language === 'ZH' ? '點擊此處授權 API Key' : 'Click to Authorize API Key'}
          </button>
          <p className="mt-3 text-xs text-rose-500">
            {language === 'ZH' ? '授權後即可使用 AI 分析功能。' : 'Authorization is required for AI analysis features.'}
          </p>
        </div>
      )}

      {mode === AppMode.HOME && (
        <Home 
          onSelectMode={handleModeSelection} 
          language={language}
          history={history}
          onDeleteHistory={handleDeleteHistory}
          onViewHistory={handleViewHistory}
          onImportHistory={handleImportHistory}
          remainingUses={DAILY_LIMIT - usageCount}
          maxUses={DAILY_LIMIT}
        />
      )}

      {(mode === AppMode.CONSTITUTION || mode === AppMode.FIRSTAID) && !report && (
        <StepForm 
          config={configs[mode as keyof typeof configs]} 
          onBack={handleRestart}
          onSubmit={handleFormSubmit}
          language={language}
        />
      )}

      {mode === AppMode.RESULT && (
        <AnalysisResult 
          report={report} 
          isLoading={loading} 
          onRestart={handleRestart} 
          language={language}
        />
      )}
    </Layout>
  );
};

export default App;
