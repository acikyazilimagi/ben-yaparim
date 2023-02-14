import React from "react";
import style from "./Badge.module.scss";
import cs from "classnames";
import PropTypes from "prop-types";

const Badge = ({ text, status = "success" }) => {
  console.log(status);
  return <div className={cs(style.badge, style[status])}>{text}</div>;
};

Badge.propTypes = {
  status: PropTypes.oneOf(["success", "warning", "danger", "info"]),
  text: PropTypes.string.isRequired,
};

export default Badge;
