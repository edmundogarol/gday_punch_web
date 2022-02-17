import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Modal, Button, Input, Typography, message } from "antd";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import OrderDetailsModal from "pages/Admin/orders/orderDetails";
import ProductsAccessModal from "../productsAccess";
import PrivilegesManagerModal from "../privileges";
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
import { selectOrderState } from "selectors/admin";

import {
  setSelectedUser,
  setSelectedOrder,
  updateCustomerDetails,
  fetchProductsSimple,
} from "actions/admin";
import {
  updateOrderStatus,
  updatePartialRefund,
  updateStatusReason,
} from "actions/admin";

const { confirm } = Modal;
const { Title } = Typography;

function UserDetails(props) {
  const { user } = props;
  const { customer_details } = user;
  const { selected } = useSelector(selectOrderState);
  const [productsAccessOpen, updateProductsAccessOpen] = useState(false);
  const [privilegesManagerOpen, updatePrivilegesManagerOpen] = useState(false);

  const dispatch = useDispatch();

  const handleSubscribe = () => {
    confirm({
      title: user.subscribed ? "Unsubscribe user?" : "Subscribe user?",
      icon: <ExclamationCircleOutlined />,
      content: "Confirm subscription update for user: " + user.email,
      onOk() {
        if (user.subscribed) {
          dispatch(
            updateCustomerDetails(user, user.customer_id, {
              subscribed: "unsubscribed",
            })
          );
        } else {
          dispatch(
            updateCustomerDetails(user, user.customer_id, {
              subscribed: "subscribed_only",
              user: user.id,
              email: user.email,
            })
          );
        }
      },
      onCancel() {
        message.warn("Cancelled customer subscription update.");
      },
    });
  };

  const handleMagSubscribe = () => {
    confirm({
      title: customer_details.mag_subscribed
        ? "Unsubscribe user?"
        : "Subscribe user?",
      icon: <ExclamationCircleOutlined />,
      content: "Confirm Magazine subscription update for user: " + user.email,
      onOk() {
        dispatch(
          updateCustomerDetails(user, user.customer_id, {
            mag_subscribed: !customer_details.mag_subscribed,
          })
        );
      },
      onCancel() {
        message.warn("Cancelled customer magazine subscription update.");
      },
    });
  };

  const handleDigSubscribe = () => {
    confirm({
      title: customer_details.dig_subscribed
        ? "Unsubscribe user?"
        : "Subscribe user?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Confirm Digital Issues subscription update for user: " + user.email,
      onOk() {
        dispatch(
          updateCustomerDetails(user, user.customer_id, {
            dig_subscribed: !customer_details.dig_subscribed,
          })
        );
      },
      onCancel() {
        message.warn("Cancelled customer digital subscription update.");
      },
    });
  };

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
        dispatch(setSelectedOrder(order.id));
      },
    };
  };

  const handleOwnedDigitalModalOpen = () => {
    dispatch(fetchProductsSimple());
    updateProductsAccessOpen(true);
  };

  return (
    <>
      {privilegesManagerOpen && (
        <PrivilegesManagerModal
          userId={user.id}
          userPrivileges={user.privileges}
          privilegesManagerOpen={privilegesManagerOpen}
          updatePrivilegesManagerOpen={updatePrivilegesManagerOpen}
        />
      )}
      {productsAccessOpen && (
        <ProductsAccessModal
          customerId={customer_details?.id}
          customerProducts={
            customer_details ? customer_details.owned_access_products : []
          }
          productsAccessOpen={productsAccessOpen}
          updateProductsAccessOpen={updateProductsAccessOpen}
        />
      )}
      {selected && (
        <OrderDetailsModal
          selectOrderState={selectOrderState}
          setSelectedOrder={setSelectedOrder}
          updateOrderStatus={updateOrderStatus}
          updateStatusReason={updateStatusReason}
          updatePartialRefund={updatePartialRefund}
          customerId={customer_details.id}
        />
      )}
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
          </ModalTitle>
        }
        visible={user}
        onCancel={() => dispatch(setSelectedUser(undefined))}
        cancelText="Close"
        okButtonProps={{ style: { display: "none" } }}
      >
        <Title level={4} className="first">
          Profile
        </Title>
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
            <UserField>
              <h4>Privileges</h4>
              <div>{`[${
                user.privileges.length ? user.privileges.join(", ") : "None"
              }]`}</div>
              <div
                className="view-details edit"
                onClick={() => updatePrivilegesManagerOpen(true)}
              >
                Edit
              </div>
            </UserField>
          </LeftUserFields>
          <LeftUserFields>
            <UserField>
              <h4>Verified</h4>
              <div className={user.verified ? "true" : ""}>
                {user.verified === "verified" ? (
                  <PurchasedIcon />
                ) : (
                  "Not verified"
                )}
              </div>
            </UserField>
            <UserField>
              <h4>Last Login</h4>
              <div>
                {user.readable_last_login
                  ? `${user.readable_last_login.date} ${user.readable_last_login.time}`
                  : "Never logged in"}
              </div>
            </UserField>
            <UserField>
              <h4>Date Joined</h4>
              <div>{user.readable_date_joined.date}</div>
            </UserField>
          </LeftUserFields>
        </UserFieldsContainer>
        <Title level={4}>Subscriptions</Title>
        {customer_details ? (
          <UserFieldsContainer>
            <LeftUserFields>
              <UserField>
                <h4>Emails</h4>
                <div className={user.subscribed ? "true" : ""}>
                  {user.subscribed ? <PurchasedIcon /> : "None"}
                </div>
              </UserField>
              <UserField>
                <h4>Magazine Issues</h4>
                <div className={customer_details.mag_subscribed ? "true" : ""}>
                  {customer_details.mag_subscribed ? <PurchasedIcon /> : "None"}
                </div>
              </UserField>
              <UserField>
                <h4>Digital Issues</h4>
                <div className={customer_details.dig_subscribed ? "true" : ""}>
                  {customer_details.dig_subscribed ? <PurchasedIcon /> : "None"}
                </div>
              </UserField>
            </LeftUserFields>
            <LeftUserFields>
              <UserField>
                <h4>Owned Digital Access</h4>
                <div
                  className="view-details"
                  onClick={() => handleOwnedDigitalModalOpen()}
                >
                  {customer_details.owned_access_count}
                </div>
              </UserField>
            </LeftUserFields>
          </UserFieldsContainer>
        ) : null}
        <StatusButtons>
          <Button
            className={user.subscribed ? "remove" : "add"}
            onClick={() => handleSubscribe()}
          >
            {user.subscribed ? "Unsubscribe Emails" : "Subscribe Emails"}
          </Button>
          {customer_details ? (
            <Button
              className={customer_details.mag_subscribed ? "remove" : "add"}
              onClick={() => handleMagSubscribe()}
            >
              {customer_details.mag_subscribed
                ? "Unsubscribe Magazine Subscription"
                : "Subscribe Magazine Issues"}
            </Button>
          ) : null}
          {customer_details ? (
            <Button
              className={customer_details.dig_subscribed ? "remove" : "add"}
              onClick={() => handleDigSubscribe()}
            >
              {customer_details.dig_subscribed
                ? "Unsubscribe Digital Subscription"
                : "Subscribe Digital Issues"}
            </Button>
          ) : null}
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

export default UserDetails;
