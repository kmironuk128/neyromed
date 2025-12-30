// src/components/ui/Title.js
import styled from "styled-components";

export const Title = styled.h1`
  font-size: ${(props) => props.theme.deskFont.xxxl};
  text-align: center;
  color: ${(props) => props.theme.colors.text2};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  font-weight: 600;
  padding: 0 ${(props) => props.theme.spacing.md};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.mobileFont.xxl};
    margin-bottom: ${(props) => props.theme.spacing.xl};
    padding: 0 ${(props) => props.theme.spacing.sm};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.mobileFont.xl};
    margin-bottom: ${(props) => props.theme.spacing.xxl};
    margin-top: 0;
    padding: 0 ${(props) => props.theme.spacing.xs};
  }
`;

export const Subtitle = styled.h2`
  font-size: ${(props) => props.theme.deskFont.xxl};
  text-align: center;
  color: ${(props) => props.color || props.theme.colors.text2};
  margin: 0;
  font-weight: 700;
  line-height: 1.3;
  padding: 0 ${(props) => props.theme.spacing.md};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.mobileFont.lg};
    margin: ${(props) => props.theme.spacing.lg} 0;
    padding: 0 ${(props) => props.theme.spacing.sm};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.mobileFont.lg};
    margin: ${(props) => props.theme.spacing.md} 0;
    padding: 0 ${(props) => props.theme.spacing.xs};
  }
`;

// Додатковий варіант для менших заголовків, якщо потрібно
export const SectionTitle = styled.h3`
  font-size: ${(props) => props.theme.deskFont.lg};
  text-align: ${(props) => props.align || "center"};
  color: ${(props) => props.theme.colors.text1};
  margin: ${(props) => props.theme.spacing.lg} 0;
  font-weight: 500;
  line-height: 1.4;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.mobileFont.md};
    margin: ${(props) => props.theme.spacing.md} 0
      ${(props) => props.theme.spacing.sm};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin-top: ${(props) => props.theme.spacing.xxl};
    font-size: ${(props) => props.theme.mobileFont.md};
  }
`;

export const ExtraBigH1 = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  margin: 0;
  color: ${(props) => props.theme.colors.text1};
  text-align: center;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.mobileFont.xl};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.mobileFont.lg};
  }
`;

export const SmallText = styled.p`
  font-size: ${props => props.theme.mobileFont.sm};
  color: ${props => props.theme.colors.text1};
  line-height: 1.4;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
  margin: ${(props) => props.theme.spacing.lg} 0;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.mobileFont.xs};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.mobileFont.xs};
  }
`;