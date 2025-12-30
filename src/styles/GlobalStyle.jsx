// src/styles/GlobalStyle.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    width: 100%;
    overflow-x: hidden;
    
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: 15px;
    }
    
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      font-size: 14px;
    }
  }

  body {
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
    background-color: ${(props) => props.theme.colors.hover};
    color: ${(props) => props.theme.colors.text1};
    line-height: 1.6;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: ${(props) => props.theme.spacing.md};
    color: ${(props) => props.theme.colors.text2};
  }

  h1 {
    font-size: ${(props) => props.theme.deskFont.xxxl};
    
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: ${(props) => props.theme.mobileFont.xxl};
    }
    
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      font-size: ${(props) => props.theme.mobileFont.xl};
    }
  }

  h2 {
    font-size: ${(props) => props.theme.deskFont.xxl};
    
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: ${(props) => props.theme.mobileFont.xl};
    }
    
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      font-size: ${(props) => props.theme.mobileFont.lg};
    }
  }

  p {
    margin-bottom: ${(props) => props.theme.spacing.md};
    line-height: 1.7;
    
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      line-height: 1.6;
    }
  }

  a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.dark};
    transition: color 0.2s ease;
    
    &:hover {
      color: ${(props) => props.theme.colors.active};
      text-decoration: underline;
    }
    
    &:focus-visible {
      outline: 2px solid ${(props) => props.theme.colors.active};
      outline-offset: 2px;
      border-radius: ${(props) => props.theme.borderRadius.sm};
    }
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ul, ol {
    margin-bottom: ${(props) => props.theme.spacing.md};
    padding-left: ${(props) => props.theme.spacing.lg};
    
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      padding-left: ${(props) => props.theme.spacing.md};
    }
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  li {
    margin-bottom: ${(props) => props.theme.spacing.xs};
  }

  button, 
  input, 
  textarea, 
  select {
    font-family: inherit;
    line-height: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea {
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: ${(props) => props.theme.borderRadius.md};
    padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.colors.active};
      box-shadow: 0 0 0 3px rgba(${(props) => {
        const hex = props.theme.colors.active.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return `${r}, ${g}, ${b}, 0.2`;
      }});
    }
    
    &::placeholder {
      color: ${(props) => props.theme.colors.text2};
      opacity: 0.7;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  select {
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: ${(props) => props.theme.borderRadius.md};
    padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
    background-color: ${(props) => props.theme.colors.white};
    cursor: pointer;
  }

  hr {
    border: none;
    border-top: 1px solid ${(props) => props.theme.colors.border};
    margin: ${(props) => props.theme.spacing.lg} 0;
  }

  code {
    background-color: ${(props) => props.theme.colors.smallbg};
    padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
    border-radius: ${(props) => props.theme.borderRadius.sm};
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background-color: ${(props) => props.theme.colors.smallbg};
    padding: ${(props) => props.theme.spacing.md};
    border-radius: ${(props) => props.theme.borderRadius.md};
    overflow-x: auto;
    margin-bottom: ${(props) => props.theme.spacing.md};
  }

  blockquote {
    border-left: 4px solid ${(props) => props.theme.colors.active};
    padding-left: ${(props) => props.theme.spacing.lg};
    margin-left: 0;
    margin-right: 0;
    margin-bottom: ${(props) => props.theme.spacing.md};
    font-style: italic;
    color: ${(props) => props.theme.colors.text2};
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: ${(props) => props.theme.spacing.md};
  }

  th, td {
    padding: ${(props) => props.theme.spacing.sm};
    text-align: left;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }

  th {
    background-color: ${(props) => props.theme.colors.smallbg};
    font-weight: 600;
    color: ${(props) => props.theme.colors.text2};
  }

  tr:hover {
    background-color: ${(props) => props.theme.colors.hover};
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

export default GlobalStyle;