import React, { useEffect } from "react";
import { Route } from "react-router-dom";

const RoutePage = ({ title, titleSetInside, ...rest }) => {
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    let fallBack = window.location.pathname.replace("/", "");
    fallBack = fallBack.length ? fallBack : "Home";

    if (!titleSetInside) {
      document.title = `${title || capitalize(fallBack)} | Gday Punch`;
    }
  });
  return <Route {...rest} />;
};

export default RoutePage;
