import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, Result, Button } from "antd";

import Image from "components/image";
import { PageContainer, ThankYouContainer } from "./styles";
import OrderDetails from "./orderDetails";

import { getGdayPunchStaticUrl } from "utils/utils";

function Ui(props) {
  const {
    viewingOrderState: {
      order,
      fetching: fetchingViewingOrder,
      finished: finishedFetchingViewingOrder,
      errors: viewingOrderErrors,
    },
    paymentSuccess,
    fetchViewingOrder,
    updateViewingOrder,
  } = props;
  const { orderSecret } = useParams();

  useEffect(() => {
    if (order) {
      document.title = `Order #${order.number} Confirmation | Gday Punch`;
    }
  }, [order]);

  useEffect(() => {
    if (!fetchingViewingOrder && !finishedFetchingViewingOrder) {
      if (orderSecret && !order.id) {
        fetchViewingOrder(orderSecret);
      }
    }
  }, [fetchingViewingOrder, finishedFetchingViewingOrder, order]);

  useEffect(() => {
    updateViewingOrder({});
  }, []);

  const renderSuccessImage = () => {
    if (!paymentSuccess) return <div className="fill-under-nav" />;

    return (
      <Result
        className="server-success"
        icon={<Image src={getGdayPunchStaticUrl("shopping-success.png")} />}
        title="Awesome, your order was successful!"
        extra={
          <Button type="primary" onClick={() => history.push("/")}>
            Return Home
          </Button>
        }
      />
    );
  };

  return (
    <PageContainer>
      {viewingOrderErrors ? (
        <div className="order-viewing-error">
          <Result
            status="error"
            title={"Oops - Something went wrong."}
            subTitle={viewingOrderErrors}
          ></Result>
        </div>
      ) : null}
      {order && order.id ? (
        <div>
          {renderSuccessImage()}
          <ThankYouContainer>
            Thank you! We've received your order
            <span>{`- ${order.readable_date.date} ${order.readable_date.time}`}</span>
          </ThankYouContainer>
          <OrderDetails order={order} />
        </div>
      ) : (
        fetchingViewingOrder && <Spin />
      )}
    </PageContainer>
  );
}

export default Ui;
