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
    { key: 1, route: "twitter" },
    { key: 2, route: "instagram" },
  ];

  return (
    <AdminMobileNavLinks>
      <Title level={4}>Socials</Title>
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
