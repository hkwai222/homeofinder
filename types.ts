
export enum AppMode {
  HOME = 'HOME',
  CONSTITUTION = 'CONSTITUTION',
  FIRSTAID = 'FIRSTAID',
  RESULT = 'RESULT'
}

export type Language = 'ZH' | 'EN';

export type UserData = {
  name?: string;
  age?: string;
  gender?: string;
  [key: string]: string | undefined;
};

export type Step = {
  id: string;
  title: string;
  type: 'fields' | 'text' | 'file';
  question?: string;
};

export type AppConfig = {
  title: string;
  color: string;
  btnColor: string;
  accentColor: string;
  steps: Step[];
};

export type AnalysisResult = {
  report: string;
};

export type HistoryRecord = {
  id: string;
  date: string;
  mode: AppMode;
  data: UserData;
  report: string;
};
