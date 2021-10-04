import React, { useEffect, useState } from "react";
import { Transfer, Modal, Button, Input, Typography, message } from "antd";
import { set, unset } from "lodash";
import {
  ClockCircleOutlined as PendingIcon,
  CheckCircleOutlined as PurchasedIcon,
  PlayCircleOutlined as ShippedIcon,
  InfoCircleOutlined as RefundedIcon,
  CloseCircleOutlined as DeclinedIcon,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { arrayIdsMapToObject, getGdayPunchStaticUrl } from "utils/utils";
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
    updateCustomerAccessProducts,
  } = props;
  const [initialTargetKeys, setInitialTargetKeys] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const customerProductsKeys = customerProducts.map((product) => product.id);

  let allProductsMapped = {
    ...list,
    ...arrayIdsMapToObject(customerProducts),
  };

  const allProductsData = Object.values(allProductsMapped).map((product) => ({
    ...product,
    key: product.id,
  }));

  useEffect(() => {
    if (
      !targetKeys.length &&
      !initialTargetKeys.length &&
      Object.values(list).length
    ) {
      const incomingTargetKeys = Object.values(list)
        .map((product) => {
          if (customerProductsKeys.includes(product.id)) return null;
          return product.id;
        })
        .filter((productId) => productId !== null);

      setTargetKeys(incomingTargetKeys);
      setInitialTargetKeys(incomingTargetKeys);
    }
  }, [list]);

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    moveKeys.map((key) => {
      if (direction === "right") {
        if (!allProductsMapped[key].granting) {
          set(allProductsMapped[key], "removing", true);
        } else {
          unset(allProductsMapped[key], "granting");
        }
      } else if (direction === "left") {
        if (!allProductsMapped[key].removing) {
          set(allProductsMapped[key], "granting", true);
        } else {
          unset(allProductsMapped[key], "removing");
        }
      }
    });
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return (
    <>
      <ProductsAccessModal
        width="80%"
        title="Products Access Manager"
        visible={productsAccessOpen}
        onCancel={() => updateProductsAccessOpen(false)}
        okText="Save"
        onOk={() => {
          updateCustomerAccessProducts(allProductsMapped);
        }}
        cancelText="Close"
        okButtonProps={{
          disabled: initialTargetKeys.toString() === targetKeys.toString(),
        }}
      >
        <Transfer
          dataSource={allProductsData}
          titles={["Owned", "All Products"]}
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
