
import React, { useContext } from 'react';
import { Globe } from 'lucide-react';
import { LanguageContext } from '@/pages/Index';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <div className="flex items-center space-x-2 glass-card px-3 py-2 rounded-full">
      <Globe size={16} className="text-muted-foreground" />
      <select 
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'ja' | 'zh')}
        className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="ja">日本語</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
