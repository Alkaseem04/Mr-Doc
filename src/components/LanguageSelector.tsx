import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'en' | 'hi' | 'mr');
  };

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-500" />
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue>
            {language === 'en' && 'English'}
            {language === 'hi' && 'हिंदी'}
            {language === 'mr' && 'मराठी'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="hi">हिंदी</SelectItem>
          <SelectItem value="mr">मराठी</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;