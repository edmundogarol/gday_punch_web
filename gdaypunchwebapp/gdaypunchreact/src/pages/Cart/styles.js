import styled from "styled-components";
import { device } from "utils/styles";
import { Button } from "antd";

export const App = styled.div`
  .App-header-container {
    min-height: 56vh;
  }
`;

export const SideCartHeader = styled.div`
  display: flex;
  height: 5em;
  align-items: center;
  justify-content: center;
  position: relative;

  h4 {
    color: white;
    font-size: 1.6em;
    text-transform: uppercase;
    margin-top: auto;
    margin-bottom: auto;

    span {
      margin-left: 0.5em;
    }
  }

  p {
    font-size: 1.5em;
    margin-top: auto;
    margin-bottom: auto;
    width: 1.6em;
    text-align: center;
    background: orange;
    border-radius: 30pt;
    margin-left: 0.4em;
    color: white;
  }
`;

export const SideCartItemsList = styled.div`
  height: 50%;
  overflow: scroll;
  margin-top: 1em;
  border-top: 1px solid #c5c5c5;
  width: 95%;
  margin-left: auto;
  margin-right: auto;

  @media ${device.laptop} {
    height: 60%;
  }
`;

export const ItemContainer = styled.div`
  display: flex;
  margin-top: 1em;
  margin-bottom: 1em;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #c5c5c5;
  padding-bottom: 1em;

  p {
    margin: unset;
  }

  @media ${device.laptop} {
    margin: 1em;
  }
`;

export const ItemImage = styled.img`
  height: 9em;
`;

export const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ItemTitleMetaContainer = styled.div`
  width: 50%;
  padding: 1em;

  .spacer {
    margin-right: 1em;
    margin-left: 1em;
  }

  a {
    display: flex;
  }
`;

export const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 48%;

  p {
    margin: unset;
  }
`;

export const ItemSubtotal = styled.div`
  h4 {
    margin-bottom: unset;
  }
  p {
    font-size: 0.7em;
    display: flex;
    justify-content: center;
  }
`;

export const ItemSubtotalBinContainer = styled.div`
  display: flex;
  width: 30%;
  height: 80pt;
  justify-content: space-evenly;
  align-items: center;

  @media ${device.laptop} {
    width: 40%;
  }

  button {
    margin-left: 1em;
  }
`;

export const CartFooter = styled.div`
  margin-bottom: 1em;
`;

export const ItemCoupon = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #b5b5b5;
  padding-top: 1em;
  width: 95%;
  margin-left: auto;
  margin-right: auto;

  input {
    width: 50%;
    margin-left: 1em;
    height: 3em;
    border: 1px solid #888888;

    @media ${device.laptop} {
      width: 25%;
    }
  }

  button {
    height: 3em;
    margin-right: 1em;
    background: #d2d2d2;
    color: #464646;
  }
`;

export const ItemTotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 2em;
  margin-left: 2em;

  p {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    margin-top: unset;
  }

  a {
    display: flex;
    margin-left: 1em;
    color: #b77600;
    text-decoration: underline;
  }
`;

export const TotalLabel = styled.p`
  font-size: 1.3em;
  margin-right: 2.2em;
  font-weight: 600;
`;

export const GSTLabel = styled.p`
  margin-right: 1em;
  margin-top: unset;
  font-size: 0.84em;
`;

export const ItemTotal = styled.div`
  display: flex;
  margin-left: 2em;
  margin-top: 1em;
  justify-content: flex-end;
  margin-right: 1em;

  p {
    margin-bottom: unset;
    display: flex;
    align-items: flex-end;
    margin-right: 1em;
  }

  h3 {
    margin: unset;
    margin-left: 1em;
  }
`;

export const SideCartCheckoutButton = styled(Button)`
  margin-left: 2em;
  margin-right: 2em;
  width: 20em;
  height: 4em;
  background: #444444;

  &:hover {
    background: transparent;
    border: 2px solid orange;

    span {
      color: orange;
    }
  }

  span {
    font-size: 1.4em;
    text-transform: uppercase;
    letter-spacing: 1pt;
    color: white;
  }
`;

export const EmptyCartMessage = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50%;

  div {
    display: flex;
    align-content: center;
    justify-content: center;
  }

  h4 {
    color: dimgray;
  }

  h2 {
    margin-bottom: unset;
    color: #efa114;
    text-decoration: underline;
    cursor: pointer;
  }

  svg {
    height: 2em;
    width: 2em;
    margin-left: 1em;
    color: #efa114;
  }
`;

export const CheckoutButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
