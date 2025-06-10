import React from "react";

const Message = (props) => {
  return (
    <div className="container my-2">
      <div className="card shadow-sm">
        <div className="card-body d-flex align-items-center">
          {props.speaks === "bot" && (
            <div className="me-3">
              <div
                className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "50px", height: "50px" }}
              >
                {props.speaks}
              </div>
            </div>
          )}
          <div className="flex-grow-1">
            <p className="mb-0">{props.text}</p>
          </div>
          {props.speaks === "me" && (
            <div className="ms-3">
              <div
                className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "50px", height: "50px" }}
              >
                {props.speaks}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
