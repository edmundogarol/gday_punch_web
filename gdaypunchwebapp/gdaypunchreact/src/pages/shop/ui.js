import React, { useEffect } from "react";
import { isEmpty } from "lodash";

import ProductTile from "components/ProductTile/ProductTile";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";

import { App } from "./styles";
import { useScrollTop } from "utils/hooks/useScrollTop";

function Ui(props) {
  const {
    products: { fetchingProducts, finishedFetchingProducts },
    fetchProducts,
    buyableProducts,
    freeProducts,
  } = props;

  useScrollTop();

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
                <ProductTile key={manga.id} product={manga} />
              ) : null;
            })}
          </FeaturedList>
        </FeaturedSection>
      )}
    </App>
  );
}

export default Ui;
