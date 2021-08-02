import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import PaymentForm from "components/paymentForm";
import ProductTile from "components/productTile";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";

import { App } from "./styles";

function Ui(props) {
  const {
    loggedIn,
    openRegister,
    suggestRegister,
    likeManga,
    products: { fetchingProducts, finishedFetchingProducts },
    fetchProducts,
    buyableProducts,
    freeProducts,
  } = props;

  useEffect(() => {
    if (
      isEmpty(buyableProducts) &&
      !fetchingProducts &&
      !finishedFetchingProducts
    ) {
      fetchProducts();
    }
  }, [buyableProducts, fetchingProducts, finishedFetchingProducts]);

  return (
    <App id="top" className="App">
      {!isEmpty(buyableProducts) && (
        <FeaturedSection top>
          <SectionTitle id="magazines">Magazines</SectionTitle>
          <FeaturedList>
            {buyableProducts.map((product) => {
              return product ? (
                <ProductTile
                  key={`${product.id}_${product.quantity || 0}`}
                  product={product}
                  loggedIn={loggedIn}
                  likeManga={likeManga}
                  openRegister={openRegister}
                  suggestRegister={suggestRegister}
                />
              ) : null;
            })}
          </FeaturedList>
        </FeaturedSection>
      )}
      {!isEmpty(freeProducts) && (
        <FeaturedSection
          idx={!isEmpty(buyableProducts) ? 1 : 0}
          top={isEmpty(buyableProducts)}
        >
          <SectionTitle id="free-manga">Free Manga</SectionTitle>
          <FeaturedList>
            {freeProducts.map((manga) => {
              return manga ? (
                <ProductTile
                  key={manga.id}
                  product={manga}
                  loggedIn={loggedIn}
                  likeManga={likeManga}
                  openRegister={openRegister}
                  suggestRegister={suggestRegister}
                />
              ) : null;
            })}
          </FeaturedList>
        </FeaturedSection>
      )}
    </App>
  );
}

export default Ui;
