import styled from "styled-components";
import { device } from "utils/styles";
import { Button } from "antd";

export const App = styled.div`
  .App-header-container {
    min-height: 56vh;
  }
`;

export const CheckoutHeader = styled.div`
  display: flex;
  height: 5em;
  align-items: center;
  position: relative;

  h3 {
    font-size: 2em;
    text-transform: uppercase;
    -webkit-letter-spacing: 1pt;
    -moz-letter-spacing: 1pt;
    -ms-letter-spacing: 1pt;
    letter-spacing: 1pt;
    color: #909090;
    font-weight: bolder;
    margin-bottom: unset;
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
  width: 100%;
  overflow: scroll;
  margin-top: 1em;
  border-top: 1px solid #c5c5c5;
  min-width: 23em;
`;

export const CheckoutContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CheckoutInnerSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  border: 1px solid #bbbbbb;
  padding: 1em;
  margin-bottom: 1em;

  p {
    margin-bottom: 0.5em;
    color: dimgray;
  }

  input {
    padding: 0.6em;
    padding-left: 1.3em;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    align-items: self-end;
    min-width: 17em;

    label {
      font-weight: unset;
      color: #868686;
    }

    select {
      appearance: none;
      background: url(${(props) => props.selectImage}) 97% center no-repeat;
      background-size: 1.5em;
    }

    select,
    input {
      padding: 0.6em;
      padding-left: 1.3em;
      width: 100%;
      border: 1px solid #bfbfbf;
      margin-top: 0.5em;
      margin-bottom: 1em;
      border-radius: 0.2em;
    }
  }

  .invalid-message {
    display: none;
  }

  .empty {
    input,
    select {
      color: #de5757;
      border: 1px solid #ea7878;
    }

    label {
      color: #de5757;
    }
  }

  .invalid-format {
    .invalid-message {
      display: initial;
      color: #de5757;

      input {
        color: #de5757;
        border: 1px solid #ea7878;
      }

      label {
        color: #de5757;
      }
    }
  }

  [data-address="address-form-root"],
  [data-address="card-form-root"] {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  [data-aria-hidden="true"] {
    display: none;
  }

  [data-line-count="1"] {
    flex-basis: 100%;
  }
  [data-line-count="2"] {
    flex-basis: 49%;
  }
  [data-line-count="3"] {
    flex-basis: 32%;
  }
`;

export const CheckoutInnerSectionTitle = styled.label`
  font-weight: 600;
  color: #868686;
  width: 100%;
  text-align: start;
  justify-content: space-between;
  display: flex;

  span {
    text-decoration: underline;
    color: #7272ff;
    font-weight: 100;

    &:hover {
      cursor: pointer;
    }
  }
`;

export const LeftCheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: -webkit-fill-available;
  margin-right: 2em;
  height: min-content;

  #card-form {
    width: 100%;

    .StripeElement {
      width: 100%;
      height: 3em;
      padding: 1em;
      border: 1px solid #b5b5b5;
      border-radius: 0.3em;
      margin-bottom: 1em;
    }
  }
`;

export const OrderSummaryContainer = styled.div`
  width: 44em;
  padding-right: 2em;
`;

export const OrderSummaryFixed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  border: 1px solid #bbbbbb;
  padding: 1em;
  margin-bottom: 1em;

  label {
    color: dimgrey;
  }
`;

export const OrderSummaryLine = styled.div`
  ${(props) =>
    props.singleLine
      ? `
      display: flex;

      .ant-radio-wrapper {
        margin-right: 1em;
      }
      `
      : `
    display: grid;
    grid-template-columns: 6em 2fr 1fr;
    text-align: start;
    `}

  .summary-line-label {
    color: dimgray;
  }

  .ant-radio-checked .ant-radio-inner {
    border-color: orange;
  }
  .ant-radio-inner::after {
    background-color: orange;
  }
`;

export const SummaryLineSeparator = styled.div`
  width: 100%;
  height: 1em;
  padding-top: 1em;
  margin-top: 1em;
  border-top: 1px solid #d6d6d6;
`;

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #c5c5c5;

  p {
    margin: unset;
  }
`;

export const ItemImage = styled.div`
  background-image: url(${(props) => props.src});
  height: 5em;
  width: 5em;
  background-size: cover;
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

export const ItemTotalContainer = styled.div`
  display: flex;
  justify-content: space-between;

  p {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    margin-top: unset;
    text-align: start;
  }

  a {
    display: flex;
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
