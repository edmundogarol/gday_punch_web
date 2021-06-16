import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Input,
  Tooltip,
  Typography,
  Table,
  Radio,
  Button,
  Checkbox,
  Popconfirm,
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
  ProductCreateContainer,
  SubmitButton,
} from "./styles";

const { TextArea } = Input;
const { Title } = Typography;

const productType = {
  1: "Physical",
  2: "Digital",
  3: "Subscription",
};

function Ui(props) {
  const { productsState } = props;
  const { adminProductList, editingProduct } = productsState;

  const currentProduct = adminProductList.find(
    (product) => product.id == editingProduct
  );

  console.log({ currentProduct });

  const [product, updateProduct] = useState({
    ...currentProduct,
  });

  // useEffect(() => {
  //   if (!fetchingAdminProducts && !finishedFetchingAdminProducts) {
  //     fetchProducts();
  //   }
  // }, [fetchingAdminProducts, finishedFetchingAdminProducts]);

  // const handleCreate = () => createAdminProduct(newProduct);

  return (
    <ProductsContainer>
      <Title level={4}>Edit Product</Title>
      <ProductCreateContainer>
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
      </ProductCreateContainer>
    </ProductsContainer>
  );
}

Ui.propTypes = {};

export default Ui;
