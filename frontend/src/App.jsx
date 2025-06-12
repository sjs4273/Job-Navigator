// App.jsx
import React, { useState } from "react";
import Login from "./components/Login";
import Jobs from "./Jobs"; // 새로 분리할 jobs용 컴포넌트

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      {loggedIn ? (
        <Jobs />
      ) : (
        <Login onLoginSuccess={() => setLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
