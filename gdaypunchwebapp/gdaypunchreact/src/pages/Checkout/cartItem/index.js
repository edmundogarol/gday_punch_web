import React from "react";

import { getGdayPunchStaticUrl } from "utils/utils";

import {
  ItemMeta,
  ItemContainer,
  ItemImage,
  ItemTitleMetaContainer,
  ItemSubtotalBinContainer,
  ItemSubtotal,
} from "../styles";

function Ui(props) {
  const { item, handleViewProduct } = props;
  const { id, image, title, product_type, active_price, quantity } = item;

  return (
    <ItemContainer key={id}>
      <ItemImage src={getGdayPunchStaticUrl(image)} />
      <ItemTitleMetaContainer>
        <a onClick={() => handleViewProduct(item)}>
          <h3>{title}</h3>
        </a>
        <ItemMeta>
          <p>{`A$${active_price.toFixed(2)}`}</p>
          <p className="spacer">QTY:</p>
          {quantity}
        </ItemMeta>
      </ItemTitleMetaContainer>
      <ItemSubtotalBinContainer className="desktop">
        <ItemSubtotal>
          <h4>{`A$${(quantity ? quantity * active_price : active_price).toFixed(
            2
          )}`}</h4>
          <p>Subtotal</p>
        </ItemSubtotal>
      </ItemSubtotalBinContainer>
    </ItemContainer>
  );
}

export default Ui;
