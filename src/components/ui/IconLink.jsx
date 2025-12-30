// src/components/ui/IconLink.js — для іконок навігації
import styled from 'styled-components';

export const IconLink = styled.a`
  margin: ${props => props.theme.spacing.xxs};

  img {
    width: 2vw;
    height: 2vw;
    min-width: 24px;
    min-height: 24px;
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: scale(1.09);
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.active};
    outline-offset: 2px;
    border-radius: ${props => props.theme.borderRadius.sm};
  }

  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    margin: ${props => props.theme.spacing.sm};
    
    img {
      width: 4.5vw;
      height: 4.5vw;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin: ${props => props.theme.spacing.xs};
    
    img {
      width: 6vw;
      height: 6vw;
      min-width: 20px;
      min-height: 20px;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    img {
      width: 5vw;
      height: 5vw;
      min-width: 18px;
      min-height: 18px;
    }
  }
`;