import React, { useState } from "react";
import AWS from "aws-sdk";
import "./Login.css";

// Cognito configuration
AWS.config.region = "us-east-1"; // Replace with your region
const cognito = new AWS.CognitoIdentityServiceProvider();
const clientId = "4p9udg72onl3movcn1cjd78llg"; // Replace with your Client ID

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { email, password } = event.target.elements;

    if (!email.value || !password.value) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const authParams = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: {
          USERNAME: email.value,
          PASSWORD: password.value,
        },
      };

      const result = await cognito.initiateAuth(authParams).promise();
      console.log("Login success:", result);

      // Save token and redirect
      localStorage.setItem("idToken", result.AuthenticationResult.IdToken);
      window.location.href = "/home";
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = "An error occurred during login.";
      if (err.code === "UserNotFoundException") {
        errorMessage = "User does not exist.";
      } else if (err.code === "NotAuthorizedException") {
        errorMessage = "Incorrect username or password.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>LevelUp</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input type="email" name="email" required placeholder="Email" />
        </div>
        <div className="input-group">
          <input type="password" name="password" required placeholder="Password" />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? <div className="spinner" /> : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default Login;