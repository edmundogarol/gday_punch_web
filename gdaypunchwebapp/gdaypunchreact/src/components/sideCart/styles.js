import styled from "styled-components";
import { device } from "utils/styles";
import { Button } from "antd";

export const SideCartBlurField = styled.div`
  display: ${(props) => (props.sideCartOpen ? "inherit" : "none")};
  width: 65%;
  height: 100%;
  position: fixed;
  z-index: 12;
`;

export const SideCartContainer = styled.div`
  position: fixed;
  right: 0;
  height: 100%;
  width: 35%;
  background: white;
  z-index: 11;
  box-shadow: 7px 0px 12px 6px #888888;
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
`;

export const SideCartItemsList = styled.div`
  height: 60%;
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
  margin: 1em;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #c5c5c5;
  padding-bottom: 1em;

  p {
    margin: unset;
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

export const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

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
  }

  button {
    height: 3em;
    margin-right: 1em;
    background: #d2d2d2;
    color: #464646;
  }
`;

export const ItemTotalContainer = styled.div`
  p {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    margin-right: 2.4em;
    margin-top: unset;
    font-size: 0.84em;
  }
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
  background: #909090;

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
