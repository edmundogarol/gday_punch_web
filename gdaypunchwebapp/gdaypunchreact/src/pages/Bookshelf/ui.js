import React, { useEffect } from "react";
import { isEmpty } from "lodash";
import { ShopOutlined } from "@ant-design/icons";

import ProductTile from "components/productTile";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";

import { App, EmptyBookshelfMessage } from "./styles";
import { useScrollTop } from "utils/hooks/useScrollTop";

function Ui(props) {
  const {
    loggedIn,
    openRegister,
    suggestRegister,
    likeManga,
    products: { fetchingProducts, finishedFetchingProducts },
    fetchProducts,
    purchasedProducts,
    savedProducts,
  } = props;

  useScrollTop();

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
      {isEmpty(purchasedProducts) && isEmpty(savedProducts) ? (
        <EmptyBookshelfMessage>
          <h4>No Purchases or Favourites</h4>
          <div>
            <h2 onClick={() => props.history.push("/shop")}>
              Shop / Browse now!
            </h2>
            <ShopOutlined className="site-form-item-icon" />
          </div>
        </EmptyBookshelfMessage>
      ) : null}
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
      {!isEmpty(savedProducts) && (
        <FeaturedSection
          idx={!isEmpty(purchasedProducts) ? 1 : 0}
          top={isEmpty(purchasedProducts)}
        >
          <SectionTitle id="saved-manga">Favourite Manga</SectionTitle>
          <FeaturedList>
            {savedProducts.map((manga) => {
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
