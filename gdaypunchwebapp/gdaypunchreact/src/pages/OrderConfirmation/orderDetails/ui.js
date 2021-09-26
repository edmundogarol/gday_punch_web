import React from "react";
import { Table, Button } from "antd";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
} from "@ant-design/icons";

import { getGdayPunchStaticUrl } from "utils/utils";
import {
  OrderConfirmationContainer,
  ProductTotalsContainer,
  AddressContactField,
  AddressBillingContainer,
  LeftContainer,
  RightContainer,
  ModalTitle,
  TitleStatus,
  OrderStatuses,
} from "./styles";

function Ui(props) {
  const { order } = props;

  const renderStatusIcons = {
    pending: PendingIcon,
    purchased: PurchasedIcon,
    shipped: ShippedIcon,
    declined: DeclinedIcon,
    refunded: RefundedIcon,
    partially_refunded: RefundedIcon,
  };

  const productColumns = [
    {
      title: "Item",
      dataIndex: "product",
      key: "order-item",
      render: (product, instance) => {
        let currentStatus = "purchased";

        if (instance.status === "pending") {
          if (product.type === "digital") {
            currentStatus = "purchased";
          } else {
            currentStatus = "pending";
          }
        } else if (instance.status === "shipped") {
          if (product.type === "digital") {
            currentStatus = "purchased";
          } else {
            currentStatus = "shipped";
          }
        } else {
          currentStatus = instance.status;
        }

        const StatusIcon = renderStatusIcons[currentStatus];

        return (
          <div>
            <div className="item-image-title">
              <img src={getGdayPunchStaticUrl(product.image)} />
              <p>{product.title}</p>
              <span className={`status ${currentStatus}`}>
                <StatusIcon /> {currentStatus}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "SKU",
      dataIndex: "product",
      key: "order-sku",
      render: (product) => product.sku,
    },
    {
      title: "Price",
      dataIndex: "product",
      key: "order-price",
      render: (product) => `A$${product.price.toFixed(2)}`,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "order-qty",
    },
    {
      title: "Total",
      dataIndex: "product",
      key: "order-total",
      className: "total",
      render: (product) => `A$${product.total.toFixed(2)}`,
    },
  ];

  const mobileProductColumns = [
    {
      title: "Item",
      dataIndex: "product",
      key: "order-item",
      render: (product, instance) => {
        let currentStatus = "purchased";

        if (instance.status === "pending") {
          if (product.type === "digital") {
            currentStatus = "purchased";
          } else {
            currentStatus = "pending";
          }
        } else if (instance.status === "shipped") {
          if (product.type === "digital") {
            currentStatus = "purchased";
          } else {
            currentStatus = "shipped";
          }
        }

        const StatusIcon = renderStatusIcons[currentStatus];

        return (
          <div className="item-image-title">
            <img src={getGdayPunchStaticUrl(product.image)} />
            <div className="title-status-qty">
              <p>{product.title}</p>
              <span className={currentStatus + " status"}>
                <StatusIcon /> {currentStatus} {`(${instance.qty})`}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "product",
      key: "order-total",
      className: "total",
      render: (product) => `A$${product.total.toFixed(2)}`,
    },
  ];

  const statusColumns = [
    {
      title: "Date",
      dataIndex: "readable_date",
      key: "readable_date",
      render: ({ date, time }) => (
        <div>
          {date}
          <span>{time}</span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => description,
    },
  ];

  const StatusIcon = renderStatusIcons[order.status];

  return (
    <OrderConfirmationContainer>
      <ModalTitle>
        <TitleStatus>
          {`Order #${order.number}`}
          <span className={order.status + " status"}>
            <StatusIcon /> {order.status}
          </span>
        </TitleStatus>
      </ModalTitle>
      <Table
        rowKey="id"
        className="desktop"
        columns={productColumns}
        dataSource={
          order.product_qty_details
            ? order.product_qty_details.map((product) => ({
                ...product,
                status: order.status,
              }))
            : []
        }
        pagination={false}
      />
      <Table
        rowKey="id"
        className="mobile"
        columns={mobileProductColumns}
        dataSource={
          order.product_qty_details
            ? order.product_qty_details.map((product) => ({
                ...product,
                status: order.status,
              }))
            : []
        }
        pagination={false}
      />
      <ProductTotalsContainer>
        <div>
          Subtotal{" "}
          <span>{`A$${
            order.products_total_price
              ? order.products_total_price.toFixed(2)
              : "Error"
          }`}</span>
        </div>
        {order.address_line_1 ? (
          <div>
            Shipping
            <span>{`A$${order.country === "AU" ? "0.00" : "13.00"}`}</span>
          </div>
        ) : null}
        {order.coupon !== null && order.coupon.length > 1 && (
          <div>
            {`Discount [Coupon: ${order.coupon_details.description}]`}
            <span>{`- A$${order.coupon_details.discount_amount}`}</span>
          </div>
        )}
        <div>
          Tax (included in item prices): [GST]
          <span>{`A$${order.tax ? order.tax.toFixed(2) : "Error"}`}</span>
        </div>
        <div>
          Total:
          <span>{`A$${order.amount.toFixed(2)}`}</span>
        </div>
      </ProductTotalsContainer>
      <AddressBillingContainer>
        <LeftContainer>
          {order.address_line_1 ? (
            <AddressContactField>
              <h4>Shipping to</h4>
              <div>
                <p>{`${order.first_name} ${order.last_name}`}</p>
                <p>{`${order.address_line_1} ${order.address_line_2}`}</p>
                <p>{`${order.city}, ${order.state} ${order.postcode}`}</p>
                <p>{`${order.country}`}</p>
              </div>
            </AddressContactField>
          ) : null}
          <AddressContactField>
            <h4>Contact Information</h4>
            <div>
              <p>{`Phone: ${order.phone_number}`}</p>
              <p>{`Email: ${order.email}`}</p>
            </div>
          </AddressContactField>
        </LeftContainer>
        <RightContainer>
          <AddressContactField>
            <h4>Charged</h4>
            <div>
              <p>{`CC ending in ${order.last_four} [exp. ${order.exp_month}/${order.exp_year}]`}</p>
            </div>
          </AddressContactField>
          <AddressContactField>
            <h4>Billing Contact Information</h4>
            {order.billing_same_address ? (
              <div>
                <p>{`Phone: ${order.phone_number}`}</p>
                <p>{`Email: ${order.email}`}</p>
              </div>
            ) : (
              <div>
                <p>{`Phone: ${order.billing_number}`}</p>
                <p>{`Email: ${order.billing_email}`}</p>
              </div>
            )}
          </AddressContactField>
        </RightContainer>
      </AddressBillingContainer>
      {order.statuses ? (
        <OrderStatuses>
          <Table
            columns={statusColumns}
            dataSource={order.statuses.map((status) => ({
              key: status.id,
              ...status,
            }))}
            pagination={false}
          />
        </OrderStatuses>
      ) : null}
    </OrderConfirmationContainer>
  );
}

export default Ui;
