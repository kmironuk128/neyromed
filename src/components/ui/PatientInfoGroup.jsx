// components/ui/FormGroup.jsx
import styled from 'styled-components';

export const PatientInputGroup = styled.div`
  display: flex;
  align-items: center;
  margin: ${props => props.theme.spacing.md} 0 ${props => props.theme.spacing.xxs} ${props => props.theme.spacing.md};
  width: 20rem;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  
  label {
    font-size: ${props => props.theme.mobileFont.sm};
    color: ${props => props.theme.colors.text1};
    margin: ${props => props.theme.spacing.md} 0;
    white-space: nowrap;
    
    @media (max-width: ${props => props.theme.breakpoints.desktop}) {
      font-size: ${props => props.theme.mobileFont.md};
    }
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.mobileFont.sm};
      margin-right: 0;
      margin-bottom: ${props => props.theme.spacing.xl};
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.xs};
    margin: ${props => props.theme.spacing.sm} 0 ${props => props.theme.spacing.xl} ${props => props.theme.spacing.sm};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin: ${props => props.theme.spacing.xl} 0 ${props => props.theme.spacing.xl} 0;
    width: 10rem;
  }
`;