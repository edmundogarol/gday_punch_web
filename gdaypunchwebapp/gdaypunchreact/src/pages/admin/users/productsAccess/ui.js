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
import { ModalItemSummary } from "pages/Admin/orders/orderDetails/styles";

const { confirm } = Modal;
const { TextArea } = Input;
const { Title } = Typography;

function Ui(props) {
  const {
    customerId,
    customerProducts,
    productsSimpleState: { list },
    productsAccessOpen,
    updateProductsAccessOpen,
    updateCustomerAccessProducts,
  } = props;
  const [initialTargetKeys, setInitialTargetKeys] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [summaryNotes, updateSummaryNotes] = useState(undefined);
  const customerProductsKeys = customerProducts.map((product) => product.id);
  const summaryNotesRef = React.useRef(summaryNotes);

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

  useEffect(() => {
    summaryNotesRef.current = summaryNotes;
  }, [summaryNotes]);

  const saveAndEmailSummary = () => {
    confirm({
      title: "Save access updates and email customer?",
      icon: <ExclamationCircleOutlined />,
      content: (
        <ModalItemSummary>
          {"Confirm updated accesses."}
          <div>
            {Object.values(allProductsMapped)
              .filter((product) => product.removing || product.granting)
              .map((product) => (
                <p key={product.id}>{`- ${product.title}: ${
                  product.removing
                    ? "Removing"
                    : product.granting
                    ? "Granting"
                    : ""
                }`}</p>
              ))}
          </div>
          <div>
            {"Provide any notes for access update."}
            <div>
              <TextArea
                rows={10}
                showCount
                maxLength={500}
                value={summaryNotes}
                onChange={(e) => updateSummaryNotes(e.target.value)}
                placeholder="Enter access update notes."
              />
            </div>
          </div>
        </ModalItemSummary>
      ),
      onOk() {
        updateCustomerAccessProducts(
          customerId,
          Object.values(allProductsMapped),
          true,
          summaryNotesRef.current
        );
        updateProductsAccessOpen(false);
      },
      onCancel() {},
    });
  };

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
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              updateProductsAccessOpen(false);
            }}
          >
            Cancel
          </Button>,
          <Button
            disabled={initialTargetKeys.toString() === targetKeys.toString()}
            type="primary"
            key="save-email"
            onClick={() => saveAndEmailSummary()}
          >
            Save and Email
          </Button>,
          <Button
            disabled={initialTargetKeys.toString() === targetKeys.toString()}
            type="primary"
            key="save"
            onClick={() => {
              updateCustomerAccessProducts(
                customerId,
                Object.values(allProductsMapped)
              );
              updateProductsAccessOpen(false);
            }}
          >
            Save
          </Button>,
        ]}
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
