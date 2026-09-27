import { useState, useMemo } from 'react';

interface UseExpandDescriptionProps {
  text: string;
  maxLines?: number;
}


export const useExpandDescription = ({
                                       text,
                                       maxLines = 4,
                                     }: UseExpandDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const lineCount = useMemo(() => {
    return text.split('\n').length;
  }, [text]);

  const isTruncated = useMemo(() => {
    const characterLimit = maxLines * 60;
    return text.length > characterLimit;
  }, [text, maxLines]);

  return {
    isExpanded,
    setIsExpanded,
    isTruncated,
    lineCount,
  };
};
