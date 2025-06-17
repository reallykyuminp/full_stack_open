const Notification = ({ message }) => {
  if (message.content === null) {
    return null;
  }

  const successMessageStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  const errorMessageStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  if (message.isSuccess) {
    return <div style={successMessageStyle}>{message.content}</div>;
  } else {
    return <div style={errorMessageStyle}>{message.content}</div>;
  }
};

export default Notification;
