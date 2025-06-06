import { useState } from 'react';
import { TokenGateConfig } from '../types';
import { generateEmbedCode, generateVerificationUrl, generateWordPressCode, generateServerCode } from '../utils/codeGenerator';

export const useTokenGate = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCode = (config: TokenGateConfig) => {
    setIsGenerating(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
    
    if (config.integration === 'embed') {
      return generateEmbedCode(config);
    } else if (config.integration === 'wordpress') {
      return generateWordPressCode(config);
    } else if (config.integration === 'server') {
      return generateServerCode(config);
    } else {
      return generateVerificationUrl(config);
    }
  };

  return {
    generateCode,
    isGenerating
  };
};