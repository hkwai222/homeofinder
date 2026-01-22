
import { AppConfig, Language } from './types';

export const getConfigs = (lang: Language): Record<'CONSTITUTION' | 'FIRSTAID', AppConfig> => ({
  CONSTITUTION: {
    title: lang === 'ZH' ? "個人體質搜尋器" : "Constitutional Finder",
    color: "bg-teal-600",
    btnColor: "bg-teal-600",
    accentColor: "#0d9488",
    steps: [
      { id: 'profile', title: lang === 'ZH' ? '基本資料' : 'Profile', type: 'fields' },
      { id: 'mind', title: lang === 'ZH' ? '心理與情緒' : 'Mind & Emotions', type: 'text', question: lang === 'ZH' ? '請描述您的性格、恐懼或情緒壓力：' : 'Describe your personality, fears, or emotional stress:' },
      { id: 'physical', title: lang === 'ZH' ? '身體特徵' : 'Physical Traits', type: 'text', question: lang === 'ZH' ? '您的睡眠、天氣敏感度與出汗情況？' : 'Your sleep, weather sensitivity, and perspiration?' },
      { id: 'cravings', title: lang === 'ZH' ? '飲食偏好' : 'Food Cravings', type: 'text', question: lang === 'ZH' ? '您渴望或厭惡哪些食物？' : 'Which foods do you crave or dislike?' },
      { id: 'symptoms', title: lang === 'ZH' ? '主訴與 SRP' : 'Complaints & SRP', type: 'text', question: lang === 'ZH' ? '描述最困擾的問題及奇特症狀 (Strange, Rare and Peculiar)：' : 'Describe main complaints and SRP (Strange, Rare and Peculiar) symptoms:' },
      { id: 'history', title: lang === 'ZH' ? '家族與病史' : 'History', type: 'text', question: lang === 'ZH' ? '過往大病史或家族遺傳狀況：' : 'Past major illnesses or family history:' },
      { id: 'photo', title: lang === 'ZH' ? '影像上傳' : 'Photo Upload', type: 'file' }
    ]
  },
  FIRSTAID: {
    title: lang === 'ZH' ? "急救療劑小幫手" : "First Aid Helper",
    color: "bg-slate-800",
    btnColor: "bg-orange-600",
    accentColor: "#ea580c",
    steps: [
      { id: 'profile', title: lang === 'ZH' ? '基本資料' : 'Profile', type: 'fields' },
      { id: 'discomfort', title: lang === 'ZH' ? '目前不適感' : 'Current Discomfort', type: 'text', question: lang === 'ZH' ? '哪裡不舒服？(例如：灼熱感、刺痛、抽痛等細節描述)' : 'Where is the discomfort? (Describe details like burning, stinging, throbbing, etc.)' },
      { id: 'onset', title: lang === 'ZH' ? '發病背景' : 'Onset Background', type: 'text', question: lang === 'ZH' ? '症狀何時開始？有何環境誘因？(例如：受寒、驚嚇、受傷)' : 'When did it start? Any triggers? (e.g., cold, shock, injury)' },
      { id: 'history', title: lang === 'ZH' ? '過往背景' : 'Medical History', type: 'text', question: lang === 'ZH' ? '以往是否有類似情況或相關病史？' : 'Any similar past situations or medical history?' },
      { id: 'photo', title: lang === 'ZH' ? '症狀影像' : 'Symptom Photo', type: 'file' }
    ]
  }
});
