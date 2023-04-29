import React from "react";
import {
  unstable_HistoryRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Layout from "./Components/Layout";
import ChatBox from "./Components/ChatBox/ChatBox";
import Pricing from "./Components/Pricing";
import Terms from "./Components/Terms";
import Policy from "./Components/Policy";
import Contract from "./Components/Contract";
import Twitter from "./Components/Twitter";
import LogIn from "./Components/Authonication/LogIn";
import history from "./history";

const App = () => {
  return (
    <Router history={history}>
      <Layout>
        <Routes>
          <Route path="/" element={<ChatBox />} />
          <Route path="/pricing" element={<Pricing />} />{" "}
          <Route path="/terms" element={<Terms />} />{" "}
          <Route path="/policy" element={<Policy />} />{" "}
          <Route path="/contract" element={<Contract />} />
          <Route path="/twitter" element={<Twitter />} />
          <Route path="/login" element={<LogIn />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
