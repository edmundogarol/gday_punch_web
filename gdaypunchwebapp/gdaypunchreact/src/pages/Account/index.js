import React, { useState, useEffect } from "react";
import { useParams, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, Card, Badge, Tabs, Tooltip, Result, Table } from "antd";
import classNames from "classnames";
import { isEmpty, set } from "lodash";
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
import { resetFetchingProducts } from "actions/app";
import {
  selectEmailVerificationState,
  selectGdaySubscriptionsProducts,
  selectProductsState,
  selectRegistrationError,
  selectUser,
} from "selectors/app";
import {
  doUpdateUserDetails,
  requestEmailVerification,
  updateRegistrationError,
} from "actions/user";
import { selectAccountOrdersState } from "selectors/account";
import { fetchAccountOrders } from "actions/account";
import { fetchProducts } from "actions/app";
import { updateCartItemQuantity } from "actions/cart";
import { getGdayPunchStaticUrl } from "utils/utils";
import { useScrollTop } from "utils/hooks/useScrollTop";

import { App, DetailField, EditButton, SubscriptionItem } from "./styles";
import ProfilePictureUploader from "./profilePicture";
import Seller from "./seller";

function Account(props) {
  const { history } = props;

  const user = useSelector(selectUser);
  const gdaySubscriptionProducts = useSelector(selectGdaySubscriptionsProducts);
  const userUpdateError = useSelector(selectRegistrationError);
  const {
    requesting,
    requestingFinished,
    requestingErrors: errors,
  } = useSelector(selectEmailVerificationState);
  const {
    orderList,
    fetching: fetchingOrders,
    finished: fetchingOrdersFinished,
  } = useSelector(selectAccountOrdersState);
  const { fetchingProducts, finishedFetchingProducts } =
    useSelector(selectProductsState);

  const dispatch = useDispatch();

  const [editingEmail, toggleEditingEmail] = useState(false);
  const [email, updateEmail] = useState(user.email);
  const [username, updateUsername] = useState(user.username);
  const [editingProfile, toggleEditingProfile] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const [imageUrl, updateImageUrl] = useState(false);

  const { tab } = useParams();

  useScrollTop();

  useEffect(() => {
    if (
      isEmpty(gdaySubscriptionProducts) &&
      !fetchingProducts &&
      !finishedFetchingProducts
    ) {
      dispatch(fetchProducts());
    }
  }, [gdaySubscriptionProducts, fetchingProducts, finishedFetchingProducts]);

  useEffect(() => {
    return () => {
      dispatch(resetFetchingProducts());
    };
  }, []);

  useEffect(() => {
    if (
      user.stripe_customer_id &&
      isEmpty(orderList) &&
      !fetchingOrders &&
      !fetchingOrdersFinished
    ) {
      dispatch(fetchAccountOrders(user.stripe_customer_id));
    }
  }, [orderList, fetchingOrders, fetchingOrdersFinished]);

  const attentionNeeded = (section) => {
    if (!user.email) return false;

    switch (section) {
      case "profile":
        if (user.verified !== "verified") {
          return true;
        }
        break;
      default:
        return false;
    }
  };

  const handleUpdateEmail = () => {
    if (email === user.email) {
      toggleEditingEmail(false);
    } else {
      dispatch(doUpdateUserDetails({ email }));
    }
  };

  const handleUpdateProfile = () => {
    const profileUpdates = {};
    if (!imageUrl && username === user.username) {
      toggleEditingProfile(false);
      return;
    }

    if (imageUrl) {
      set(profileUpdates, "image", imageUrl);
    }
    if (username !== user.username) {
      set(profileUpdates, "username", username);
    }

    dispatch(doUpdateUserDetails(profileUpdates));
  };

  const editSaveCancelRender = (field, header) => {
    const editingField = {
      email: {
        activeField: editingEmail,
        toggleEditing: toggleEditingEmail,
        handleUpdate: handleUpdateEmail,
        resetErrors: () => dispatch(updateRegistrationError(undefined)),
      },
      profile: {
        activeField: editingProfile,
        toggleEditing: toggleEditingProfile,
        handleUpdate: handleUpdateProfile,
        resetErrors: () => dispatch(updateRegistrationError(undefined)),
      },
    };
    const currentField = editingField[field];

    if (!currentField.activeField) {
      return (
        <EditButton
          separator={header}
          onClick={() => currentField.toggleEditing(true)}
        >
          Edit
        </EditButton>
      );
    }
    return (
      <div>
        <EditButton
          separator="true"
          onClick={() => currentField.handleUpdate()}
        >
          Save
        </EditButton>
        <EditButton
          separator={header}
          onClick={() => {
            currentField.toggleEditing(false);
            currentField.resetErrors();
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
        dispatch(fetchAccountOrders(user.stripe_customer_id));
        break;
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
      onClick: () => {
        history.push(`/order-confirmation/${order.secret}`);
      },
    };
  };

  const updateSubscriptionDescription = (description) => {
    return {
      __html: description,
    };
  };

  const renderUserUpdateError = (field) => {
    if (userUpdateError && userUpdateError[field]) {
      return (
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
      );
    }
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
                      {editSaveCancelRender("email", true)}
                      <Tooltip
                        placement="top"
                        title={"Request a verification email"}
                      >
                        <a
                          href="#"
                          onClick={() => dispatch(requestEmailVerification())}
                        >
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
                    editSaveCancelRender("email")
                  )}
                </DetailField>
                {renderUserUpdateError("email")}
              </Card>
              <Card
                className="non-first-tab"
                type="inner"
                title="User"
                extra={
                  <Tooltip placement="top" title={"Edit User Details"}>
                    {editSaveCancelRender("profile")}
                  </Tooltip>
                }
              >
                <DetailField className="avatar">
                  <label>Avatar</label>
                  <ProfilePictureUploader
                    editing={editingProfile}
                    imageUrl={
                      user.image && !imageUrl
                        ? user.image.includes("gdaypunch-static.s3.amazonaws")
                          ? user.image
                          : getGdayPunchStaticUrl(user.image)
                        : imageUrl
                    }
                    updateImageUrl={updateImageUrl}
                    loading={user.updating || loading}
                    toggleLoading={toggleLoading}
                  />
                </DetailField>
                {renderUserUpdateError("image")}
                <DetailField>
                  <label>Username</label>
                  {editingProfile ? (
                    <Input
                      name="username"
                      value={username}
                      onChange={(e) => updateUsername(e.target.value)}
                    />
                  ) : (
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
                  )}
                </DetailField>
                {renderUserUpdateError("username")}
              </Card>
              {user.errors ? (
                <ErrorField>
                  <div>
                    {Object.keys(user.errors).length
                      ? Object.keys(user.errors).map((field) => (
                          <p key={field}>
                            <span>{field} - </span>
                            {user.errors[field]}
                            &nbsp;
                          </p>
                        ))
                      : "Something went wrong. Please try again later."}
                  </div>
                </ErrorField>
              ) : null}
              <Card
                className="non-first-tab"
                type="inner"
                title="Email Preferences"
                extra={
                  <Tooltip placement="top" title={"Edit not available yet"}>
                    <a href="#" className="disabled">
                      Edit
                    </a>
                  </Tooltip>
                }
              >
                {user.subscribed ? (
                  <DetailField>
                    <label>Subscribed</label>
                    <p>Gday Punch promotions and latest manga news</p>
                  </DetailField>
                ) : (
                  <DetailField>
                    <p className="unset">Not Subscribed</p>
                  </DetailField>
                )}
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
          <TabPane
            tab="Subscriptions"
            key="subscriptions"
            disabled={!gdaySubscriptionProducts.length}
          >
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
                            ? dispatch(updateCartItemQuantity(id, 1, true))
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
          <TabPane
            tab="Payment"
            disabled={!user.customer_payment_details}
            key="payment"
          >
            {user.customer_payment_details ? (
              <Card
                className="non-first-tab"
                type="inner"
                title="Payment Method"
                extra={
                  <Tooltip
                    placement="top"
                    title={
                      "Edit not available yet. Contact info@gdaypunch.com.au to update subscription details."
                    }
                  >
                    <a href="#" className="disabled">
                      Edit
                    </a>
                  </Tooltip>
                }
              >
                <DetailField>
                  <label>Card</label>
                  <p>{`Ending in ${user.customer_payment_details.last_four}`}</p>
                  <p className="unset">
                    {`${user.customer_payment_details.exp_month}/${user.customer_payment_details.exp_year}`}
                  </p>
                </DetailField>
              </Card>
            ) : null}
          </TabPane>
          <TabPane tab="Seller" key="seller">
            <Seller />
          </TabPane>
        </Tabs>
      </FeaturedSection>
    </App>
  );
}

export default withRouter(Account);
