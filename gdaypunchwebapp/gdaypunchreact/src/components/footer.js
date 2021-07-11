import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTwitter,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <div className="footer">
      <div className="contact-us">
        <p>+61 484 575 754</p>
        <p>info@gdaypunch.com</p>
        <a href="https://www.gdaypunch.com/return-and-refund-policy.html">
          <p className="website">Refunds & Returns Policy</p>
        </a>
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
        © COPYRIGHT 2021 GDAY PUNCH. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}
