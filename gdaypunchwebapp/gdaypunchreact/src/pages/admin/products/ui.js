import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { Input, Tooltip, Typography, Table, Radio, Button } from "antd";
import {
  InfoCircleOutlined,
  UserOutlined,
  BulbOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import { ProductsContainer } from "./styles";

const { Title } = Typography;

function Ui(props) {
  const {} = props;
  const dataSource = [];
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
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
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Edit",
      render: (value, instance) => (
        <Button onClick={() => console.log("Edit")}>Edit</Button>
      ),
    },
  ];

  // useEffect(() => {
  //   if (!fetchingPromptsSucess && !fetchingPrompts) fetchPrompts();
  // }, [fetchingPromptsSucess]);

  return (
    <ProductsContainer>
      <Title level={4}>
        {`Products | `}
        <NavLink to="/admin/stripe-products">Stripe Products</NavLink>
      </Title>
      <Table dataSource={dataSource} columns={columns} />
    </ProductsContainer>
  );
}

Ui.propTypes = {
  // tweetSuccess: PropTypes.bool,
  // embeddedTweet: PropTypes.object,
  // tweetError: PropTypes.string,
  // tweet: PropTypes.func,
};

export default Ui;
