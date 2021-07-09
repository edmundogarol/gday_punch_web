import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import Header from "components/header";
import Login from "components/login";
import MangaTile from "components/mangaTile";

import {
  App,
  FeaturedMangaSection,
  FeaturedMangaList,
  SectionTitle,
} from "./styles";
import PaymentForm from "components/paymentForm";

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

  console.log({ productList });
  return (
    <App id="top" className="App">
      <div className="App-header-container app-temp-background">
        <Header loginView={loginView} />
        <Login />
      </div>
      <FeaturedMangaSection>
        <SectionTitle>Free Manga</SectionTitle>
        <FeaturedMangaList>
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
        </FeaturedMangaList>
      </FeaturedMangaSection>
    </App>
  );
}

export default Ui;
