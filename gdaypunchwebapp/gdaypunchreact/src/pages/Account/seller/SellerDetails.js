import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

import { message, Input, Button, Select, Checkbox, Alert } from "antd";
const { Option } = Select;

import { bankValidator, emailValidator, nameValidator } from "utils/utils";

import { SellerDetailsModal } from "./styles";
import { selectSellerState } from "selectors/account";
import { selectUser } from "selectors/app";
import LoadingSpinner from "components/loadingSpinner";
import {
  updateEditingSellerDetailsError,
  updateSellerDetails,
  submitSellerDetails,
} from "actions/seller";

function SellerDetails({ sellerDetailsOpen, toggleSellerDetailsOpen }) {
  const currentUser = useSelector(selectUser);
  const { sellerDetails, updatingSellerDetails, sellerDetailsUpdateError } =
    useSelector(selectSellerState);

  const dispatch = useDispatch();

  const handleSellerDetailsSubmit = () => {
    dispatch(
      submitSellerDetails({
        user: currentUser.id,
        paypal_email: sellerDetails.paypal_email,
        bank_acc_name: sellerDetails.bank_acc_name,
        bank_bsb: sellerDetails.bank_bsb,
        bank_acc: sellerDetails.bank_acc,
        use_paypal: sellerDetails.use_paypal,
        seller_id: currentUser.seller_id,
      })
    );
  };

  const handleSubmit = () => {
    const paypalValid = emailValidator(sellerDetails.paypal_email);
    const bankValid =
      bankValidator(sellerDetails.bank_bsb, sellerDetails.bank_acc) &&
      nameValidator(sellerDetails.bank_acc_name);

    // Client validators
    if (sellerDetails.use_paypal && !paypalValid) {
      message.error("Invalid PayPal email format.");
      dispatch(
        updateEditingSellerDetailsError(
          "Please provide a valid PayPal email address. Submitting incorrect details can cause delays or fees deducted from your payouts."
        )
      );
    } else {
      dispatch(updateEditingSellerDetailsError(undefined));
    }

    if (!sellerDetails.use_paypal && !bankValid) {
      message.error("Invalid Bank Account details");
      dispatch(
        updateEditingSellerDetailsError(
          "Please provide valid Bank details. Submitting incorrect details can cause delays or fees deducted from your payouts."
        )
      );
    } else {
      dispatch(updateEditingSellerDetailsError(undefined));
    }

    if (
      (sellerDetails.use_paypal && paypalValid && sellerDetails.agreeTerms) ||
      (!sellerDetails.use_paypal && bankValid && sellerDetails.agreeTerms)
    ) {
      handleSellerDetailsSubmit();
    }
  };

  return (
    <SellerDetailsModal
      $width="50%"
      title="Seller Details"
      visible={updatingSellerDetails || sellerDetailsOpen}
      closeable={false}
      closeIcon={<div style={{ display: "none" }} />}
      footer={[
        <Button key="cancel" onClick={() => toggleSellerDetailsOpen(false)}>
          Cancel
        </Button>,
        <Button
          loading={updatingSellerDetails}
          disabled={
            // (sellerDetails.use_paypal &&
            //   !emailValidator(sellerDetails.paypal_email)) ||
            // (!sellerDetails.use_paypal &&
            //   (!nameValidator(sellerDetails.bank_acc_name) ||
            //     !bankValidator(
            //       sellerDetails.bank_bsb,
            //       sellerDetails.bank_acc
            //     ))) ||
            !sellerDetails.agreeTerms
          }
          type="primary"
          key="save"
          onClick={() => handleSubmit()}
        >
          {sellerDetails.id ? "Update" : "Activate"}
        </Button>,
      ]}
    >
      {updatingSellerDetails && <LoadingSpinner />}
      <div className="details">
        <h4>Payment Destination</h4>
        <Select
          defaultValue={sellerDetails.use_paypal}
          value={sellerDetails.use_paypal}
          onSelect={(val) =>
            dispatch(
              updateSellerDetails({
                ...sellerDetails,
                use_paypal: val,
              })
            )
          }
        >
          <Option value={true}>PayPal Email</Option>
          <Option value={false}>Bank Account</Option>
        </Select>
        {sellerDetails.use_paypal ? (
          <>
            <h4>PayPal Email</h4>
            <Input
              placeholder="Enter PayPal Email"
              value={sellerDetails.paypal_email}
              onChange={(e) =>
                dispatch(
                  updateSellerDetails({
                    ...sellerDetails,
                    paypal_email: e.target.value,
                  })
                )
              }
            />
          </>
        ) : (
          <>
            <h4>Bank Account</h4>
            <Input
              placeholder="Enter Bank Account Name"
              value={sellerDetails.bank_acc_name}
              onChange={(e) =>
                dispatch(
                  updateSellerDetails({
                    ...sellerDetails,
                    bank_acc_name: e.target.value,
                  })
                )
              }
            />
            <Input
              placeholder="Enter Bank BSB"
              value={sellerDetails.bank_bsb}
              onChange={(e) =>
                dispatch(
                  updateSellerDetails({
                    ...sellerDetails,
                    bank_bsb: e.target.value,
                  })
                )
              }
            />
            <Input
              placeholder="Enter Bank Account"
              value={sellerDetails.bank_acc}
              onChange={(e) =>
                dispatch(
                  updateSellerDetails({
                    ...sellerDetails,
                    bank_acc: e.target.value,
                  })
                )
              }
            />
          </>
        )}
        {sellerDetailsUpdateError && (
          <Alert
            className="invalid-message"
            message={sellerDetailsUpdateError}
            type="error"
          />
        )}
        <h4>Seller Terms and Conditions</h4>
        <Checkbox
          checked={sellerDetails.agreeTerms}
          onChange={(e) =>
            dispatch(
              updateSellerDetails({
                ...sellerDetails,
                agreeTerms: e.target.checked,
              })
            )
          }
        >
          By checking and activating you are agreeing to our{" "}
          <NavLink to="/upload-conditions" target="_blank">
            Manga Upload and Selling Terms and Conditions
          </NavLink>{" "}
          to use our platform to sell your manga.
        </Checkbox>
      </div>
    </SellerDetailsModal>
  );
}

export default SellerDetails;
