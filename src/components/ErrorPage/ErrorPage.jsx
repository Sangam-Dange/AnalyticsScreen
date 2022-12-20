import React from "react";
import "./ErrorPage.css";
import errorSvg from "../../assets/error.svg";
const ErrorPage = () => {
  return (
    <div className="error__wrapper">
      <div className="inner__div">
        <img src={errorSvg} alt="error svg" />
        <div>
          <h2>
            Hey! Something’s off! <br />
            We couldn’t display the given data.
          </h2>
          <p>Try changing your your filters or selecting a different date.</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
