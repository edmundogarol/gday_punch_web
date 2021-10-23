import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";

import Header from "components/header";
import ProductTile from "components/productTile";
import FeaturedSection from "components/featuredSection";
import { FeaturedList } from "components/featuredList";
import { SectionTitle } from "components/sectionTitle";
import { useScrollTop } from "utils/hooks/useScrollTop";
import { selectBuyableProducts, selectProductsState } from "selectors/app";
import { fetchProducts } from "actions/app";

import { MyStallContainer } from "./styles";
import { doLikeManga } from "actions/manga";
import { doSuggestRegister, openRegistration } from "actions/user";
import { getGdayPunchResourceUrl } from "utils/utils";

function MyStall() {
  const buyableProducts = useSelector(selectBuyableProducts);
  const productsState = useSelector(selectProductsState);
  const { fetchingProducts, finishedFetchingProducts } = productsState;
  const dispatch = useDispatch();

  useScrollTop();

  useEffect(() => {
    if (
      isEmpty(buyableProducts) &&
      !fetchingProducts &&
      !finishedFetchingProducts
    ) {
      dispatch(fetchProducts());
    }
  }, [buyableProducts, fetchingProducts, finishedFetchingProducts]);

  return (
    <MyStallContainer className="App">
      <Header background={getGdayPunchResourceUrl("issue-4-hero.png")} />
      {!isEmpty(buyableProducts) && (
        <FeaturedSection idx={1}>
          <SectionTitle>Shop</SectionTitle>
          <FeaturedList>
            {buyableProducts.map((product) => {
              return product ? (
                <ProductTile
                  key={`${product.id}_${product.quantity || 0}`}
                  product={product}
                  likeManga={() => dispatch(doLikeManga())}
                  openRegister={() => dispatch(openRegistration())}
                  suggestRegister={() => dispatch(doSuggestRegister())}
                />
              ) : null;
            })}
          </FeaturedList>
        </FeaturedSection>
      )}
    </MyStallContainer>
  );
}

export default MyStall;
