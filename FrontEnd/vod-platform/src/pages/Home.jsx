import React from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../assets/components/dashboard";
function Home() {
    const navigate = useNavigate();
     return (
    <>
      <Dashboard />

      
      <div className="bg-gray-500 h-px w-full max-w-7xl mx-auto my-4" />

      
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-10 space-y-6">
        <h1 className="text-5xl text-white font-bold">VOD Reviews Simplified</h1>
        <p className="text-lg text-white max-w-2xl">
          Rank up or help others with our all-encompassing VOD review platform. 
          Sign up to become a coach and review other’s VODs, or become a user yourself 
          and get your VODs reviewed.
        </p>
        <div className="flex space-x-4">
          <button className="bg-teal-600 px-6 py-2 rounded hover:bg-teal-700 transition duration-200 text-white"
            onClick={() => navigate("/registration/user")}>
            Sign Up
          </button>
          <button className="bg-gray-700 px-6 py-2 rounded hover:bg-gray-800 transition duration-200 text-white"
          onClick={() => navigate("/explore")}>
            Browse VODs
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-900 py-16 px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-10">How It Works</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-teal-400 mb-2">Upload Your VOD</h3>
            <p className="text-white">Submit your gameplay clip to get feedback and insights or show off your skills.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-teal-400 mb-2">Get Reviewed</h3>
            <p className="text-white">Coaches provide timestamps, comments, and tips to help you improve.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-teal-400 mb-2">Rank & Improve</h3>
            <p className="text-white">Track your progress and climb the ranks with each review.</p>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-10">User Roles</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-teal-400 mb-2">Coaches</h3>
            <ul className="text-white list-disc list-inside">
              <li>Provide detailed reviews</li>
              <li>Earn reputation points</li>
              {/* <li>Access advanced filters and analytics</li> */}
            </ul>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-teal-400 mb-2">Users</h3>
            <ul className="text-white list-disc list-inside">
              <li>Receive feedback on your gameplay</li>
              <li>Improve your skills and track progress</li>
              <li>Interact with the community</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-gray-900 py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to Start?</h2>
        <p className="text-white mb-6 max-w-xl mx-auto">
          Join our community and start uploading or reviewing VODs today!
        </p>
        <button className="bg-teal-600 px-8 py-3 rounded hover:bg-teal-700 transition duration-200 text-white"
        onClick={() => navigate("/registration/user")}>
          Sign Up Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 px-4 text-center text-white">
        <p>&copy; 2025 VOD Review Platform. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Home;
