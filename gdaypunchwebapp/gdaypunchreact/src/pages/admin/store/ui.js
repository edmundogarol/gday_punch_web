import React from "react";
import { Typography, Table } from "antd";
import { NavLink } from "react-router-dom";

import { AdminMobileNavLinks } from "./styles";

const { Title } = Typography;

function Ui(props) {
  const {} = props;

  const columns = [
    {
      title: "Admin Route",
      dataIndex: "route",
      key: "route",
      render: (route) => (
        <NavLink className="nav-link" to={`/admin/${route}`}>
          {route}
        </NavLink>
      ),
    },
  ];

  const websiteRoutes = [
    { key: 1, route: "orders" },
    { key: 2, route: "products" },
    { key: 3, route: "coupons" },
  ];

  return (
    <AdminMobileNavLinks>
      <Title level={4}>Store</Title>
      <Table
        showHeader={false}
        pagination={false}
        dataSource={websiteRoutes}
        columns={columns}
      />
    </AdminMobileNavLinks>
  );
}

export default Ui;
