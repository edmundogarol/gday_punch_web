import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Input,
  Tooltip,
  Typography,
  Radio,
  Checkbox,
  Transfer,
} from "antd";
import {
  InfoCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
  StockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  ProductsContainer,
  ProductDetailContainer,
  SubmitButton,
  ProductDetailLeftContainer,
  ProductDetailRightContainer,
} from "./styles";

const { TextArea } = Input;
const { Title } = Typography;

function Ui(props) {
  const { productsState, fetchStripePrices, currentProduct, updateAdminProduct, history } = props;
  const { stripePrices,
    stripePriceIds,
    fetchingStripePrices,
    finishedFetchingStripePrices,
  } = productsState;
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [productPrices, updateProductPrices] = useState(currentProduct ? currentProduct.stripe_prices : []);
  const [transferStripePrices, updateTransferStripePrices] = useState([]);

  const [product, updateProduct] = useState({
    ...currentProduct,
  });

  useEffect(() => {
    let currentProductPrice = 0;
    productPrices.map((price) => {
      currentProductPrice += stripePrices.find(
        (e) => e.id === price
      ).price_amount;
    });
    updateProduct({
      ...product,
      price: currentProductPrice,
      stripe_prices: productPrices,
    });
  }, [productPrices]);

  useEffect(() => {
    if (!fetchingStripePrices && !finishedFetchingStripePrices) {
      fetchStripePrices();
    }
  }, [fetchingStripePrices, finishedFetchingStripePrices]);

  useEffect(() => {
    const currentProductPriceIds = currentProduct.stripe_prices;

    updateTransferStripePrices(stripePriceIds.filter(id => !currentProductPriceIds.includes(id)));
  }, [stripePriceIds]);

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    if (direction === "left") {
      updateProductPrices([...productPrices, ...moveKeys]);
    } else {
      const newPrices = productPrices.filter((elem) => {
        return moveKeys.indexOf(elem) < 0;
      });
      updateProductPrices(newPrices);
    }
    updateTransferStripePrices(nextTargetKeys);
  };

  const handleUpdate = () => updateAdminProduct(product, history);

  const stripePricesForTransfer = stripePrices.map((price) => ({
    key: price.id,
    title: `$${price.price_amount} ${price.price_title}`,
  }));

  return (
    <ProductsContainer>
      <Title level={4}>Edit Product</Title>
      <ProductDetailContainer>
        <ProductDetailLeftContainer>
          <Input
            value={product.title}
            onChange={(e) => updateProduct({ ...product, title: e.target.value })}
            placeholder="Enter Product Title"
            prefix={<ShoppingOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Product Title">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
          <TextArea
            rows={4}
            value={product.description}
            onChange={(e) =>
              updateProduct({ ...product, description: e.target.value })
            }
            placeholder="Enter Product Description"
          />
          <Input
            value={product.sale_price}
            onChange={(e) =>
              updateProduct({ ...product, sale_price: e.target.value })
            }
            placeholder="Enter product sale price"
            prefix={<DollarOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Product sale price in AUD$(00.00)">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
          <Input
            value={product.stock}
            onChange={(e) => updateProduct({ ...product, stock: e.target.value })}
            placeholder="Enter product stock"
            prefix={<StockOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="Product stock">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
          <Radio.Group
            onChange={(e) =>
              updateProduct({ ...product, product_type: e.target.value })
            }
            value={product.product_type}
          >
            <Radio value={1}>Physical</Radio>
            <Radio value={2}>Digital</Radio>
            <Radio value={3}>Subscription</Radio>
          </Radio.Group>
          <Checkbox
            checked={product.visible}
            onChange={(e) =>
              updateProduct({ ...product, visible: e.target.checked })
            }
          >
            Visible
          </Checkbox>
          <SubmitButton onClick={() => handleUpdate()}>Update</SubmitButton>
          </ProductDetailLeftContainer>
        <ProductDetailRightContainer>
          <Transfer
            dataSource={stripePricesForTransfer}
            titles={["Product Prices", "Stripe Prices"]}
            targetKeys={transferStripePrices}
            selectedKeys={selectedKeys}
            onChange={onChange}
            onSelectChange={onSelectChange}
            render={(item) => item.title}
            listStyle={{ direction: "left", width: "200px" }}
            showSelectAll={false}
          />
          <Title level={4}>{`Price: $${product.price}`}</Title>
        </ProductDetailRightContainer>
      </ProductDetailContainer>
    </ProductsContainer>
  );
}

Ui.propTypes = {};

export default Ui;
