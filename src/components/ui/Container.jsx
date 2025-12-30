// src/components/ui/Container.js
import styled from "styled-components";

export const Container = styled.main`
  max-width: 90%;
  margin: ${(props) => props.theme.spacing.xl};
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.bg || props.theme.colors.white};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  box-shadow: ${(props) => props.theme.shadows.md};
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.colors.border};

  @media (max-width: ${(props) => props.theme.breakpoints.desktop}) {
    max-width: 95%;
    padding: ${(props) => props.theme.spacing.xl};
    margin: ${(props) => props.theme.spacing.xl} auto;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    max-width: 95%;
    padding: ${(props) => props.theme.spacing.lg};
    margin: ${(props) => props.theme.spacing.lg} auto;
    border-radius: ${(props) => props.theme.borderRadius.lg};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    max-width: 90%;
    padding: ${(props) => props.theme.spacing.xxl};
    margin: ${(props) => props.theme.spacing.xxl} auto;
    border-radius: ${(props) => props.theme.borderRadius.md};
    box-shadow: ${(props) => props.theme.shadows.sm};
    border: none;
  }
`;

export const HorizontalContainer12to80 = styled.div`
  display: grid;
  grid-template-columns: 12% 80%;
  align-items: anchor-center;
  gap: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: 20% 75%;
    gap: ${(props) => props.theme.spacing.md};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${(props) => props.theme.spacing.sm};
    margin-bottom: ${(props) => props.theme.spacing.sm};
  }
`;

export const HorizontalContainer = styled.div`
  display: grid;
  grid-template-columns: 45% 45%;
  gap: ${(props) => props.theme.spacing.xl};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  padding: 0 ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${(props) => props.theme.spacing.lg};
    padding-left: 8%;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    gap: ${(props) => props.theme.spacing.md};
    padding-left: 0;
  }
`;
