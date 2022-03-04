import React, { useEffect, useState } from "react";
import { Typography, Table } from "antd";
import Chart from "react-google-charts";
import moment from "moment";

import { AdminMobileNavLinks } from "./styles";

const { Title } = Typography;

function Ui(props) {
  const {
    user,
    history,
    pageType,
    ordersSales,
    salesTotal,
    fetchOrdersSalesGraph,
    orderSalesStatuses: { fetchingGraph, finishedFetchingGraph },
  } = props;

  function hasPrivilege(privilege) {
    if (!user.id) return false;

    const superUser = user.privileges.includes("super");
    if (superUser) return true;

    return user.privileges.includes(privilege);
  }

  useEffect(() => {
    if (!fetchingGraph && !finishedFetchingGraph && hasPrivilege("admin")) {
      fetchOrdersSalesGraph();
    }
  }, [fetchingGraph, finishedFetchingGraph]);

  const columns = [
    {
      title: "Admin Route",
      dataIndex: "route",
      key: "route",
      className: "admin-link",
      render: (route) => route,
    },
  ];

  const routerPageTypes = {
    dashboard: {
      title: "Website",
      routes: hasPrivilege("admin")
        ? [
            { key: 1, route: "users" },
            { key: 2, route: "contacts" },
            { key: 3, route: "votes" },
            { key: 4, route: "prompts" },
          ]
        : [],
    },
    store: {
      title: "Store",
      routes: hasPrivilege("admin")
        ? [
            { key: 1, route: "orders" },
            { key: 2, route: "products" },
            { key: 3, route: "payouts" },
            { key: 4, route: "coupons" },
          ]
        : [],
    },
    socials: {
      title: "Socials",
      routes:
        hasPrivilege("twitter") || hasPrivilege("instagram")
          ? [
              { key: 1, route: "twitter" },
              { key: 2, route: "instagram" },
            ]
          : [],
    },
  };

  const handleLinkOpen = (link, rowIndex) => {
    return {
      onClick: (event) => history.push(`/admin/${link.route}`),
    };
  };

  const { title, routes } = routerPageTypes[pageType];

  const dataFilled = [["This Week", "Sales", "Past Week"]].concat(ordersSales);

  return (
    <AdminMobileNavLinks>
      {hasPrivilege("admin") ? (
        <>
          <Title level={4}>{`Sales past fortnight: A$${salesTotal.toFixed(
            2
          )}`}</Title>
          {dataFilled.length > 1 ? (
            <Chart
              width={"100%"}
              height={"25em"}
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={dataFilled}
              options={{
                series: { 3: { type: "line" } },
                legend: { position: "none" },
                vAxis: { minValue: 0, format: "currency" },
              }}
            />
          ) : null}
        </>
      ) : null}
      <Title level={4}>{title}</Title>
      <Table
        onRow={handleLinkOpen}
        showHeader={false}
        pagination={false}
        dataSource={routes}
        columns={columns}
      />
    </AdminMobileNavLinks>
  );
}

export default Ui;
