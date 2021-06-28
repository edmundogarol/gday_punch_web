import styled from "styled-components";

export const RegistrationContainerHidden = styled.div`
  width: 20em;
  font-size: 1em;
  margin-top: 4em;
  text-transform: uppercase;
  letter-spacing: 1pt;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  min-height: 9em;
  animation: 0.5s ease-in 0s 1 slideOutToRight;
  display: none;
`;

export const RegistrationContainerVisible = styled(RegistrationContainerHidden)`
  display: flex;
  visibility: visible;
  animation: 0.5s ease-in 0s 1 slideInFromRight;
  transform: translateX(0%);
`;

export const RegistrationInputsContainer = styled.div`
  min-width: 18em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 5em;
`;

export const InputGroupContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  label {
    font-size: 0.7em;
    color: white;
  }

  input {
    width: 14em;
    height: 2.7em;
    border-radius: 5px;
    font-size: 0.8em;
    color: black;
    padding-left: 10px;
    border: none;
  }
`;

export const AccountActionButtons = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;

  span {
    width: 1px;
    border: 1px solid white;
    background: #ffffff;
  }
`;

export const SignUpButton = styled.button`
  width: 10em;
  min-height: 2em;
  border-radius: 5px;
  font-size: 0.7em;
  padding: 0.7em;
  text-transform: uppercase;
  color: #ffffff;
  letter-spacing: 2pt;
  background: #e0811f;
  border: none;
`;
