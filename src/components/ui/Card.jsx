// src/components/ui/Card.js
import styled from "styled-components";
import { Link } from "react-router-dom";

export const CardsHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    & > * {
      flex: 0 0 100%;
      max-width: 100%;
      margin-bottom: ${({ theme }) => theme.spacing.xl};
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) and (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    & > * {
      flex: 0 0 calc(50% - ${({ theme }) => theme.spacing.md});
      max-width: calc(50% - ${({ theme }) => theme.spacing.md});
      margin-bottom: ${({ theme }) => theme.spacing.lg};
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    & > * {
      flex: 0 0 calc(33.333% - ${({ theme }) => theme.spacing.md});
      max-width: calc(33.333% - ${({ theme }) => theme.spacing.md});
      margin-bottom: ${({ theme }) => theme.spacing.lg};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.sm};
    
    & > * {
      margin-bottom: ${({ theme }) => theme.spacing.lg};
    }
  }
`;

export const Card = styled(Link)`
  width: min-content;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-sizing: border-box;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid ${(props) => props.theme.colors.border};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(props) => props.theme.shadows.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
    width: 100%;
    max-width: 100%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    margin-bottom: ${({ theme }) => theme.spacing.xxl};;
  }
`;

export const CoverImage = styled.img`
  width: 25vw;
  height: auto;
  border-radius: ${(props) => props.theme.borderRadius.md};
  transition: transform 0.3s ease;
  object-fit: cover;

  ${Card}:hover & {
    transform: scale(1.03);
    
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 45vw;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 50vw;
    max-width: 100%;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 20vw;
    max-width: 250px;
  }
`;

export const CardTitle = styled.p`
  font-weight: 500;
  color: ${(props) => props.theme.colors.text1};
  font-size: ${(props) => props.theme.deskFont.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: 0 ${({ theme }) => theme.spacing.xl};
  line-height: 1.3;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.mobileFont.xl};
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.mobileFont.md};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xxl};
    margin-top: ${({ theme }) => theme.spacing.lg};
  }


`;

export const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.xs} 0;
  width: 100%;
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin: ${({ theme }) => theme.spacing.xs} 0;
  }
`;