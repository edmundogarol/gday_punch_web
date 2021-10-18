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
import { useScrollTop } from "utils/hooks/useScrollTop";
import { getGdayPunchResourceUrl } from "utils/utils";

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

  useScrollTop();

  // useEffect(() => {
  //   document.head.querySelector('meta[name="og:title"]').content =
  //     "Gday Punch Manga Magazine Web App";
  //   document.head.querySelector('meta[name="og:description"]').content =
  //     "Your #1 Manga Magazine in Australia, for and by Australian Artists - Welcome to our brand new Web Store and App!";
  //   document.head.querySelector('meta[name="og:image"]').content =
  //     getGdayPunchResourceUrl("gdaypunch-hero-preview.png");
  // }, []);

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
        <FeaturedSection idx={1}>
          <SectionTitle>Shop</SectionTitle>
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
        <FeaturedSection id="manga" idx={2}>
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
