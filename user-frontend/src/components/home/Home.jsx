
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className="bg-white shadow-sm rounded-2xl p-10 max-w-lg w-full text-center border border-slate-200">
           <Helmet>
                        <title>Home - FancyStore</title>
                        <meta name="description" content="Welcome to the FancyStore admin panel" />
                        <link rel="canonical" href={window.location.href} />
                      </Helmet>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
          Welcome Home
        </h1>
        <p className="text-slate-500 text-lg mb-6">
          This is your home page. You can customize it as you like!
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-sm"
        >
          Explore Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;

