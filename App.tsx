
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

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [language, setLanguage] = useState<Language>('ZH');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [usageCount, setUsageCount] = useState(0);

  // 初始化語言、歷史紀錄與使用量統計
  useEffect(() => {
    const userLang = navigator.language.toLowerCase();
    if (userLang.startsWith('zh')) {
      setLanguage('ZH');
    } else {
      setLanguage('EN');
    }

    // 加載歷史
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }

    // 加載使用量統計
    const savedUsage = localStorage.getItem(USAGE_KEY);
    const today = new Date().toDateString();
    
    if (savedUsage) {
      try {
        const stats = JSON.parse(savedUsage);
        if (stats.date === today) {
          setUsageCount(stats.count);
        } else {
          // 如果不是今天，則重置
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

  // 監聽歷史紀錄變化並保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  // 更新使用量
  const incrementUsage = () => {
    const today = new Date().toDateString();
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count: newCount }));
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
        
        // 只要開始有字出來，就算成功使用了 1 次
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
      const errorMsg = language === 'ZH' 
        ? `分析失敗：${error.message || '請檢查網路連線'}` 
        : `Analysis failed: ${error.message || 'Please check your connection'}`;
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
