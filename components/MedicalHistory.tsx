
import React, { useRef } from 'react';
import { HistoryRecord, Language, AppMode } from '../types';
import { TRANSLATIONS } from '../translations';
import { FileDown, FileUp, Trash2, Eye, Calendar, ClipboardList, Info } from 'lucide-react';

interface MedicalHistoryProps {
  history: HistoryRecord[];
  onDelete: (id: string) => void;
  onView: (record: HistoryRecord) => void;
  onImport: (records: HistoryRecord[]) => void;
  language: Language;
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ history, onDelete, onView, onImport, language }) => {
  const t = TRANSLATIONS[language].history;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `homeopathy_records_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onImport(imported);
          alert(t.importSuccess);
        } else {
          throw new Error();
        }
      } catch (err) {
        alert(t.importError);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mt-16 max-w-5xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-teal-600" />
            {t.title}
          </h3>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            {language === 'ZH' ? '所有紀錄皆保存在您的瀏覽器中' : 'All records are saved locally in your browser'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 px-5 py-3 rounded-2xl font-bold transition-all border border-slate-200"
          >
            <FileUp className="w-5 h-5" />
            {t.importBtn}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className="hidden" 
            accept=".json"
          />
          <button 
            onClick={handleExport}
            disabled={history.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown className="w-5 h-5" />
            {t.exportBtn}
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-slate-100 border-dashed">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <Calendar className="w-10 h-10 text-slate-200" />
          </div>
          <p className="text-slate-400 font-medium text-lg">{t.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item) => (
            <div key={item.id} className="group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${item.mode === AppMode.CONSTITUTION ? 'bg-teal-50 text-teal-600' : 'bg-orange-50 text-orange-600'}`}>
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${item.mode === AppMode.CONSTITUTION ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'}`}>
                      {item.mode === AppMode.CONSTITUTION ? TRANSLATIONS[language].home.constitutionTitle : TRANSLATIONS[language].home.firstaidTitle}
                    </span>
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString(language === 'ZH' ? 'zh-TW' : 'en-US')}
                    </span>
                  </div>
                  <div className="font-black text-slate-800 text-lg">
                    {item.data.name ? `${item.data.name} (${item.data.age})` : 'Anonymous Patient'}
                  </div>
                  <div className="text-sm text-slate-400 truncate max-w-[200px] md:max-w-md">
                    {item.report.substring(0, 100)}...
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onView(item)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  {t.view}
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(t.deleteConfirm)) onDelete(item.id);
                  }}
                  className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                  title={t.delete}
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
