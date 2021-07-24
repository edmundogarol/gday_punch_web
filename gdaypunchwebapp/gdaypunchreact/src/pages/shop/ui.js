import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty, orderBy } from "lodash";

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
    products,
    fetchProducts,
  } = props;

  const { productList } = products;

  useEffect(() => {
    if (isEmpty(Object.values(productList))) {
      fetchProducts();
    }
  }, [productList]);

  const productListValues = orderBy(Object.values(productList), "id", "desc");
  const freeProducts = productListValues.filter(
    (product) => product.active_price < 1
  );

  return (
    <App id="top" className="App">
      {!isEmpty(productListValues) && (
        <FeaturedSection top>
          <SectionTitle id="magazines">Magazines</SectionTitle>
          <FeaturedList>
            {productListValues.map((product) => {
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
        <FeaturedSection
          idx={!isEmpty(productListValues) ? 1 : 0}
          top={isEmpty(productListValues)}
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
