import React, { useEffect, useState } from "react";

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";

import { App } from "./styles";

function Ui(props) {
  const { cartState, fetchCartItems, updateCartItems } = props;
  const { items, fetchingCartItems, finishedFetchingCartItems } = cartState;

  useEffect(() => {
    if (!fetchingCartItems && !finishedFetchingCartItems) {
      // fetchCartItems();
    }
  }, [fetchingCartItems, finishedFetchingCartItems]);

  console.log({ items });

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Cart</SectionTitle>
      </FeaturedSection>
    </App>
  );
}

export default Ui;
