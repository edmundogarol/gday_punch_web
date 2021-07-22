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

const featuredProductIds = [10, 11];

function Ui(props) {
  const {
    loggedIn,
    loginView,
    openRegister,
    suggestRegister,
    featuredManga,
    likeManga,
    getFeaturedManga,
    products,
    fetchProducts,
  } = props;

  const { productList, fetchingProducts, finishedFetchingProducts } = products;
  const productValues = orderBy(Object.values(productList), "id", "desc");

  useEffect(() => {
    if (isEmpty(featuredManga) || !featuredManga[0]) {
      getFeaturedManga();
    }
  }, [featuredManga]);

  useEffect(() => {
    if (
      isEmpty(productValues) &&
      !fetchingProducts &&
      !finishedFetchingProducts
    ) {
      fetchProducts(featuredProductIds);
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
      {!isEmpty(featuredManga) && (
        <FeaturedSection idx={1}>
          <SectionTitle>Free Manga</SectionTitle>
          <FeaturedList>
            {featuredManga.map((manga) => {
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
