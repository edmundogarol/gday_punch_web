import React, { useEffect } from "react";
import { Typography, Table } from "antd";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
} from "@ant-design/icons";

import OrderDetailsModal from "./orderDetails";
import { OrdersContainer } from "./styles";

const { Title } = Typography;

function Ui(props) {
  const {
    ordersState: {
      orderList,
      count: availableCount,
      fetching,
      finishedFetching,
      selected,
    },
    fetchOrders,
    fetchOrderStatuses,
    setSelectedOrder,
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
      dataIndex: "readable_date",
      key: "readable_date",
      className: "center",
      render: (readable_date) => {
        return (
          <>
            <p>{readable_date.date}</p>
            <p>{readable_date.time}</p>
          </>
        );
      },
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
      className: "center",
      render: (products) => {
        const firstProduct = products[0];
        const items = (
          <p>{`${firstProduct.qty} x ${firstProduct.product.title}`}</p>
        );

        let more = null;

        if (products.length > 1) {
          more = (
            <p>{`${products.length - 1} more item${
              products.length - 1 > 1 ? "s" : ""
            }`}</p>
          );
        }

        return (
          <>
            {items}
            {more}
          </>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "amount",
      key: "amount",
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
      render: (status, instance) => {
        const StatusIcon = renderStatusIcons[status];

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
      title: "Items",
      dataIndex: "product_qty_details",
      key: "product_qty_details",
      className: "center",
      render: (products) => {
        const firstProduct = products[0];
        const items = (
          <p>{`${firstProduct.qty} x ${firstProduct.product.title}`}</p>
        );
        let more = null;

        if (products.length > 1) {
          more = (
            <p>{`${products.length - 1} more item${
              products.length - 1 > 1 ? "s" : ""
            }`}</p>
          );
        }

        return (
          <>
            {items}
            {more}
          </>
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
            <p>{instance.readable_date.date}</p>
            <p>{instance.fulfillment_type}</p>
          </div>
        );
      },
    },
  ];

  const handleOrderOpen = (order, rowIndex) => {
    return {
      onClick: (event) => {
        setSelectedOrder(order.id);
        if (!order.statuses) {
          fetchOrderStatuses(order.id);
        }
      },
    };
  };

  const dataSource = Object.values(orderList)
    .map((order) => ({
      key: order.id,
      ...order,
    }))
    .sort((a, b) => -(a.id - b.id));

  const currentOrderCount = Object.values(orderList).length;

  return (
    <OrdersContainer>
      <Title level={4}>Orders</Title>
      {selected && <OrderDetailsModal />}
      <Table
        onRow={handleOrderOpen}
        className="desktop"
        dataSource={dataSource}
        columns={columns}
        onChange={({ current, pageSize }) => {
          if (currentOrderCount < availableCount) {
            if (current * pageSize === currentOrderCount) {
              fetchOrders(true); // true = fetch next
            }
          }
        }}
      />
      <Table
        className="mobile"
        onRow={handleOrderOpen}
        dataSource={dataSource}
        showHeader={false}
        columns={mobileColumns}
      />
    </OrdersContainer>
  );
}

export default Ui;
