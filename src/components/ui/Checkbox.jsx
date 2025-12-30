import styled from "styled-components";

export const Checkbox = styled.input.attrs({ type: "checkbox" })`

  appearance: none;
  width: 1.2vw;
  height: 1.2vw;
  min-width: 16px;
  min-height: 16px;
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background-color: ${(props) => props.theme.colors.white};
  margin: 0;
  cursor: pointer;
  position: relative;
  padding: 0;


&:checked {
  background-color: ${(props) => props.theme.colors.active};
  border-color: ${(props) => props.theme.colors.dark};
  

&:focus {
  outline: 2px solid ${(props) => props.theme.colors.active};
  outline-offset: 1px;
}

@media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
   
    width: 1.5vw;
    height: 1.5vw;
    min-width: 18px;
    min-height: 18px;
  
}

@media (max-width: ${(props) => props.theme.breakpoints.mobile}) {

    width: 2vw;
    height: 2vw;
    min-width: 20px;
    min-height: 20px;
  
  
  &:checked::after {
    font-size: ${(props) => props.theme.mobileFont.xs};
  }
}
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.theme.spacing.md};
  align-items: anchor-center;
  margin: 0.3rem;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    gap: ${(props) => props.theme.spacing.xs};
    margin: 0.2rem;
  }
`;
