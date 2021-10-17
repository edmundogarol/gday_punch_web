import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";

import ProductTile from "components/productTile";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";

import { App } from "./styles";
import { useScrollTop } from "utils/hooks/useScrollTop";
import { getGdayPunchResourceUrl } from "utils/utils";

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

  useScrollTop();

  useEffect(() => {
    document.head.querySelector('meta[name="og:title"]').content =
      "Shop | Gday Punch Manga Magazine";
    document.head.querySelector('meta[name="og:description"]').content =
      "Buy instant, unlimited access to our awesome line up of Aussie made manga!";
    document.head.querySelector('meta[name="og:image"]').content =
      getGdayPunchResourceUrl("shop-preview.png");
  }, []);

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
      {fetchingProducts && <LoadingSpinner />}
      {!isEmpty(buyableProducts) && (
        <FeaturedSection top idx={1}>
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
          idx={!isEmpty(buyableProducts) ? 2 : 1}
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
