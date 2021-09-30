import React from "react";
import { Typography, Table } from "antd";
import { NavLink } from "react-router-dom";

import { AdminMobileNavLinks } from "./styles";

const { Title } = Typography;

function Ui(props) {
  const { user } = props;

  function hasPrivilege(privilege) {
    if (!user.id) return false;

    const superUser = user.privileges.includes("super");
    if (superUser) return true;

    return user.privileges.includes(privilege);
  }

  const columns = [
    {
      title: "Admin Route",
      dataIndex: "route",
      key: "route",
      render: (route) =>
        hasPrivilege("admin") ? (
          <NavLink className="nav-link" to={`/admin/${route}`}>
            {route}
          </NavLink>
        ) : null,
    },
  ];

  const websiteRoutes = [
    { key: 1, route: "users" },
    { key: 2, route: "contacts" },
    { key: 3, route: "prompts" },
  ];

  return (
    <AdminMobileNavLinks>
      <Title level={4}>Website</Title>
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
