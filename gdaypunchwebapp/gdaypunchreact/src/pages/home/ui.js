import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import Header from "components/header";
import Login from "components/login";
import MangaTile from "components/mangaTile";

import { App, FeaturedMangaSection } from "./styles";
import PaymentForm from "components/paymentForm";

function Ui(props) {
  const {
    loggedIn,
    loginView,
    openRegister,
    suggestRegister,
    featuredManga,
    likeManga,
    getFeaturedManga,
  } = props;

  useEffect(() => {
    if (isEmpty(featuredManga) || !featuredManga[0]) {
      getFeaturedManga();
    }
  }, [featuredManga]);

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

export default Ui;
