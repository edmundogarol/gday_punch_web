import React, { useEffect } from "react";
import { isEmpty } from "lodash";
import { ShopOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

import ProductTile from "components/ProductTile";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";
import { fetchProducts, resetFetchingProducts } from "actions/app";
import {
  selectProductsState,
  selectPurchasedDigitalProducts,
  selectSavedProducts,
} from "selectors/app";
import { useScrollTop } from "utils/hooks/useScrollTop";

import { App, EmptyBookshelfMessage } from "./styles";

function Bookshelf(props) {
  const savedProducts = useSelector(selectSavedProducts);
  const purchasedProducts = useSelector(selectPurchasedDigitalProducts);
  const { fetchingProducts, finishedFetchingProducts } =
    useSelector(selectProductsState);

  const dispatch = useDispatch();

  useScrollTop();

  useEffect(() => {
    if (
      isEmpty(purchasedProducts) &&
      !fetchingProducts &&
      !finishedFetchingProducts
    ) {
      dispatch(fetchProducts());
    }
  }, [purchasedProducts, fetchingProducts, finishedFetchingProducts]);

  useEffect(() => {
    return () => {
      dispatch(resetFetchingProducts());
    };
  }, []);

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
                <ProductTile key={manga.id} product={manga} />
              ) : null;
            })}
          </FeaturedList>
        </FeaturedSection>
      )}
    </App>
  );
}

export default withRouter(Bookshelf);
