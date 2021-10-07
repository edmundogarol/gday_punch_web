import React, { useState } from "react";
import { Transfer, Modal, Button, Input, Typography, message } from "antd";
import { set, unset } from "lodash";

import { arrayIdsMapToObject, getGdayPunchStaticUrl } from "utils/utils";
import OrderDetailsModal from "pages/Admin/orders/orderDetails";
import { ProductsAccessModal } from "./styles";
import { ModalItemSummary } from "pages/Admin/orders/orderDetails/styles";

function Ui(props) {
  const allPrivileges = [
    "super",
    "admin",
    "prompts",
    "products",
    "twitter",
    "instagram",
    "shop_tester",
  ].map((privilege, idx) => ({
    key: privilege,
    title: privilege,
  }));

  const {
    userId,
    userPrivileges,
    updateUserPrivileges,
    privilegesManagerOpen,
    updatePrivilegesManagerOpen,
  } = props;

  const incomingTargetKeys = allPrivileges
    .map((privilege) => {
      if (userPrivileges.includes(privilege.title)) return null;
      return privilege.title;
    })
    .filter((privilege) => privilege !== null);

  const [targetKeys, setTargetKeys] = useState(incomingTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return (
    <>
      <ProductsAccessModal
        width="80%"
        title="User Privileges Manager"
        visible={privilegesManagerOpen}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              updatePrivilegesManagerOpen(false);
            }}
          >
            Cancel
          </Button>,
          <Button
            disabled={userPrivileges.toString() === targetKeys.toString()}
            type="primary"
            key="save"
            onClick={() => {
              const privIds = {
                super: 1,
                admin: 2,
                prompts: 3,
                products: 4,
                twitter: 5,
                instagram: 6,
                shop_tester: 7,
              };

              const newPrivileges = allPrivileges
                .map((privilege) => {
                  if (targetKeys.includes(privilege.title)) return null;
                  return privIds[privilege.title];
                })
                .filter((privilege) => privilege !== null);

              updateUserPrivileges(userId, newPrivileges);
              updatePrivilegesManagerOpen(false);
            }}
          >
            Save
          </Button>,
        ]}
      >
        <Transfer
          dataSource={allPrivileges}
          titles={["Assigned", "Not Assigned"]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          showSelectAll={true}
          render={(item) => item.title}
        />
      </ProductsAccessModal>
    </>
  );
}

export default Ui;
