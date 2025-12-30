// src/components/ui/Input.js
import styled from "styled-components";

export const Input = styled.input`
  padding: ${(props) => props.theme.spacing.md}
      ${(props) => props.theme.spacing.xl}
  font-size: ${(props) => props.theme.mobileFont.xs};
  max-height: fit-content;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) => props.theme.colors.smallbg};
  color: ${(props) => props.theme.colors.text2};
  outline: none;
  appearance: none;
  margin-top: ${(props) => props.theme.spacing.xs};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  transition: border-color 0.2s ease, background-color 0.2s ease;
  width: 100%;

  &:focus {
    border-color: ${(props) => props.theme.colors.active};
    background-color: ${(props) => props.theme.colors.white};
    box-shadow: 0 0 0 2px
      rgba(
        ${(props) => {
          const hex = props.theme.colors.active.replace("#", "");
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          return `${r}, ${g}, ${b}, 0.2`;
        }}
      );
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.mobileFont.xs};
    padding: ${(props) => props.theme.spacing.md}
      ${(props) => props.theme.spacing.xl};
    width: 100%;
    margin-top: 0;
    margin-bottom: 1rem;
  }
`;

export const Select = styled.select`
adding: ${(props) => props.theme.spacing.md}
      ${(props) => props.theme.spacing.xl}
  font-size: ${(props) => props.theme.mobileFont.xs};
  max-height: fit-content;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) => props.theme.colors.smallbg};
  color: ${(props) => props.theme.colors.text2};
  outline: none;
  appearance: none;
  margin-top: ${(props) => props.theme.spacing.xs};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  transition: border-color 0.2s ease, background-color 0.2s ease;
  width: 100%;

  &:focus {
    border-color: ${(props) => props.theme.colors.active};
    background-color: ${(props) => props.theme.colors.white};
    box-shadow: 0 0 0 2px
      rgba(
        ${(props) => {
          const hex = props.theme.colors.active.replace("#", "");
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          return `${r}, ${g}, ${b}, 0.2`;
        }}
      );
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.mobileFont.xs};
    padding: ${(props) => props.theme.spacing.md}
      ${(props) => props.theme.spacing.xl};
    width: 100%;
    margin-top: 0;
    margin-bottom: 1rem;
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  height: ${(props) => props.height || "120px"};
  padding: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.mobileFont.sm};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) => props.theme.colors.white};
  outline: none;
  margin: ${(props) => props.theme.spacing.sm} 0;
  resize: vertical;
  transition: border-color 0.2s ease;
  line-height: 1.5;

  &::placeholder {
    color: ${(props) => props.theme.colors.text2};
    opacity: 0.7;
  }

  &:focus {
    border-color: ${(props) => props.theme.colors.active};
    box-shadow: 0 0 0 2px
      rgba(
        ${(props) => {
          const hex = props.theme.colors.active.replace("#", "");
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          return `${r}, ${g}, ${b}, 0.2`;
        }}
      );
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray};
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.desktop}) {
    height: ${(props) => props.height || "100px"};
    padding: ${(props) => props.theme.spacing.xxs};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.mobileFont.xs};
    height: ${(props) => props.height || "90px"};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    height: 50px;
    min-height: 50px;
    padding: ${(props) => props.theme.spacing.xs}
      ${(props) => props.theme.spacing.sm};
    border-radius: ${(props) => props.theme.borderRadius.sm};
  }
`;

export const SmallTextarea = styled(Textarea)`
  min-height: 40px;
  height: auto;
  font-size: ${(props) => props.theme.mobileFont.xs};
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  line-height: 1.4;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    min-height: 35px;
    font-size: ${(props) => props.theme.mobileFont.xxs};
  }
`;