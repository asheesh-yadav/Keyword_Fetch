import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Rules from "./Pages/Rules";
import RuleDetails from "./Pages/RuleDetails";
import Navbar from "./components/Navbar";


function App() {
  return (
    <BrowserRouter>
         <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/rules/:id" element={<RuleDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
