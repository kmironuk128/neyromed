// src/components/ui/Button.js
import styled from 'styled-components';

export const Button = styled.button`
  background-color: ${props => props.theme.colors.dark};
  color: ${props => props.theme.colors.white};
  border: none;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: ${props => props.theme.deskFont.md};
  margin: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xs} 0;
  transition: background-color 0.2s ease;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.theme.colors.active};
  }

  &:active {
    background-color: ${props => props.theme.colors.active};
    transform: translateY(1px);
  }

  &:disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.sm};
    font-size: ${props => props.theme.deskFont.sm};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.mobileFont.sm};
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    border-radius: ${props => props.theme.borderRadius.lg};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.mobileFont.sm};
    border-radius: ${props => props.theme.borderRadius.md};
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
    margin-right: ${props => props.theme.spacing.md};
  }
`;

export const OutlineButton = styled(Button)`
  background-color: transparent;
  border: 1.5px solid ${props => props.theme.colors.dark};
  color: ${props => props.theme.colors.dark};

  &:hover {
    background-color: ${props => props.theme.colors.active};
    color: ${props => props.theme.colors.white};
    border-color: ${props => props.theme.colors.active};
  }

  &:active {
    background-color: ${props => props.theme.colors.dark};
    border-color: ${props => props.theme.colors.dark};
  }

  &:disabled {
    background-color: transparent;
    border-color: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.border};
    opacity: 0.6;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    border-width: 1px;
  }
`;