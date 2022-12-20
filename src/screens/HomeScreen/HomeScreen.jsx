import React from "react";
import { Link } from "react-router-dom";
import "./HomeScreen.css";

const HomeScreen = () => {
  return (
    <div className="home__wrapper">
      <Link to={"/analytics"} style={{ textDecoration: "none" }}>
        <div className="navigate__analytics">Analytics</div>
      </Link>
    </div>
  );
};

export default HomeScreen;
