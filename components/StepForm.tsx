
import React, { useState } from 'react';
import { AppConfig, UserData, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { ChevronLeft, Camera } from 'lucide-react';

interface StepFormProps {
  config: AppConfig;
  onBack: () => void;
  onSubmit: (data: UserData, photo: string | null) => void;
  language: Language;
}

const StepForm: React.FC<StepFormProps> = ({ config, onBack, onSubmit, language }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<UserData>({});
  const [photo, setPhoto] = useState<string | null>(null);

  const t = TRANSLATIONS[language].form;
  const currentStep = config.steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < config.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onSubmit(formData, photo);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const updateField = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={handlePrev}
        className="flex items-center gap-1 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors no-print"
      >
        <ChevronLeft className="w-4 h-4" />
        {currentStepIndex === 0 ? t.backToHome : t.prevStep}
      </button>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-b-[8px]" style={{ borderColor: config.accentColor }}>
        <header className={`p-8 text-white text-center ${config.color} transition-colors duration-500`}>
          <h2 className="text-2xl font-bold mb-1">{config.title}</h2>
          <p className="opacity-80 font-medium">{currentStep.title}</p>
        </header>

        <div className="p-8">
          <div className="flex gap-2 mb-10 no-print">
            {config.steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                  i <= currentStepIndex ? 'bg-teal-600' : 'bg-slate-100'
                }`}
              />
            ))}
          </div>

          <div className="min-h-[300px]">
            {currentStep.type === 'fields' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.nameLabel}</label>
                  <input
                    type="text"
                    placeholder={t.namePlaceholder}
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all bg-slate-50"
                    value={formData.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t.ageLabel}</label>
                    <input
                      type="number"
                      placeholder={t.agePlaceholder}
                      className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all bg-slate-50"
                      value={formData.age || ''}
                      onChange={(e) => updateField('age', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t.genderLabel}</label>
                    <select
                      className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all bg-slate-50 appearance-none"
                      value={formData.gender || ''}
                      onChange={(e) => updateField('gender', e.target.value)}
                    >
                      <option value="">{t.genderPlaceholder}</option>
                      <option value="男">{t.genderM}</option>
                      <option value="女">{t.genderF}</option>
                      <option value="多元性別">{t.genderO}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep.type === 'text' && (
              <div>
                <div className="flex justify-between items-baseline mb-4">
                  <label className="block text-lg font-bold text-slate-800">{currentStep.question}</label>
                </div>
                <div className="text-xs text-teal-600 font-medium mb-3">{t.inputHint}</div>
                <textarea
                  rows={8}
                  className="w-full p-6 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-teal-500 outline-none transition-all bg-slate-50 leading-relaxed"
                  placeholder="..."
                  value={formData[currentStep.id] || ''}
                  onChange={(e) => updateField(currentStep.id, e.target.value)}
                />
              </div>
            )}

            {currentStep.type === 'file' && (
              <div className="text-center">
                <label className="block text-lg font-bold text-slate-800 mb-6">{t.photoLabel}</label>
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 cursor-pointer hover:bg-slate-50 hover:border-teal-400 transition-all"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {photo ? (
                    <div className="space-y-4">
                      <img src={photo} className="max-h-64 mx-auto rounded-2xl shadow-lg border-4 border-white" alt="Preview" />
                      <p className="text-teal-600 font-bold">{t.photoSuccess}</p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-slate-400">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                        <Camera className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-slate-800 font-bold">{t.photoPlaceholder}</p>
                        <p className="text-sm">{t.photoSupport}</p>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="mt-6 text-sm text-slate-400">
                  {t.photoDisclaimer}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-12 no-print">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {t.prevStep}
              </button>
            )}
            <button
              onClick={handleNext}
              className={`flex-[2] py-4 rounded-2xl font-bold text-white shadow-xl transition-all hover:opacity-90 active:scale-95 ${config.btnColor}`}
            >
              {currentStepIndex === config.steps.length - 1 ? t.startAnalysis : t.nextStep}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepForm;
