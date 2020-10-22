import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <div className="footer">
      <div className="contact-us">
        <p>For more information contact:</p>
        <p>info@gdaypunch.com</p>
        <a href="http://gdaypunch.com/"><p className="website">www.gdaypunch.com</p></a>
      </div>
      <div className="socials">
        <a className="fb-hover" href="https://www.facebook.com/gdaypunch/">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a className="ig-hover" href="https://instagram.com/gdaypunch">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a className="yt-hover" href="https://www.youtube.com/channel/UCB-PQXOoSCUzhOAkOUu_QQQ">
          <FontAwesomeIcon icon={faYoutube} />
        </a>
        <a className="tw-hover" href="https://twitter.com/gdaymanga">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      </div>
      <div className="copyright">
        © COPYRIGHT 2019 GDAY PUNCH. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}
