import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Groups from "../pages/Groups";
import Matches from "../pages/Matches";
import Standings from "../pages/Standings";
import Knockout from "../pages/Knockout";
import Stats from "../pages/Stats";
import Results from "../pages/Results";
import Navbar from "../components/Navbar";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/knockout" element={<Knockout />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}