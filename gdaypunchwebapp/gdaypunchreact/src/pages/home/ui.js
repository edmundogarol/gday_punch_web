import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import Header from "components/header";
import Login from "components/login";
import ProductTile from "components/productTile";
import PaymentForm from "components/paymentForm";
import About from "components/about";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";

import { App } from "./styles";

function Ui(props) {
  const {
    loggedIn,
    loginView,
    openRegister,
    suggestRegister,
    likeManga,
    products: { fetchingProducts, finishedFetchingProducts },
    buyableProducts,
    freeProducts,
    fetchProducts,
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
      <div className="App-header-container app-temp-background">
        <Header loginView={loginView} />
        <Login />
      </div>
      {!isEmpty(buyableProducts) && (
        <FeaturedSection>
          <SectionTitle>Products</SectionTitle>
          <FeaturedList>
            {buyableProducts.map((product) => {
              return product ? (
                <ProductTile
                  key={product.id}
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
        <FeaturedSection idx={1}>
          <SectionTitle>Free Manga</SectionTitle>
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
      <About />
    </App>
  );
}

export default Ui;
