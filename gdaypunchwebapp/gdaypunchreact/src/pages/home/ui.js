import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty, orderBy } from "lodash";

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
    products,
    fetchProducts,
  } = props;

  const { productList, fetchingProducts, finishedFetchingProducts } = products;
  const productValues = orderBy(Object.values(productList), "id", "desc");
  const freeProducts = productValues.filter(
    (product) => product.active_price < 1
  );

  useEffect(() => {
    if (
      isEmpty(productValues) &&
      !fetchingProducts &&
      !finishedFetchingProducts
    ) {
      fetchProducts();
    }
  }, [productList, fetchingProducts, finishedFetchingProducts]);

  return (
    <App id="top" className="App">
      <div className="App-header-container app-temp-background">
        <Header loginView={loginView} />
        <Login />
      </div>
      {!isEmpty(productValues) && (
        <FeaturedSection>
          <SectionTitle>Products</SectionTitle>
          <FeaturedList>
            {productValues.map((product) => {
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
