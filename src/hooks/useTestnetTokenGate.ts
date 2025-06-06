import { useState } from 'react';
import { TestnetTokenGateConfig } from '../types';
import { 
  generateTestnetEmbedCode, 
  generateTestnetVerificationUrl, 
  generateTestnetWordPressCode, 
  generateTestnetServerCode 
} from '../utils/testnetCodeGenerator';

export const useTestnetTokenGate = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCode = (config: TestnetTokenGateConfig) => {
    setIsGenerating(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
    
    if (config.integration === 'embed') {
      return generateTestnetEmbedCode(config);
    } else if (config.integration === 'wordpress') {
      return generateTestnetWordPressCode(config);
    } else if (config.integration === 'server') {
      return generateTestnetServerCode(config);
    } else {
      return generateTestnetVerificationUrl(config);
    }
  };

  return {
    generateCode,
    isGenerating
  };
};