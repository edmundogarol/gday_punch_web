import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import Header from "components/header";
import Login from "components/login";
import MangaTile from "components/mangaTile";

import { App, TitleImage } from "./styles";
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
    const styles = getStyles();

    return (
      <App id="top" className="App">
        <div className="App-header-container app-temp-background">
          <Header loginView={loginView} />
          <Login />
        </div>
        <div style={styles.list}>
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
        </div>
        <div style={styles.donateSection}>
          <div style={styles.artistProfile}>
            <TitleImage
              src={
                "https://gdaypunch-static.s3-us-west-2.amazonaws.com/yungy.jpg"
              }
            />
          </div>
          <div style={styles.donateContainer}>
            <h3 style={styles.donateHeader}>
              Yungy <span style={styles.donateHeaderTag}>@yungy.art</span>
            </h3>
            <h3 style={styles.donateTitle}>Support Yungy's Manga</h3>
            <h5 style={styles.donateSubTitle}>
              So he can create bigger and better projects!
            </h5>
          </div>
          <form
            action="https://www.paypal.com/donate"
            method="post"
            target="_top"
            style={styles.donateButton}
          >
            <input type="hidden" name="cmd" value="_donations" />
            <input
              type="hidden"
              name="business"
              value="edmundo.a.garol@outlook.com"
            />
            <input
              type="hidden"
              name="item_name"
              value="Supporting Yungy's Manga"
            />
            <input type="hidden" name="currency_code" value="USD" />
            <input
              type="image"
              src="https://www.paypalobjects.com/en_AU/i/btn/btn_donateCC_LG.gif"
              border="0"
              name="submit"
              title="PayPal - The safer, easier way to pay online!"
              alt="Donate with PayPal button"
              style={styles.donate}
            />
            <img
              alt=""
              border="0"
              src="https://www.paypal.com/en_AU/i/scr/pixel.gif"
              width="1"
              height="1"
            />
          </form>
        </div>
        <PaymentForm />
      </App>
    );
  }
}

function getStyles() {
  return {
    donate: {
      height: "8vh",
    },
    artistProfile: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    donateSection: {
      display: "flex",
      flexDirection: "row",
      height: "max-content",
      justifyContent: "center",
      background: "#dcdcdc",
      flexWrap: "wrap",
      paddingTop: "50px",
      paddingBottom: "50px",
    },
    donateContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "start",
      marginRight: 50,
      marginLeft: 50,
    },
    donateHeader: {
      fontSize: "1.6em",
      fontStyle: "italic",
      marginTop: "unset",
      color: "dimgrey",
      marginBottom: "0.3em",
    },
    donateHeaderTag: {
      fontSize: "0.8em",
      fontStyle: "italic",
      marginTop: "unset",
      color: "whitesmoke",
      marginBottom: "0.3em",
    },
    donateTitle: {
      fontSize: "1.3em",
      marginBottom: "unset",
      marginTop: "unset",
      letterSpacing: 1,
      color: "#1d1d1d",
      textAlign: "start",
    },
    donateSubTitle: {
      fontSize: "0.7em",
      marginTop: "unset",
      marginBottom: "1em",
      textAlign: "start",
      color: "#1d1d1d",
    },
    donateButton: {
      display: "flex",
      alignItems: "center",
    },
    list: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
    },
  };
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
