import React, { useEffect } from "react";
import { useParams, withRouter } from "react-router-dom";
import { Spin, Result, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

import Image from "components/image";
import { fetchViewingOrder, resetViewingOrder } from "src/actions/order";
import { selectViewingOrderState } from "src/selectors/orders";
import { selectPaymentSuccess } from "src/selectors/payment";
import { fetchProducts } from "src/actions/app";
import { resetPayment } from "src/actions/payment";
import { getGdayPunchStaticUrl } from "utils/utils";
import { useScrollTop } from "utils/hooks/useScrollTop";

import { PageContainer, StatusContainer } from "./styles";
import OrderDetails from "./OrderDetails";

function OrderConfirmation({ history }) {
  const { orderSecret } = useParams();
  const {
    order,
    fetching: fetchingViewingOrder,
    finished: finishedFetchingViewingOrder,
    errors: viewingOrderErrors,
  } = useSelector(selectViewingOrderState);
  const paymentSuccess = useSelector(selectPaymentSuccess);

  const dispatch = useDispatch();

  useScrollTop();

  useEffect(() => {
    if (order.id) {
      document.title = `Order #${order.number} Confirmation | Gday Punch`;
    } else if (viewingOrderErrors) {
      document.title = `Error | Gday Punch`;
    }
  }, [order, viewingOrderErrors]);

  useEffect(() => {
    if (!fetchingViewingOrder && !finishedFetchingViewingOrder) {
      if (orderSecret && !order.id) {
        dispatch(fetchViewingOrder(orderSecret));
      }
    }
  }, [fetchingViewingOrder, finishedFetchingViewingOrder, order]);

  useEffect(() => {
    return () => {
      dispatch(resetViewingOrder());
      dispatch(fetchProducts());
      dispatch(resetPayment());
    };
  }, []);

  const renderSuccessImage = () => {
    if (!paymentSuccess) return <div className="fill-under-nav" />;

    return (
      <Result
        className="server-success"
        icon={
          <Image
            preview={false}
            src={getGdayPunchStaticUrl("success-merchant-1-25.png")}
          />
        }
        title="Awesome, your order was successful!"
        extra={
          <Button type="primary" onClick={() => history.push("/")}>
            Return Home
          </Button>
        }
      />
    );
  };

  const renderLatestStatus = (status) => {
    const statusString = {
      pending: "Thank you! We've received your order.",
      purchased: "Thank you! We've received your order.",
      shipped: "Your order has been shipped!",
      declined: "Your order has been declined.",
      refunded: "Your order has been refunded.",
      partially_refunded: "Your order has been partially refunded.",
    };

    return (
      <>
        {statusString[status.status]}
        <div>{`- Last update [${status.readable_date.date}]`}</div>
      </>
    );
  };

  return (
    <PageContainer>
      {viewingOrderErrors ? (
        <div className="order-viewing-error">
          <Result
            status="error"
            title={"Oops - Something went wrong."}
            subTitle={
              <div>
                <p>{viewingOrderErrors}</p>
                {paymentSuccess ? (
                  <span>
                    Your card may have been charged but the order did not go
                    through. Please contact us at{" "}
                    <a href="mailto:info@gdaypunch.com">info@gdaypunch.com</a>
                    &nbsp; to fix this problem.
                  </span>
                ) : null}
              </div>
            }
          ></Result>
        </div>
      ) : null}
      {order && order.id ? (
        <div>
          {renderSuccessImage()}
          <StatusContainer>
            {order.statuses.length
              ? renderLatestStatus(order.statuses[0])
              : null}
          </StatusContainer>
          <OrderDetails order={order} />
        </div>
      ) : null}
      {fetchingViewingOrder ? <Spin tip="Loading order details..." /> : null}
    </PageContainer>
  );
}

export default withRouter(OrderConfirmation);
