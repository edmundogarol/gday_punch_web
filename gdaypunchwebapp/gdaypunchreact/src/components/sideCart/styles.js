import styled from "styled-components";
import { device } from "utils/styles";
import { Button } from "antd";

export const SideCartBlurField = styled.div`
  display: ${(props) => (props.sideCartOpen ? "inherit" : "none")};
  width: 0%;
  height: 100%;
  position: fixed;
  z-index: 12;

  @media ${device.laptop} {
    width: 60%;
  }
`;

export const SideCartContainer = styled.div`
  position: fixed;
  right: 0;
  height: 100%;
  width: 100%;
  background: white;
  z-index: 11;
  box-shadow: 7px 0px 12px 6px #888888;

  @media ${device.laptop} {
    width: 40%;
  }
`;

export const SideCartHeader = styled.div`
  display: flex;
  height: 5em;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #f5bb52;

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
    background: white;
    border-radius: 30pt;
    margin-left: 0.4em;
    color: #d29e41;
  }

  a {
    position: absolute;
    right: 0;
    margin-right: 1em;
    color: white;
    text-decoration: underline;
    font-size: 1.1em;
  }
`;

export const SideCartItemsList = styled.div`
  height: calc(100% - 20em);
  overflow: scroll;
  margin-top: 1em;
  border-top: 1px solid #c5c5c5;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
`;

export const CloseSideCart = styled.button`
  position: absolute;
  left: 0;
  background: transparent;
  border: none;

  &:hover {
    cursor: pointer;
  }

  svg {
    color: white;
    transform: rotate(90deg);
    width: 3em;
    height: 1.7em;
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
  height: auto;
  max-width: 6em;
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
`;

export const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 48%;

  p {
    margin: unset;
    flex-wrap: wrap;
    display: flex;
  }

  .interval {
    font-size: 0.8em;
    color: dimgrey;
    white-space: nowrap;
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

export const ItemCoupon = styled.div`
  display: flex;
  justify-content: space-between;
  /* border-top: 1px solid #b5b5b5; */
  padding-top: 1em;
  width: 95%;
  margin-left: auto;
  margin-right: auto;

  input {
    width: 50%;
    margin-left: 1em;
    height: 3em;
    border: 1px solid #888888;
  }

  button {
    height: 3em;
    margin-right: 1em;
    background: #d2d2d2;
    color: #464646;
  }
`;

export const ItemTotalContainer = styled.div`
  border-top: 1px solid #b5b5b5;
  display: flex;
  justify-content: space-between;

  p {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    margin-top: unset;
  }

  a {
    display: flex;
    margin-left: 2em;
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
  margin-right: 2.4em;
  margin-top: unset;
  font-size: 0.84em;
  flex-direction: column;
`;

export const ItemTotal = styled.div`
  display: flex;
  margin-left: 2em;
  margin-top: 1em;
  justify-content: flex-end;
  margin-right: 2em;

  p {
    margin-bottom: unset;
    display: flex;
    align-items: flex-end;
  }

  h3 {
    margin: unset;
    margin-left: 1em;
  }
`;

export const SideCartCheckoutButton = styled(Button)`
  margin-left: 2em;
  margin-right: 2em;
  width: -webkit-fill-available;
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

export const SideCartFooterContainer = styled.div``;
