import React, { useEffect } from "react";
import { isEmpty } from "lodash";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ReadOutlined } from "@ant-design/icons";

import Header from "components/header";
import Login from "components/Login";
import ProductTile from "components/ProductTile";
import About from "components/about";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";
import { useScrollTop } from "utils/hooks/useScrollTop";
import { resetFetchingProducts, fetchProducts } from "actions/app";
import {
  selectBuyableProducts,
  selectLatestFreeProducts,
  selectProductsState,
} from "selectors/app";

import { App, BrowseMore } from "./styles";

function Home() {
  const { fetchingProducts, finishedFetchingProducts, fetchedAll } =
    useSelector(selectProductsState);
  const buyableProducts = useSelector(selectBuyableProducts);
  const freeProducts = useSelector(selectLatestFreeProducts);
  const dispatch = useDispatch();

  useScrollTop();

  useEffect(() => {
    if (
      (isEmpty(buyableProducts) &&
        !fetchingProducts &&
        !finishedFetchingProducts) ||
      (!fetchedAll && !fetchingProducts)
    ) {
      dispatch(fetchProducts());
    }
  }, [fetchedAll, buyableProducts, fetchingProducts, finishedFetchingProducts]);

  useEffect(() => {
    return () => {
      dispatch(resetFetchingProducts());
    };
  }, []);

  return (
    <App id="top" className="App">
      <Header>
        <Login />
      </Header>
      {!isEmpty(buyableProducts) && (
        <FeaturedSection idx={1}>
          <SectionTitle>Shop</SectionTitle>
          <FeaturedList>
            {buyableProducts.map((product) => {
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
      {!isEmpty(freeProducts) && (
        <FeaturedSection id="manga" idx={2}>
          <SectionTitle>Latest Free Manga</SectionTitle>
          <FeaturedList>
            {freeProducts.map((manga) => {
              return manga ? (
                <ProductTile key={manga.id} product={manga} />
              ) : null;
            })}
            <BrowseMore>
              <NavLink to="/shop">
                <h4>Browse More</h4>
                <ReadOutlined />
              </NavLink>
            </BrowseMore>
          </FeaturedList>
        </FeaturedSection>
      )}
      <About />
    </App>
  );
}

export default Home;
