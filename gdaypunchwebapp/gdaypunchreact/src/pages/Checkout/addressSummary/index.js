import React from "react";
import { OrderSummaryLine, SummaryLineSeparator } from "../styles";

function Ui(props) {
  const { form } = props;
  const addressTitle = form.type === "shipping" ? "Ship To" : "Address";
  return (
    <>
      <OrderSummaryLine>
        <label className="summary-line-label">Contact</label>
        <div>{`${form.email.value}`}</div>
        <div>{`${form.phone.value}`}</div>
      </OrderSummaryLine>
      <SummaryLineSeparator />
      <OrderSummaryLine>
        <label className="summary-line-label">{addressTitle}</label>
        <div>{`${form.address1.value} ${form.address2.value}, ${form.city.value} ${form.province.value} ${form.postcode.value}, ${form.country.value}`}</div>
      </OrderSummaryLine>
    </>
  );
}

export default Ui;
