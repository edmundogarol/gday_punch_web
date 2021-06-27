import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import Header from "components/header";
import Login from "components/login";
import MangaTile from "components/mangaTile";

import { App, FeaturedMangaSection } from "./styles";
import PaymentForm from "components/paymentForm";

class Ui extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getFeaturedManga();
  }

  render() {
    const {
      loggedIn,
      loginView,
      openRegister,
      suggestRegister,
      featuredManga,
      likeManga,
    } = this.props;

    return (
      <App id="top" className="App">
        <div className="App-header-container app-temp-background">
          <Header loginView={loginView} />
          <Login />
        </div>
        <FeaturedMangaSection>
          {!isEmpty(featuredManga) &&
            featuredManga.map((manga) => {
              return manga ? (
                <MangaTile
                  key={manga.id}
                  manga={manga}
                  loggedIn={loggedIn}
                  likeManga={likeManga}
                  openRegister={openRegister}
                  suggestRegister={suggestRegister}
                />
              ) : null;
            })}
        </FeaturedMangaSection>
      </App>
    );
  }
}

Ui.propTypes = {
  // Redux Properties
  loggedIn: PropTypes.bool.isRequired,
  loginView: PropTypes.bool.isRequired,
  featuredManga: PropTypes.array,
  // Redux Functions
  openRegister: PropTypes.func.isRequired,
  suggestRegister: PropTypes.func.isRequired,
  getFeaturedManga: PropTypes.func.isRequired,
  likeManga: PropTypes.func.isRequired,
};

export default Ui;
