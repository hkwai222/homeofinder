
import { Language } from './types';

export const TRANSLATIONS: Record<Language, any> = {
  ZH: {
    nav: {
      title: "專業順勢療法 AI 助手",
      subtitle: "專業級臨床智能分析"
    },
    common: {
      disclaimer: "【重要免責聲明】本應用程式旨在協助您根據個人症狀與特徵尋找可能的順勢療法療劑圖景，僅供學術參考與自我健康管理輔助。本系統並非醫療診斷工具，亦不能替代專業醫師的醫療建議、診斷或治療。若您患有疾病、症狀持續或出現緊急醫療狀況，請務必立即諮詢您的家庭醫生或合格的醫療專業人員。",
      remainingUses: "今日剩餘分析次數",
      limitReached: "今日分析額度已用完",
      limitNote: "為了保護系統資源，每位用戶每天限額 5 次分析。請明天再來，或聯絡開發者。"
    },
    home: {
      mainTitle: "探索自然療癒的",
      accentTitle: "智慧分析系統",
      description: "結合 AI 臨床邏輯與深度療劑知識，為您提供最精準的個人化順勢療法方案。",
      constitutionTitle: "個人體質搜尋器",
      constitutionDesc: "深入分析心理、情緒、家族史及生理特性。適合慢性調理、性格特質分析或長期健康管理。",
      firstaidTitle: "急救療劑小幫手",
      firstaidDesc: "針對感冒、急性受傷、突發不適等情況提供快速分析。在急性期提供精確的療劑圖景對比。",
      ctaStart: "開始深度分析 →",
      ctaQuick: "獲取即時建議 →",
      instructionTitle: "使用說明與智慧功能",
      instruction1: "詳細填寫主訴與奇特症狀 (SRP)，這能幫助 AI 更精確鎖定療劑。",
      instruction2: "若有明顯的患部狀況（如紅腫、皮疹），可上傳清晰影像。",
      instruction3: "分析結果可匯出為 PDF 供個人記錄或與專業醫師討論。",
      instruction4: "【病歷紀錄】系統會自動將分析保存在瀏覽器。建議定期匯出備份，確保切換裝置後資料不遺失。"
    },
    history: {
      title: "我的病歷紀錄庫",
      empty: "目前尚無病歷紀錄。完成分析後，結果將自動保存在此處。",
      exportBtn: "匯出備份 (JSON)",
      importBtn: "匯入紀錄檔",
      date: "日期",
      type: "分析類型",
      summary: "重點內容",
      actions: "操作",
      view: "查看結果",
      delete: "刪除",
      importSuccess: "紀錄匯入成功！",
      importError: "檔案格式錯誤，請確保上傳正確的 JSON 檔案。",
      deleteConfirm: "確定要刪除這筆病歷嗎？此動作無法復原。"
    },
    form: {
      backToHome: "返回主頁",
      prevStep: "上一步",
      nextStep: "下一步",
      startAnalysis: "開始智能分析",
      nameLabel: "您的姓名",
      namePlaceholder: "例如：張大明",
      ageLabel: "年齡",
      agePlaceholder: "歲數",
      genderLabel: "性別",
      genderPlaceholder: "請選擇",
      genderM: "男",
      genderF: "女",
      genderO: "多元性別",
      inputHint: "（支援全球語文，請輸入您最熟悉的語言文字）",
      photoLabel: "影像紀錄 (選填)",
      photoPlaceholder: "點擊上傳或拍照",
      photoSupport: "支援 JPG, PNG 格式",
      photoSuccess: "已成功上傳影像",
      photoDisclaimer: "影像將僅供 AI 模型分析患部特徵使用。"
    },
    result: {
      loadingTitle: "深度分析中...",
      loadingDesc: "正在處理您的臨床資料、心理特徵與影像記錄，這通常需要 10-20 秒。",
      reportTitle: "深度分析報告",
      genTime: "生成時間",
      print: "列印報告",
      restart: "重新開始",
      coffeeMessage: "如果這個系統對您有幫助，歡迎隨喜請我喝一杯咖啡，支持開發與持續運作：",
      coffeeBtn: "請我喝杯咖啡 ☕",
      footerNote: "提醒：本報告由 AI 根據順勢療法原則生成。服用任何療劑前，請務必遵循醫療免責聲明並諮詢專業人員。",
      backToMenu: "← 返回主選單"
    }
  },
  EN: {
    nav: {
      title: "Homeopathy AI Assistant",
      subtitle: "Professional Clinical Analysis"
    },
    common: {
      disclaimer: "【Important Disclaimer】This application is designed to assist you in identifying potential homeopathic remedy pictures based on your personal symptoms and traits, intended for academic reference and self-health management support only. This system is NOT a medical diagnostic tool and is NOT a substitute for professional medical advice, diagnosis, or treatment. If you have a medical condition, persistent symptoms, or a medical emergency, please consult your family doctor or a qualified healthcare professional immediately.",
      remainingUses: "Daily Remaining Uses",
      limitReached: "Daily Limit Reached",
      limitNote: "To protect system resources, there is a limit of 5 analyses per user per day. Please come back tomorrow or contact the developer."
    },
    home: {
      mainTitle: "Explore Natural Healing with",
      accentTitle: "Smart Analysis",
      description: "Combining AI clinical logic with deep remedy knowledge to provide precise personalized homeopathic solutions.",
      constitutionTitle: "Constitutional Finder",
      constitutionDesc: "In-depth analysis of mental, emotional, family history, and physical traits. Ideal for chronic care and personality profiling.",
      firstaidTitle: "First Aid Helper",
      firstaidDesc: "Quick analysis for colds, acute injuries, and sudden discomfort. Provides precise remedy matching for acute stages.",
      ctaStart: "Start Deep Analysis →",
      ctaQuick: "Get Instant Advice →",
      instructionTitle: "Instructions & Smart Features",
      instruction1: "Detail your main complaints and SRP symptoms to help AI pinpoint the exact remedy.",
      instruction2: "Upload clear images for visible conditions like rashes or swelling.",
      instruction3: "Export results as PDF for your records or to discuss with a professional.",
      instruction4: "【Medical Records】Analyses are automatically saved in your browser. Export backups regularly to ensure no data loss across devices."
    },
    history: {
      title: "My Medical Records",
      empty: "No records found. Your analysis results will be automatically saved here.",
      exportBtn: "Export Backup (JSON)",
      importBtn: "Import Records",
      date: "Date",
      type: "Type",
      summary: "Summary",
      actions: "Actions",
      view: "View Result",
      delete: "Delete",
      importSuccess: "Records imported successfully!",
      importError: "File format error. Please upload a valid JSON file.",
      deleteConfirm: "Are you sure you want to delete this record? This action cannot be undone."
    },
    form: {
      backToHome: "Home",
      prevStep: "Back",
      nextStep: "Next",
      startAnalysis: "Analyze Now",
      nameLabel: "Your Name",
      namePlaceholder: "e.g., John Doe",
      ageLabel: "Age",
      agePlaceholder: "Years",
      genderLabel: "Gender",
      genderPlaceholder: "Select",
      genderM: "Male",
      genderF: "Female",
      genderO: "Other",
      inputHint: "(Supports all languages. Please enter in your preferred language.)",
      photoLabel: "Image Record (Optional)",
      photoPlaceholder: "Click to upload or take photo",
      photoSupport: "Supports JPG, PNG",
      photoSuccess: "Image uploaded successfully",
      photoDisclaimer: "Images are used only for AI clinical feature analysis."
    },
    result: {
      loadingTitle: "Deep Analyzing...",
      loadingDesc: "Processing clinical data, psychological traits, and image records. This usually takes 10-20 seconds.",
      reportTitle: "Deep Analysis Report",
      genTime: "Generated at",
      print: "Print Report",
      restart: "Start Over",
      coffeeMessage: "If this system helped you, feel free to buy me a coffee to support development and operation:",
      coffeeBtn: "Buy Me a Coffee ☕",
      footerNote: "Note: This report is generated by AI based on homeopathic principles. Before taking any remedy, please follow the medical disclaimer and consult a professional.",
      backToMenu: "← Back to Menu"
    }
  }
};
