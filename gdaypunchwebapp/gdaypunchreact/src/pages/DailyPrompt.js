import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { doGetFeaturedManga } from "actions/manga";

import { selectFeaturedManga } from "selectors/manga";

class DailyPrompt extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getFeaturedManga();
  }

  render() {
    const {} = this.props;
    const styles = getStyles();

    return (
      <div id="top" className="App">
        <div className="App-header-container app-temp-background"></div>
      </div>
    );
  }
}

function getStyles() {
  return {};
}

DailyPrompt.propTypes = {
  // Redux Properties
  featuredManga: PropTypes.array,
  // Redux Functions
  getFeaturedManga: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  featuredManga: selectFeaturedManga,
});

const mapDispatchToProps = {
  getFeaturedManga: doGetFeaturedManga,
};

export default connect(mapStateToProps, mapDispatchToProps)(DailyPrompt);
