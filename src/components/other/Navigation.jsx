// components/ASRSNavigation.jsx
import React from "react";
import styled from "styled-components";
import { IconLink } from "../ui/IconLink";

const NavRow = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  margin-top: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-top: ${props => props.theme.spacing.xl};
    gap: ${props => props.theme.spacing.xs};
  }
`;

const Navigation = ({ isBottom }) => {
  return (
    <NavRow id={isBottom ? "bottom" : "top"}>
      {isBottom ? (
        <>
          <IconLink href="/" title="На головну">
            <img src="/icons/home-09-stroke-rounded.svg" alt="Додому" />
          </IconLink>
          <IconLink href="#top" title="Перейти вгору">
            <img
              src="/icons/square-arrow-up-double-stroke-rounded.svg"
              alt="Вгору"
            />
          </IconLink>
        </>
      ) : (
        <>
          <IconLink href="/" title="На головну">
            <img src="/icons/home-09-stroke-rounded.svg" alt="Додому" />
          </IconLink>
          <IconLink href="#bottom" title="Перейти вниз">
            <img 
              src="/icons/square-arrow-down-double-stroke-rounded.svg"
              alt="Вниз"
            />
          </IconLink>
        </>
      )}
    </NavRow>
  );
};

export default Navigation;
