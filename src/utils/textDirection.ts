/**
 * Utility function to detect text direction based on Persian/Arabic characters
 * @param text - The text to analyze
 * @returns 'rtl' if Persian/Arabic characters are found, 'ltr' otherwise
 */
export const getTextDirection = (text: string): 'rtl' | 'ltr' => {
    if (!text || typeof text !== 'string') {
        return 'ltr';
    }

    // Persian/Arabic Unicode ranges:
    // Persian: U+0600-U+06FF (Arabic block)
    // Persian: U+0750-U+077F (Arabic Supplement)
    // Persian: U+08A0-U+08FF (Arabic Extended-A)
    // Persian: U+FB50-U+FDFF (Arabic Presentation Forms-A)
    // Persian: U+FE70-U+FEFF (Arabic Presentation Forms-B)
    // Persian: U+1EE00-U+1EEFF (Arabic Mathematical Alphabetic Symbols)
    
    const persianArabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u1EE00-\u1EEFF]/;
    
    return persianArabicRegex.test(text) ? 'rtl' : 'ltr';
};

/**
 * Utility function to get CSS direction property value
 * @param text - The text to analyze
 * @returns 'rtl' or 'ltr' for CSS direction property
 */
export const getCSSDirection = (text: string): 'rtl' | 'ltr' => {
    return getTextDirection(text);
};

/**
 * Utility function to get HTML dir attribute value
 * @param text - The text to analyze
 * @returns 'rtl' or 'ltr' for HTML dir attribute
 */
export const getHTMLDir = (text: string): 'rtl' | 'ltr' => {
    return getTextDirection(text);
};

/**
 * Utility function to check if text contains Persian/Arabic characters
 * @param text - The text to check
 * @returns true if Persian/Arabic characters are found, false otherwise
 */
export const hasPersianArabic = (text: string): boolean => {
    return getTextDirection(text) === 'rtl';
};

/**
 * Utility function to check if text contains only Persian/Arabic characters
 * @param text - The text to check
 * @returns true if text contains only Persian/Arabic characters, false otherwise
 */
export const isOnlyPersianArabic = (text: string): boolean => {
    if (!text || typeof text !== 'string') {
        return false;
    }

    // Remove whitespace and check if remaining characters are all Persian/Arabic
    const cleanText = text.replace(/\s/g, '');
    if (cleanText.length === 0) {
        return false;
    }

    const persianArabicRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u1EE00-\u1EEFF]+$/;
    
    return persianArabicRegex.test(cleanText);
};

/**
 * Utility function to get text alignment based on direction
 * @param text - The text to analyze
 * @returns 'right' for RTL text, 'left' for LTR text
 */
export const getTextAlign = (text: string): 'left' | 'right' => {
    return getTextDirection(text) === 'rtl' ? 'right' : 'left';
};

export default getTextDirection;
