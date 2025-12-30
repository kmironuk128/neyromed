// components/ui/RadioGroup.jsx
import styled from 'styled-components';


export const RadioGroup = styled.div`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.columns}, 1fr)`};
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
  
  /* Планшети */
  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  /* Мобільні */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${props => props.theme.spacing.xs};
  }
  
  /* Маленькі мобільні */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.theme.spacing.xxl};
  }
`;

export const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  display: none;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.gray};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.deskFont.sm};
  cursor: pointer;
  text-align: center;
  min-height: 40px;
  word-break: break-word;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
    transform: scale(1.03);
    border-color: ${props => props.theme.colors.active};
  }
  
  ${HiddenRadio}:checked + & {
    background-color: ${props => props.theme.colors.active};
    color: ${props => props.theme.colors.white};
  }
  
  /* Адаптивність */
  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.xs};
    font-size: ${props => props.theme.mobileFont.sm};
    min-height: 45px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.xs};
    font-size: ${props => props.theme.mobileFont.xs};
    min-height: 50px;
    border-radius: ${props => props.theme.borderRadius.md};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.xxs};
    font-size: ${props => props.theme.mobileFont.xs};
    min-height: 30px;
    border-radius: ${props => props.theme.borderRadius.sm};
  }
`;