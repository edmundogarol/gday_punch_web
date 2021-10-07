import React from "react";
import { withRouter, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTwitter,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <div className="footer" id="footer">
      <div className="contact-us">
        <p>+61 484 575 754</p>
        <p>info@gdaypunch.com</p>
        <NavLink target="_blank" to="/contact">
          <p className="website">Contact Us</p>
        </NavLink>
        <NavLink target="_blank" to="/conditions">
          <p className="website">Submission Conditions</p>
        </NavLink>
        <NavLink target="_blank" to="/refunds-and-returns">
          <p className="website">Refunds & Returns Policy</p>
        </NavLink>
      </div>
      <div className="socials">
        <a className="fb-hover" href="https://www.facebook.com/gdaypunch/">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a className="tiktok-hover" href="https://tiktok.com/@gdaypunch">
          <FontAwesomeIcon icon={faTiktok} />
        </a>
        <a className="ig-hover" href="https://instagram.com/gdaypunch">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          className="yt-hover"
          href="https://www.youtube.com/channel/UCB-PQXOoSCUzhOAkOUu_QQQ"
        >
          <FontAwesomeIcon icon={faYoutube} />
        </a>
        <a className="tw-hover" href="https://twitter.com/gdaymanga">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      </div>
      <div className="copyright">
        © COPYRIGHT 2021 GDAY PUNCH PTY LTD. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}

export default withRouter(Footer);
