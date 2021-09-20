import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

import Image from "components/image";
import { PageContainer } from "./styles";

import { getGdayPunchStaticUrl } from "utils/utils";

function Ui(props) {
  const {
    viewingOrderState: {
      order,
      fetching: fetchingViewingOrder,
      finished: finishedFetchingViewingOrder,
      errors: viewingOrderErrors,
    },
    fetchViewingOrder,
  } = props;
  const { orderSecret } = useParams();

  useEffect(() => {
    if (order) {
      document.title = `Order #${order.number} Confirmation | Gday Punch`;
    }
  }, [order]);

  useEffect(() => {
    if (!fetchingViewingOrder && !finishedFetchingViewingOrder) {
      if (orderSecret && !order) {
        fetchViewingOrder(orderSecret);
      }
    }
  }, [fetchingViewingOrder, finishedFetchingViewingOrder, order]);

  return (
    <PageContainer>
      {viewingOrderErrors ? <div></div> : null}
      {order && order.id ? <div></div> : fetchingViewingOrder && <Spin />}
    </PageContainer>
  );
}

export default Ui;
