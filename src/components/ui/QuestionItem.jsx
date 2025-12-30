// src/components/ui/QuestionItem.js — для списку питань
import styled from "styled-components";

export const QuestionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const QuestionItem = styled.li`
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin-bottom: ${(props) => props.theme.spacing.xxl};
  }
`;

export const QuestionText = styled.p`
  margin: ${(props) => props.theme.spacing.md} 0;
  font-size: ${(props) => props.theme.deskFont.md};
  color: ${(props) => props.color || props.theme.colors.text2};
  line-height: 1.6;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.mobileFont.md};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.mobileFont.sm};
  }
`;
