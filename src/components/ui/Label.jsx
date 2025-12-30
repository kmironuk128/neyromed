// src/components/ui/Label.js
import styled from "styled-components";

export const Label = styled.label`
  font-size: ${(props) => props.theme.mobileFont.md};
  color: ${(props) => props.color || props.theme.colors.text1};
  margin-right: ${(props) => props.theme.spacing.sm};
  white-space: nowrap;
  display: block;
  margin-bottom: ${(props) => props.theme.spacing.xs};
  font-weight: 500;

  white-space: normal; 
  word-break: break-word; 
  overflow-wrap: break-word;
  
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.mobileFont.md};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.mobileFont.xs};
    margin-right: ${(props) => props.theme.spacing.xs};
  }
`;

// Варіант для inline-лейблів
export const InlineLabel = styled(Label)`
  display: inline-block;
  margin-bottom: 0;
  vertical-align: middle;
`;
