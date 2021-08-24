import React from "react";
import classNames from "classnames";
import { Alert } from "antd";

import { phoneValidator } from "utils/utils";

function Ui(props) {
  const { addressForm, updateAddressForm, type } = props;

  const formTypes = {
    shipping: "shipping",
    billing: "billing",
  };

  const handleUpdateAddressForm = (field, e) => {
    // Value
    let value = e.target.value;

    // Error
    const empty = !value.length;
    let validator = undefined;

    if (field === "phone") {
      validator = phoneValidator;
    }

    const invalid = !empty && validator && !validator(value);

    let currentError = empty ? "empty" : undefined;
    currentError = invalid ? "invalid-format" : currentError;

    if (field === "province") {
      const select = e.target;
      value = select.options ? select.options[select.selectedIndex].text : "-";

      return updateAddressForm({
        ...addressForm,
        [field]: {
          value,
          error: currentError,
          code: select.value,
        },
      });
    }

    return updateAddressForm({
      ...addressForm,
      [field]: {
        value,
        error: currentError,
      },
    });
  };

  return (
    <form
      id={`${formTypes[type]}-address-root`}
      data-address={`address-form-root`}
    >
      <div
        className={classNames("form-field", addressForm.email.error)}
        data-line-count="1"
      >
        <label>Email</label>
        <input
          type="text"
          id="AddressEmail"
          name="address[email]"
          value={addressForm.email.value}
          onChange={(e) => handleUpdateAddressForm("email", e)}
        />
        <Alert
          className="invalid-message"
          message="Enter an email address"
          type="error"
        />
      </div>

      <div
        className={classNames("form-field", addressForm.firstName.error)}
        data-line-count="2"
      >
        <label htmlFor="AddressFirstName">First Name</label>
        <input
          type="text"
          id="AddressFirstName"
          name="address[first_name]"
          value={addressForm.firstName.value}
          onChange={(e) => handleUpdateAddressForm("firstName", e)}
        />
        <Alert
          className="invalid-message"
          message="Enter a first name"
          type="error"
        />
      </div>

      <div
        className={classNames("form-field", addressForm.lastName.error)}
        data-line-count="2"
      >
        <label htmlFor="AddressLastName">Last Name</label>
        <input
          type="text"
          id="AddressLastName"
          name="address[last_name]"
          value={addressForm.lastName.value}
          onChange={(e) => handleUpdateAddressForm("lastName", e)}
        />
        <Alert
          className="invalid-message"
          message="Enter a last name"
          type="error"
        />
      </div>

      <div
        className="form-field"
        data-aria-hidden={addressForm.company ? "true" : "false"}
        data-line-count="1"
      >
        <label htmlFor="AddressCompany">Company</label>
        <input
          type="text"
          id="AddressCompany"
          name="address[company]"
          value={addressForm.company ? addressForm.company.value : ""}
          onChange={(e) => handleUpdateAddressForm("company", e)}
        />
      </div>

      <div
        className={classNames("form-field", addressForm.address1.error)}
        data-line-count="1"
      >
        <label htmlFor="AddressAddress1">Address Line 1</label>
        <input
          type="text"
          id="AddressAddress1"
          name="address[address1]"
          value={addressForm.address1.value}
          onChange={(e) => handleUpdateAddressForm("address1", e)}
        />
        <Alert
          className="invalid-message"
          message="Enter an address"
          type="error"
        />
      </div>

      <div className="form-field" data-line-count="1">
        <label htmlFor="AddressAddress2">Address Line 2</label>
        <input
          type="text"
          id="AddressAddress2"
          name="address[address2]"
          value={addressForm.address2.value}
          onChange={(e) => handleUpdateAddressForm("address2", e)}
        />
      </div>

      <div
        className={classNames("form-field", addressForm.city.error)}
        data-line-count="1"
      >
        <label htmlFor="AddressCity">City</label>
        <input
          type="text"
          id="AddressCity"
          name="address[city]"
          value={addressForm.city.value}
          onChange={(e) => handleUpdateAddressForm("city", e)}
        />
        <Alert
          className="invalid-message"
          message="Enter a city"
          type="error"
        />
      </div>

      <div
        className={classNames("form-field", addressForm.country.error)}
        data-line-count="3"
      >
        <label htmlFor="AddressCountry">Country</label>
        <select
          id="AddressCountry"
          name="address[country]"
          data-default={addressForm.country.value}
          onChange={(e) => handleUpdateAddressForm("country", e)}
        >
          <option value="AU">Australia</option>
          <option value="US">United States</option>
          <option value="NZ">New Zealand</option>
          <option value="JP">Japan</option>
          <option value="GB">United Kingdom</option>
          <option disabled>_ _ _ _ _ _ _ _ _</option>
        </select>
        <Alert
          className="invalid-message"
          message="Select a country"
          type="error"
        />
      </div>

      <div
        className={classNames("form-field", addressForm.province.error)}
        data-line-count="3"
      >
        <label htmlFor="AddressProvince">Province</label>
        <select
          id="AddressProvince"
          name="address[province]"
          value={addressForm.province.code || addressForm.province.value}
          data-default={addressForm.province.code}
          onMouseUp={(e) => handleUpdateAddressForm("province", e)}
          onChange={(e) => {
            handleUpdateAddressForm("province", e);
          }}
        ></select>
        <Alert
          className="invalid-message"
          message="Select an option"
          type="error"
        />
      </div>

      <div
        className={classNames("form-field", addressForm.postcode.error)}
        data-line-count="3"
      >
        <label htmlFor="AddressZip">Post Code</label>
        <input
          type="text"
          id="AddressZip"
          name="address[zip]"
          value={addressForm.postcode.value}
          onChange={(e) => handleUpdateAddressForm("postcode", e)}
        />
        <Alert
          className="invalid-message"
          message="Enter a post/zip code"
          type="error"
        />
      </div>

      <div
        className={classNames("form-field", addressForm.phone.error)}
        data-line-count="1"
      >
        <label htmlFor="AddressPhone">Phone</label>
        <input
          type="tel"
          id="AddressPhone"
          name="address[phone]"
          value={addressForm.phone.value}
          onChange={(e) => handleUpdateAddressForm("phone", e)}
        />
        <Alert
          className="invalid-message"
          message="Please enter a valid phone number"
          type="error"
        />
      </div>
    </form>
  );
}

export default Ui;
