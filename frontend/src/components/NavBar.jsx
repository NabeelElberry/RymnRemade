import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
export default function NavBar() {
  return (
    <div className="text-3xl absolute w-full h-auto pb-2 pt-2 inset-x-0 top-0 bg-slate-400 flex flex-row">
      <p className="pl-10 mr-auto">Rymn</p>

      <span className="flex flex-row space-x-4 pr-10">
        <Link to="/">Home</Link>
        <Link to="/profileManagement">Profile Management</Link>
        <Link to="/termManagement">Term Management</Link>
        <Link to="/reviewTerms">Review Terms</Link>
        <Link to="/viewTerms">View Terms</Link>
        <Link to="/viewStats">Statistics</Link>
      </span>
    </div>
  );
}
