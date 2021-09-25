import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Input, Button, Card, Badge, Tabs, Tooltip, Result, Table } from "antd";
import classNames from "classnames";
import { isEmpty } from "lodash";
const { TabPane } = Tabs;
import {
  CheckCircleOutlined,
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
} from "@ant-design/icons";

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";
import { ErrorField } from "components/errorField";
import Image from "components/image";

import { getGdayPunchStaticUrl } from "utils/utils";
import { App, DetailField, EditButton, SubscriptionItem } from "./styles";

function Ui(props) {
  const {
    user,
    emailVerificationState,
    requestEmailVerification,
    updateUserDetails,
    userUpdateError,
    updateUserDetailsError,
    fetchAccountOrders,
    fetchProducts,
    ordersState: {
      orderList,
      fetching: fetchingOrders,
      finished: fetchingOrdersFinished,
    },
    productsState: { fetchingProducts, finishedFetchingProducts },
    gdaySubscriptionProducts,
    updateCartItemQuantity,
    history,
  } = props;
  const {
    requesting,
    requestingFinished,
    requestingErrors: errors,
  } = emailVerificationState;
  const [editingEmail, toggleEditingEmail] = useState(false);
  const [email, updateEmail] = useState(user.email);
  const { tab } = useParams();

  useEffect(() => {
    if (
      isEmpty(gdaySubscriptionProducts) &&
      !fetchingProducts &&
      !finishedFetchingProducts
    ) {
      fetchProducts();
    }
  }, [gdaySubscriptionProducts, fetchingProducts, finishedFetchingProducts]);

  useEffect(() => {
    if (
      user.stripe_customer_id &&
      isEmpty(orderList) &&
      !fetchingOrders &&
      !fetchingOrdersFinished
    ) {
      fetchAccountOrders(user.stripe_customer_id);
    }
  }, [orderList, fetchingOrders, fetchingOrdersFinished]);

  const attentionNeeded = (section) => {
    if (!user.email) return false;

    switch (section) {
      case "profile":
        if (user.verified !== "verified") {
          return true;
        }
      default:
        return false;
    }
  };

  const handleUpdateEmail = () => {
    if (email === user.email) {
      toggleEditingEmail(false);
    } else {
      updateUserDetails({ email });
    }
  };

  const editSaveCancelRender = (header) => {
    if (!editingEmail) {
      return (
        <EditButton separator={header} onClick={() => toggleEditingEmail(true)}>
          Edit
        </EditButton>
      );
    }
    return (
      <div>
        <EditButton separator="true" onClick={() => handleUpdateEmail()}>
          Save
        </EditButton>
        <EditButton
          separator={header}
          onClick={() => {
            toggleEditingEmail(false);
            updateUserDetailsError(undefined);
          }}
        >
          Cancel
        </EditButton>
      </div>
    );
  };

  const handleTabChange = (key) => {
    history.replace(`/account/${key}`);

    switch (key) {
      case "orders":
        if (fetchingOrdersFinished) return;
        fetchAccountOrders(user.stripe_customer_id);
      default:
        return;
    }
  };

  const renderStatusIcons = {
    pending: PendingIcon,
    purchased: PurchasedIcon,
    shipped: ShippedIcon,
    declined: DeclinedIcon,
    refunded: RefundedIcon,
    partially_refunded: RefundedIcon,
  };

  const ordersColumns = [
    {
      title: "Date",
      dataIndex: "readable_date",
      key: "readable_date",
      width: "100px",
      render: (readable_date) => readable_date.date,
    },
    {
      title: "Order No.",
      dataIndex: "number",
      key: "number",
      render: (number, order) => {
        const StatusIcon = renderStatusIcons[order.status];

        return (
          <span className={`status ${order.status}`}>
            {`#${number}`}
            <StatusIcon />
          </span>
        );
      },
    },
    {
      title: "Items",
      className: "desktop-only",
      dataIndex: "product_qty_details",
      key: "product_qty_details",
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
      title: "Paid",
      dataIndex: "amount",
      key: "amount",
      width: "15%",
      render: (amount) => `A$${amount.toFixed(2)}`,
    },
  ];

  const handleOrderOpen = (order) => {
    return {
      onClick: (event) => {
        history.push(`/order-confirmation/${order.secret}`);
      },
    };
  };

  const updateSubscriptionDescription = (description) => {
    return {
      __html: description,
    };
  };

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Account</SectionTitle>
        <Tabs defaultActiveKey={tab} onTabClick={handleTabChange}>
          <TabPane
            tab={<Badge dot={attentionNeeded("profile")}>Details</Badge>}
            key="profile"
          >
            <Card title="Profile" loading={!user.email}>
              <Card
                type="inner"
                title={
                  <Badge dot={user.verified !== "verified"} offset={[5]}>
                    Email
                  </Badge>
                }
                loading={!user.email}
                extra={
                  user.verified !== "verified" ? (
                    <>
                      {editSaveCancelRender(true)}
                      <Tooltip
                        placement="top"
                        title={"Request a verification email"}
                      >
                        <a href="#" onClick={() => requestEmailVerification()}>
                          Verify
                        </a>
                      </Tooltip>
                    </>
                  ) : (
                    <Tooltip placement="top" title={"Email verified"}>
                      <CheckCircleOutlined />
                    </Tooltip>
                  )
                }
              >
                {requesting ? <LoadingSpinner /> : null}
                {requestingFinished && !errors && (
                  <Result
                    status="success"
                    title="Verification email has been sent!"
                    subTitle="Please check your inbox or junk folder."
                    extra={<Button>Request Another</Button>}
                  />
                )}
                <DetailField noLabel="true">
                  {editingEmail ? (
                    <Input
                      name="email"
                      value={email}
                      onChange={(e) => updateEmail(e.target.value)}
                    />
                  ) : (
                    <p>{user.email}</p>
                  )}
                  <span />
                  {user.verified !== "verified" ? (
                    <p className="error">Email Verification Needed</p>
                  ) : (
                    editSaveCancelRender()
                  )}
                </DetailField>
                {userUpdateError && (
                  <ErrorField>
                    <div>
                      {Object.keys(userUpdateError).map((field) => (
                        <p key={field}>
                          <span>{field} - </span>
                          {userUpdateError[field]}
                          &nbsp;
                        </p>
                      ))}
                    </div>
                  </ErrorField>
                )}
              </Card>
              <Card
                className="non-first-tab"
                type="inner"
                title="User"
                extra={
                  <Tooltip placement="top" title={"Edit not available yet"}>
                    <a href="#" className="disabled">
                      Edit
                    </a>
                  </Tooltip>
                }
              >
                <DetailField>
                  <label>Username</label>
                  <p
                    className={classNames({
                      unset: !user.username || !user.username.length,
                    })}
                  >
                    {!user.username || !user.username.length ? (
                      <Tooltip
                        placement="top"
                        title={"Set username by commenting on a manga :)"}
                      >
                        Unset
                      </Tooltip>
                    ) : (
                      user.username
                    )}
                  </p>
                </DetailField>
              </Card>
            </Card>
          </TabPane>
          <TabPane tab="Orders" key="orders">
            <h4>My Orders</h4>
            {fetchingOrders ? (
              <LoadingSpinner />
            ) : (
              <Table
                dataSource={orderList.map((order) => ({
                  ...order,
                  key: order.id,
                }))}
                columns={ordersColumns}
                onRow={handleOrderOpen}
              />
            )}
          </TabPane>
          <TabPane tab="Subscriptions" key="subscriptions">
            <div className="gdaypunch-subscriptions">
              {gdaySubscriptionProducts.map(
                ({
                  key,
                  id,
                  title,
                  image,
                  active_price,
                  subscription_interval,
                  product_type,
                  quantity,
                  description,
                  purchased,
                }) => (
                  <SubscriptionItem key={key} purchased={purchased}>
                    <h3>{title}</h3>
                    <Image src={getGdayPunchStaticUrl(image)} />
                    <div className="title-price">
                      <h2>{`A$${active_price.toFixed(2)}`}</h2>
                      {product_type === "mag_subscription" ? (
                        "per issue release"
                      ) : (
                        <p>{`every ${
                          subscription_interval > 1 ? subscription_interval : ""
                        } month${subscription_interval > 1 ? "s" : ""}`}</p>
                      )}
                    </div>
                    <div
                      className="details-container"
                      dangerouslySetInnerHTML={updateSubscriptionDescription(
                        description
                      )}
                    />
                    {purchased ? <Button disabled>Subscribed</Button> : null}
                    {!purchased ? (
                      <Button
                        disabled={quantity}
                        className="not-purchased"
                        onClick={() =>
                          !quantity || quantity < 1
                            ? updateCartItemQuantity(id, 1, true)
                            : null
                        }
                      >
                        {quantity ? (
                          <span>Already in Cart</span>
                        ) : (
                          <>
                            <span className="not-subscribed">
                              Not Subscribed
                            </span>
                            <span className="subscribe-now">Subscribe Now</span>
                          </>
                        )}
                      </Button>
                    ) : null}
                  </SubscriptionItem>
                )
              )}
            </div>
          </TabPane>
          <TabPane tab="Payment" disabled key="payment">
            Payment Method
          </TabPane>
        </Tabs>
      </FeaturedSection>
    </App>
  );
}

export default Ui;
