// theme.js
export const theme = {
  colors: {
    text2: "#444",
    text1: "#333",
    bg: "#8fb7a159",
    hover: "#bfd8bdd3",
    active: "#98c9a3",
    dark: "#3b7d62",
    border: "#ddd",
    white: "#fff",
    smallbg: "#f9f9f997",
    gray: "#f0f0f0", // Додайте це для RadioLabel
  },
  
  // ПРАВИЛЬНІ розміри шрифтів для мобільних (занадто великі були)
  mobileFont: {
    xxs: "0.5rem",    // 8px
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    md: "1rem",       // 16px
    lg: "1.5rem",   
    xl: "2rem",    
    xxl: "3rem",   
    xxxl: "2rem",     
  },
  
  deskFont: {
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    md: "1rem",       // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    xxl: "1.5rem",    // 24px
    xxxl: "2rem",     // 32px
  },
  
  spacing: {
    xs: "0.5%",
    sm: "1%",
    md: "2%",
    lg: "3%",
    xl: "4%",
    xxl: "7%",
    xxxl: "12%",
  },
  
  borderRadius: {
    sm: "3px",
    md: "5px",
    lg: "8px",
    xl: "10px",
    round: "100%",
  },
  
  shadows: {
    sm: "0 1px 7px rgba(0, 0, 0, 0.2)",
    md: "0 4px 8px rgba(0, 0, 0, 0.1)",
    lg: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  
  // Додайте breakpoints для кращої організації
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    laptop: "1024px",
    desktop: "1200px",
  }
};