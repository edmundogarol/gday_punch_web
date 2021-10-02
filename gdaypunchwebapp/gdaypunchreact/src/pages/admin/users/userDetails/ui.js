import React, { useState } from "react";
import { Table, Modal, Button, Input, Typography } from "antd";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
} from "@ant-design/icons";

import { getGdayPunchStaticUrl } from "utils/utils";
import OrderDetailsModal from "pages/Admin/orders/orderDetails";
import {
  UserModal,
  AddressContactField,
  AddressBillingContainer,
  LeftContainer,
  RightContainer,
  ModalTitle,
  TitleStatus,
  StatusButtons,
  UserFieldsContainer,
  UserField,
  LeftUserFields,
} from "./styles";

const { confirm } = Modal;
const { TextArea } = Input;
const { Title } = Typography;

function Ui(props) {
  const {
    user,
    setSelectedUser,
    setSelectedOrder,
    ordersState: { selected },
  } = props;
  const { customer_details } = user;

  // const markShipped = (orderId, products) => {
  //   confirm({
  //     title: "Mark this order as shipped?",
  //     icon: <ExclamationCircleOutlined />,
  //     content: (
  //       <ModalItemSummary>
  //         {"Confirm shipment of all shippable items included in order."}
  //         <div>
  //           {products.map((product) => (
  //             <p key={product.id}>{`- ${product.title} x${product.qty}`}</p>
  //           ))}
  //         </div>
  //         <div>
  //           {"Provide any notes for shipment."}
  //           <div>
  //             <TextArea
  //               rows={10}
  //               showCount
  //               maxLength={500}
  //               value={reason}
  //               onChange={(e) => updateStatusReason(e.target.value)}
  //               placeholder="Enter shipment notes."
  //             />
  //           </div>
  //         </div>
  //       </ModalItemSummary>
  //     ),
  //     onOk() {
  //       updateOrderStatus(orderId, "shipped");
  //     },
  //     onCancel() {
  //       updateStatusReason(undefined);
  //     },
  //   });
  // };

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
      className: "email-or-name",
      render: (val, instance) =>
        instance.first_name
          ? `${instance.first_name} ${instance.last_name}`
          : instance.email,
    },
    {
      title: "Items",
      dataIndex: "product_qty_details",
      key: "product_qty_details",
      className: "center",
      render: (products) => {
        if (!products) return <>Problem retrieving items.</>;

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
      className: "left email-or-name",
      render: (val, instance) => {
        const StatusIcon = renderStatusIcons[instance.status];

        return (
          <div className="detail-3-column-compressed">
            <p>
              {instance.first_name
                ? `${instance.first_name} ${instance.last_name}`
                : instance.email}
            </p>
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
        if (!products) return <>Problem retrieving items.</>;
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

  const handleOrderOpen = (order) => {
    return {
      onClick: (event) => {
        setSelectedOrder(order.id);
      },
    };
  };

  return (
    <>
      {selected && <OrderDetailsModal customerId={customer_details.id} />}
      <UserModal
        width="80%"
        title={
          <ModalTitle>
            <TitleStatus>
              {`${user.email}`}
              <span className="status">
                {user.username || "Username unset"}
              </span>
              <span className={`status ${user.subscribed ? "subscribed" : ""}`}>
                {user.subscribed ? (
                  <>
                    <PurchasedIcon />
                    Subscribed
                  </>
                ) : null}
              </span>
            </TitleStatus>
            {/* <Button
            onClick={() =>
              markShipped(
                order.id,
                order.product_qty_details
                  .map((elem) => ({
                    id: elem.id,
                    qty: elem.qty,
                    ...elem.product,
                  }))
                  .filter((prod) => prod.type !== "digital")
              )
            }
          >
            Mark as Shipped
          </Button> */}
          </ModalTitle>
        }
        visible={user}
        onCancel={() => setSelectedUser(undefined)}
        cancelText="Close"
        okButtonProps={{ style: { display: "none" } }}
      >
        <UserFieldsContainer>
          <LeftUserFields>
            <UserField>
              <h4>Email</h4>
              <div>{user.email}</div>
            </UserField>
            <UserField>
              <h4>Username</h4>
              <div>{user.username}</div>
            </UserField>
            <UserField>
              <h4>Type</h4>
              <div>{user.is_staff ? "Staff" : "Normal"}</div>
            </UserField>
          </LeftUserFields>
          <LeftUserFields>
            <UserField>
              <h4>Verified</h4>
              <div>{user.verified ? "Verified" : "Unverified"}</div>
            </UserField>
            <UserField>
              <h4>Last Login</h4>
              <div>{`${user.readable_last_login.date} ${user.readable_last_login.time}`}</div>
            </UserField>
            <UserField>
              <h4>Date Joined</h4>
              <div>{user.readable_date_joined.date}</div>
            </UserField>
          </LeftUserFields>
        </UserFieldsContainer>
        <StatusButtons>
          <Button onClick={() => console.log("Unsubscribe")}>
            {user.subscribed ? "Unsubscribe" : "Subscribe"}
          </Button>
        </StatusButtons>
        {customer_details ? (
          <AddressBillingContainer>
            <LeftContainer>
              {customer_details.address_line_1 ? (
                <AddressContactField>
                  <h4>Shipping Address</h4>
                  <div>
                    <p>{`${customer_details.first_name} ${customer_details.last_name}`}</p>
                    <p>{`${customer_details.address_line_1} ${customer_details.address_line_2}`}</p>
                    <p>{`${customer_details.city}, ${customer_details.state} ${customer_details.postcode}`}</p>
                    <p>{`${customer_details.country}`}</p>
                  </div>
                </AddressContactField>
              ) : null}
              <AddressContactField>
                <h4>Contact Information</h4>
                <div>
                  <p>{`Phone: ${customer_details.phone_number}`}</p>
                  <p>{`Email: ${customer_details.email}`}</p>
                </div>
              </AddressContactField>
            </LeftContainer>
            {customer_details.last_3_purchases ? (
              <RightContainer>
                <AddressContactField>
                  <h4>Most Recent Billing Details</h4>
                  <div>
                    <p>{`CC ending in ${customer_details.last_3_purchases[0].last_four} [exp. ${customer_details.last_3_purchases[0].exp_month}/${customer_details.last_3_purchases[0].exp_year}]`}</p>
                  </div>
                </AddressContactField>
                <AddressContactField>
                  <h4>Billing Address</h4>
                  {customer_details.last_3_purchases[0].billing_same_address ? (
                    <div>
                      <p>{`${customer_details.first_name} ${customer_details.last_name}`}</p>
                      <p>{`${customer_details.address_line_1} ${customer_details.address_line_2}`}</p>
                      <p>{`${customer_details.city}, ${customer_details.state} ${customer_details.postcode}`}</p>
                      <p>{`${customer_details.country}`}</p>
                    </div>
                  ) : (
                    <div>
                      <p>{`${customer_details.last_3_purchases[0].billing_first_name} ${customer_details.last_3_purchases[0].billing_last_name}`}</p>
                      <p>{`${customer_details.last_3_purchases[0].billing_address_line_1} ${customer_details.last_3_purchases[0].billing_address_line_2}`}</p>
                      <p>{`${customer_details.last_3_purchases[0].billing_city} ${customer_details.last_3_purchases[0].billing_state}, ${customer_details.last_3_purchases[0].billing_postcode}`}</p>
                      <p>{`${customer_details.last_3_purchases[0].billing_country}`}</p>
                    </div>
                  )}
                </AddressContactField>
                <AddressContactField>
                  <h4>Contact Information</h4>
                  {customer_details.last_3_purchases[0].billing_same_address ? (
                    <div>
                      <p>{`Phone: ${customer_details.phone_number}`}</p>
                      <p>{`Email: ${customer_details.email}`}</p>
                    </div>
                  ) : (
                    <div>
                      <p>{`Phone: ${customer_details.last_3_purchases[0].billing_number}`}</p>
                      <p>{`Email: ${customer_details.last_3_purchases[0].billing_email}`}</p>
                    </div>
                  )}
                </AddressContactField>
              </RightContainer>
            ) : null}
          </AddressBillingContainer>
        ) : null}
        {customer_details &&
        customer_details.last_3_purchases &&
        customer_details.last_3_purchases[0] ? (
          <>
            <Title level={4}>Most Recent Orders</Title>
            <Table
              onRow={handleOrderOpen}
              className="desktop"
              dataSource={customer_details.last_3_purchases}
              columns={columns}
              pagination={false}
            />
            <Table
              className="mobile"
              onRow={handleOrderOpen}
              dataSource={customer_details.last_3_purchases}
              showHeader={false}
              columns={mobileColumns}
              pagination={false}
            />
          </>
        ) : null}
      </UserModal>
    </>
  );
}

export default Ui;
