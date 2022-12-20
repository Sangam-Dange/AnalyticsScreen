import "./App.css";

import AnalyticsScreen from "./screens/AnalyticsScreen/AnalyticsScreen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen/HomeScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/analytics">
          <Route
            path="from=:start&to=:end&columns=:dimensions"
            element={<AnalyticsScreen />}
          />
          <Route path="from=:start&to=:end" element={<AnalyticsScreen />} />

          <Route path="" element={<AnalyticsScreen />} />
        </Route>
        <Route path="/" element={<HomeScreen />} exact />
      </Routes>
    </Router>
  );
}

export default App;
