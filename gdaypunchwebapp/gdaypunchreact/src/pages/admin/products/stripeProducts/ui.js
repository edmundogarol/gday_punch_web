import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Input,
  Tooltip,
  Typography,
  Table,
  Radio,
  Button,
  message,
} from "antd";
import {
  InfoCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

import { gdayfetch } from "utils/gdayfetch";

import {
  StripeProductsContainer,
  StripeProductCreateContainer,
  SubmitButton,
} from "./styles";

const { Title } = Typography;

const stripePromise = loadStripe(
  process.env.NODE_ENV === "development"
    ? "pk_test_QgTiwo4w3EXdQS9hOywypRAF"
    : "pk_live_mTfZz6d7N3Lm44Wgqbzn24Tf"
);

const productType = {
  one_time: "Single",
  recurring: "Subscription",
};

function Ui(props) {
  const { productsState, fetchStripeProducts, createStripeProduct } = props;
  const {
    stripeProductList,
    fetchingStripeProducts,
    finishedFetchingStripeProducts,
  } = productsState;

  const [stripeProduct, updateStripeProduct] = useState({
    name: undefined,
    unit_amount: undefined,
    type: undefined,
  });

  const stripe = useStripe();
  const elements = useElements();

  const normaliseStripeProduct = () => {
    return stripeProductList.map((stripeProduct) => ({
      key: stripeProduct.price.id,
      name: stripeProduct.product.name,
      stripeId: stripeProduct.price.id,
      type: productType[stripeProduct.price.type],
      price: stripeProduct.price.unit_amount / 100,
    }));
  };

  const handleCreateStripe = async (event) => {
    if (
      !stripeProduct.name ||
      !stripeProduct.unit_amount ||
      !stripeProduct.type
    ) {
      message.warn("Missing fields in submission");
      return;
    }

    const stripe = await stripePromise;
    const response = await gdayfetch("payments/create-checkout-session/", {
      method: "POST",
      body: {
        ...stripeProduct,
        previous_url: window.location.href,
        // stripe_ids: [
        //   "price_1J0jbpGCrsnfPck1QVkM2ytH",
        //   "price_1J0jboGCrsnfPck11GrH2apB",
        // ],
        // type: "recurring",
      },
    });

    const result = await stripe.redirectToCheckout({
      sessionId: response.data.id,
    });

    if (result.error) {
      alert(result.error.message);
    }
  };

  const dataSource = stripeProductList?.length ? normaliseStripeProduct() : [];

  useEffect(() => {
    if (!fetchingStripeProducts && !finishedFetchingStripeProducts) {
      fetchStripeProducts();
    }
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Stripe Id",
      dataIndex: "stripeId",
      key: "stripeId",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => `$${value}`,
    },
    {
      title: "Edit",
      render: (value, instance) => (
        <Button onClick={() => console.log("Edit")}>Edit</Button>
      ),
    },
  ];

  return (
    <StripeProductsContainer>
      <Title level={4}>Create Stripe Product</Title>
      <StripeProductCreateContainer>
        <Input
          value={stripeProduct.name}
          onChange={(e) =>
            updateStripeProduct({ ...stripeProduct, name: e.target.value })
          }
          placeholder="Enter Product Name"
          prefix={<ShoppingOutlined className="site-form-item-icon" />}
          suffix={
            <Tooltip title="Product description">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
        <Input
          value={stripeProduct.unit_amount}
          onChange={(e) =>
            updateStripeProduct({
              ...stripeProduct,
              unit_amount: e.target.value,
            })
          }
          placeholder="Enter product price"
          prefix={<DollarOutlined className="site-form-item-icon" />}
          suffix={
            <Tooltip title="Product price in AUD$(00.00)">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
        <Radio.Group
          onChange={(e) =>
            updateStripeProduct({ ...stripeProduct, type: e.target.value })
          }
          value={stripeProduct.type}
        >
          <Radio value={"one_time"}>Single</Radio>
          <Radio value={"recurring"}>Subscription</Radio>
        </Radio.Group>
        <SubmitButton onClick={() => handleCreateStripe()}>Create</SubmitButton>
      </StripeProductCreateContainer>
      <Title level={4}>Stripe Products</Title>
      <Table dataSource={dataSource} columns={columns} />
    </StripeProductsContainer>
  );
}

Ui.propTypes = {};

export default Ui;
