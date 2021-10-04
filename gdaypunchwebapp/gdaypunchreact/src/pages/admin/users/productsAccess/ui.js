import React, { useEffect, useState } from "react";
import { Transfer, Modal, Button, Input, Typography, message } from "antd";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { getGdayPunchStaticUrl } from "utils/utils";
import OrderDetailsModal from "pages/Admin/orders/orderDetails";
import { ProductsAccessModal } from "./styles";

const { confirm } = Modal;
const { TextArea } = Input;
const { Title } = Typography;

function Ui(props) {
  const {
    customerProducts,
    productsSimpleState: { list },
    productsAccessOpen,
    updateProductsAccessOpen,
  } = props;
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const customerProductsKeysComparer = customerProducts.map(
    (product) => product.id
  );

  useEffect(() => {
    if (!targetKeys.length && Object.values(list).length) {
      setTargetKeys(
        Object.values(list)
          .map((product) => {
            if (customerProductsKeysComparer.includes(product.id)) return null;
            return product.id;
          })
          .filter((productId) => productId !== null)
      );
    }
  }, [list]);

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    // console.log("targetKeys:", nextTargetKeys);
    // console.log("direction:", direction);
    // console.log("moveKeys:", moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    // console.log("sourceSelectedKeys:", sourceSelectedKeys);
    // console.log("targetSelectedKeys:", targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction, e) => {
    // console.log("direction:", direction);
    // console.log("target:", e.target);
  };

  return (
    <>
      <ProductsAccessModal
        width="80%"
        title="Products Access Manager"
        visible={productsAccessOpen}
        onCancel={() => updateProductsAccessOpen(false)}
        cancelText="Close"
        okButtonProps={{ style: { display: "none" } }}
      >
        <Transfer
          dataSource={Object.values(list).map((product) => ({
            key: product.id,
            title: product.title,
          }))}
          titles={["Owned", "All Products"]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          onScroll={onScroll}
          showSelectAll={true}
          render={(item) => item.title}
        />
      </ProductsAccessModal>
    </>
  );
}

export default Ui;
