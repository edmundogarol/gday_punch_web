import React, { useEffect } from "react";

export const useScrollTop = () => {
  useEffect(() => {
    console.log("SCROLLING TO TOP");
    window.scrollTo(0, 0);
  }, []);
};
