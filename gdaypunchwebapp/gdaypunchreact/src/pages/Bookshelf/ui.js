import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import PaymentForm from "components/paymentForm";
import ProductTile from "components/productTile";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";

import { App } from "./styles";

function Ui(props) {
  const {
    loggedIn,
    openRegister,
    suggestRegister,
    likeManga,
    products: { fetchingProducts, finishedFetchingProducts },
    fetchProducts,
    purchasedProducts,
    freeProducts,
  } = props;

  useEffect(() => {
    if (
      isEmpty(purchasedProducts) &&
      !fetchingProducts &&
      !finishedFetchingProducts
    ) {
      fetchProducts();
    }
  }, [purchasedProducts, fetchingProducts, finishedFetchingProducts]);

  return (
    <App id="top" className="App">
      {fetchingProducts && <LoadingSpinner />}
      {!isEmpty(purchasedProducts) && (
        <FeaturedSection top>
          <SectionTitle id="purchased-manga">Purchases</SectionTitle>
          <FeaturedList>
            {purchasedProducts.map((product) => {
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
          idx={!isEmpty(purchasedProducts) ? 1 : 0}
          top={isEmpty(purchasedProducts)}
        >
          <SectionTitle id="saved-manga">Saved Manga</SectionTitle>
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
