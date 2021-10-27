import React, { useEffect } from "react";
import { isEmpty } from "lodash";
import { NavLink } from "react-router-dom";

import { ReadOutlined } from "@ant-design/icons";

import Header from "components/header";
import Login from "components/login";
import ProductTile from "components/ProductTile/ProductTile";
import About from "components/about";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";

import { App, BrowseMore } from "./styles";
import { useScrollTop } from "utils/hooks/useScrollTop";

function Ui(props) {
  const {
    products: { fetchingProducts, finishedFetchingProducts, fetchedAll },
    buyableProducts,
    freeProducts,
    fetchProducts,
  } = props;

  useScrollTop();

  useEffect(() => {
    if (
      (isEmpty(buyableProducts) &&
        !fetchingProducts &&
        !finishedFetchingProducts) ||
      (!fetchedAll && !fetchingProducts)
    ) {
      fetchProducts();
    }
  }, [fetchedAll, buyableProducts, fetchingProducts, finishedFetchingProducts]);

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

export default Ui;
