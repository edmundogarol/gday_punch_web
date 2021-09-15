import React, { useEffect, useState } from "react";
import { Typography, Table } from "antd";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
} from "@ant-design/icons";
import moment from "moment";

import { OrdersContainer } from "./styles";

const { Title } = Typography;

function Ui(props) {
  const {
    ordersState: { orderList, fetching, finishedFetching },
    fetchOrders,
  } = props;

  useEffect(() => {
    if (!fetching && !finishedFetching) {
      fetchOrders();
    }
  }, [fetching, finishedFetching]);

  const renderStatusIcons = {
    pending: PendingIcon,
    purchased: PurchasedIcon,
    shipped: ShippedIcon,
    declined: DeclinedIcon,
    refunded: RefundedIcon,
    partially_refunded: RefundedIcon,
  };

  const columns = [
    {
      title: "Order No.",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Date Ordered",
      dataIndex: "date_created",
      key: "date_created",
      responsive: ["md"],
      render: (date_created) => moment(date_created).format("llll"),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (val, instance) => `${instance.first_name} ${instance.last_name}`,
    },
    {
      title: "Items",
      dataIndex: "product_qty_details",
      key: "product_qty_details",
      responsive: ["md"],
      render: (products) => {
        const firstProduct = products[0];
        let itemsString = `${firstProduct.qty} x ${firstProduct.product}`;

        if (products.length > 1) {
          itemsString = itemsString.concat(
            `\n ${products.length - 1} more item${
              products.length - 1 > 1 ? "s" : ""
            }`
          );
        }

        return itemsString;
      },
    },
    {
      title: "Total",
      dataIndex: "amount",
      key: "amount",
      responsive: ["md"],
      render: (amount) => `A$${amount.toFixed(2)}`,
    },
    {
      title: "Type",
      dataIndex: "fulfillment_type",
      key: "fulfillment_type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      responsive: ["md"],
      render: (status, instance) => {
        const renderIcons = {
          pending: PendingIcon,
          purchased: PurchasedIcon,
          shipped: ShippedIcon,
          declined: DeclinedIcon,
          refunded: RefundedIcon,
          partially_refunded: RefundedIcon,
        };

        const StatusIcon = renderIcons[status];

        return (
          <span className={status}>
            <StatusIcon /> {status}
          </span>
        );
      },
    },
  ];

  const mobileColumns = [
    {
      title: "Customer/Amount/Status",
      dataIndex: "customer",
      key: "customer-amount-status",
      className: "left",
      render: (val, instance) => {
        const StatusIcon = renderStatusIcons[instance.status];

        return (
          <div className="detail-3-column-compressed">
            <p>{`${instance.first_name} ${instance.last_name}`}</p>
            <p>{`A$${instance.amount.toFixed(2)}`}</p>
            <span className={instance.status}>
              <StatusIcon /> {instance.status}
            </span>
          </div>
        );
      },
    },
    {
      title: "Number/Date/Type",
      dataIndex: "number",
      key: "customer-amount-status",
      className: "right",
      render: (val, instance) => {
        return (
          <div className="detail-3-column-compressed">
            <p>{`#${instance.number}`}</p>
            <p>{moment(instance.date_created).format("DD/MM/yy")}</p>
            <p>{instance.fulfillment_type}</p>
          </div>
        );
      },
    },
  ];

  const dataSource = orderList.map((order, idx) => ({
    key: idx + order.number,
    ...order,
  }));

  return (
    <OrdersContainer>
      <Title level={4}>Orders</Title>
      <Table className="desktop" dataSource={dataSource} columns={columns} />
      <Table
        className="mobile"
        dataSource={dataSource}
        showHeader={false}
        columns={mobileColumns}
      />
    </OrdersContainer>
  );
}

Ui.propTypes = {};

export default Ui;
