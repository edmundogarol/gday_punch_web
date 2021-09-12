import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectCouponState } from "selectors/admin";

import {
  createCoupon as createCouponAction,
  fetchCoupons as fetchCouponsAction,
} from "actions/admin";

import Ui from "./ui";

const mapState = createStructuredSelector({
  couponState: selectCouponState,
});

const mapDispatch = {
  fetchCoupons: fetchCouponsAction,
  createCoupon: createCouponAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
