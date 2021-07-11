import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import Header from "components/header";
import Login from "components/login";
import MangaTile from "components/mangaTile";
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
    fetchAdminProducts,
  } = props;

  const { productList } = products;

  useEffect(() => {
    if (isEmpty(featuredManga) || !featuredManga[0]) {
      getFeaturedManga();
    }
  }, [featuredManga]);

  useEffect(() => {
    if (isEmpty(productList)) {
      fetchAdminProducts(featuredProductIds);
    }
  }, [productList]);

  return (
    <App id="top" className="App">
      <div className="App-header-container app-temp-background">
        <Header loginView={loginView} />
        <Login />
      </div>
      <FeaturedSection>
        <SectionTitle>Products</SectionTitle>
        <FeaturedList>
          {!isEmpty(productList) &&
            productList.map((product) => {
              return product ? (
                <MangaTile
                  key={product.id}
                  manga={product}
                  loggedIn={loggedIn}
                  likeManga={() => {}}
                  openRegister={openRegister}
                  suggestRegister={suggestRegister}
                />
              ) : null;
            })}
        </FeaturedList>
      </FeaturedSection>
      <FeaturedSection idx={1}>
        <SectionTitle>Free Manga</SectionTitle>
        <FeaturedList>
          {!isEmpty(featuredManga) &&
            featuredManga.map((manga) => {
              return manga ? (
                <MangaTile
                  key={manga.id}
                  manga={manga}
                  loggedIn={loggedIn}
                  likeManga={likeManga}
                  openRegister={openRegister}
                  suggestRegister={suggestRegister}
                />
              ) : null;
            })}
        </FeaturedList>
      </FeaturedSection>
      <About />
    </App>
  );
}

export default Ui;
