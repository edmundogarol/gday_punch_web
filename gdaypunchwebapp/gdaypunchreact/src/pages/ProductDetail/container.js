import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { selectViewingProductState } from "selectors/app";
import { selectHomeProductList } from "selectors/home";
import {
  fetchViewingProduct as fetchViewingProductAction,
  setViewingProduct as setViewingProductAction,
} from "actions/products";

import Ui from "./ui";

const mapState = createStructuredSelector({
  viewingProductState: selectViewingProductState,
  productList: selectHomeProductList,
});

const mapDispatch = {
  fetchViewingProduct: fetchViewingProductAction,
  setViewingProduct: setViewingProductAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
