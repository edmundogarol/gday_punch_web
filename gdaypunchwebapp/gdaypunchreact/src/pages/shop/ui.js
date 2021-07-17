import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import PaymentForm from "components/paymentForm";
import MangaTile from "components/mangaTile";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";

import { App } from "./styles";

const featuredProductIds = [10, 11];

function Ui(props) {
  const {
    loggedIn,
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
      {!isEmpty(productList) && (
        <FeaturedSection top>
          <SectionTitle>Products</SectionTitle>
          <FeaturedList>
            {productList.map((product) => {
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
      )}
      {!isEmpty(featuredManga) && (
        <FeaturedSection
          idx={!isEmpty(productList) ? 1 : 0}
          top={isEmpty(productList)}
        >
          <SectionTitle>Free Manga</SectionTitle>
          <FeaturedList>
            {featuredManga.map((manga) => {
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
      )}
    </App>
  );
}

export default Ui;
