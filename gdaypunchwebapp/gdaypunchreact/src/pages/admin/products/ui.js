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
  const {
    productsState,
    fetchProducts,
    createAdminProduct,
    deleteAdminProduct,
  } = props;
  const {
    adminProductList,
    fetchingAdminProducts,
    finishedFetchingAdminProducts,
  } = productsState;

  const [newProduct, updateNewProduct] = useState({
    title: undefined,
    description: undefined,
    image: undefined,
    sale_price: undefined,
    visible: false,
    stock: undefined,
    product_type: 1,
  });

  useEffect(() => {
    if (!fetchingAdminProducts && !finishedFetchingAdminProducts) {
      fetchProducts();
    }
  }, [fetchingAdminProducts, finishedFetchingAdminProducts]);

  const handleCreate = () => createAdminProduct(newProduct);

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (value) => (value ? value : "-"),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Visible",
      dataIndex: "visible",
      key: "visible",
      render: (value) => (value ? "Visible" : "Hidden"),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Type",
      dataIndex: "product_type",
      key: "product_type",
      render: (value) => productType[value],
    },
    {
      title: "Edit",
      render: (value, instance) => (
        <>
          <Button onClick={() => console.log("Edit", instance)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this Product?"
            onConfirm={() => deleteAdminProduct(instance.id)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button>
              <Tooltip title="Delete Product">
                <DeleteOutlined className="site-form-item-icon" />
              </Tooltip>
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const dataSource = adminProductList.map((product) => ({
    key: product.title,
    ...product,
  }));

  return (
    <ProductsContainer>
      <Title level={4}>Create Product</Title>
      <ProductCreateContainer>
        <Input
          value={newProduct.title}
          onChange={(e) =>
            updateNewProduct({ ...newProduct, title: e.target.value })
          }
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
          value={newProduct.description}
          onChange={(e) =>
            updateNewProduct({ ...newProduct, description: e.target.value })
          }
          placeholder="Enter Product Description"
        />
        <Input
          value={newProduct.sale_price}
          onChange={(e) =>
            updateNewProduct({ ...newProduct, sale_price: e.target.value })
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
          value={newProduct.stock}
          onChange={(e) =>
            updateNewProduct({ ...newProduct, stock: e.target.value })
          }
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
            updateNewProduct({ ...newProduct, product_type: e.target.value })
          }
          value={newProduct.product_type}
        >
          <Radio value={1}>Physical</Radio>
          <Radio value={2}>Digital</Radio>
          <Radio value={3}>Subscription</Radio>
        </Radio.Group>
        <Checkbox
          onChange={(e) =>
            updateNewProduct({ ...newProduct, visible: e.target.checked })
          }
        >
          Visible
        </Checkbox>
        <SubmitButton onClick={() => handleCreate()}>Create</SubmitButton>
      </ProductCreateContainer>
      <Title level={4}>
        {`Products | `}
        <NavLink to="/admin/stripe-products">Products</NavLink>
      </Title>
      <Table dataSource={dataSource} columns={columns} />
    </ProductsContainer>
  );
}

Ui.propTypes = {};

export default Ui;
