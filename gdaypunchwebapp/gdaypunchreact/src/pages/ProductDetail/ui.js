import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Image } from "antd";
import {} from "@ant-design/icons";
const { Title } = Typography;

import {
  PageContainer,
  ProductContainer,
  ProductDetailContainer,
  ProductDetailLeftContainer,
  ProductDetailRightContainer,
} from "./styles";

import { getGdayPunchStaticUrl } from "utils/utils";

function Ui(props) {
  const {
    viewingProductState,
    productList,
    fetchViewingProduct,
    setViewingProduct,
  } = props;
  const { product, fetchingViewingProduct, finishedFetchingViewingProduct } =
    viewingProductState;
  const { productId } = useParams();

  useEffect(() => {
    if (!fetchingViewingProduct && !finishedFetchingViewingProduct) {
      if (productId && !product.id) fetchViewingProduct(productId);
    }
  }, [fetchingViewingProduct, finishedFetchingViewingProduct]);

  useEffect(() => {
    if (
      product &&
      product.id &&
      productList.length &&
      productId &&
      productId !== product.id
    )
      setViewingProduct(
        productList.find((product) => product.id === parseInt(productId))
      );
  }, [product]);

  return (
    <PageContainer>
      {product && product.id && (
        <ProductContainer>
          <ProductDetailContainer>
            <ProductDetailLeftContainer>
              <Image src={getGdayPunchStaticUrl(product.image)} />
            </ProductDetailLeftContainer>
            <ProductDetailRightContainer>
              <Title level={4}>{product.title}</Title>
              <h4>$A{product.price.toFixed(2)}</h4>
              <h4>{product.sku}</h4>
              <p>{product.description}</p>
            </ProductDetailRightContainer>
          </ProductDetailContainer>
        </ProductContainer>
      )}
    </PageContainer>
  );
}

export default Ui;
