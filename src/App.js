import "./App.css";
import DashboardComponent from "./components/dashboard/dashboard-component";
import React, { useState, useEffect } from "react";
import x from "./x.png";
import logo from "./logo.png";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  const [animateHeading, setAnimateHeading] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  // useEffect(() => {
  //   // Trigger animation on component mount
  //   setAnimateHeading(true);

  //   // Clean up animation class after animation duration (1s)
  // }, []);
  return (
    <div className="App">
      <nav class="w-full backdrop-filter backdrop-blur-md sticky z-50 top-0">
        <div class="flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="https://www.sendnodeapes.com/" class="flex nav-button">
            <img
              src={logo}
              class="h-10 "
              style={{ "margin-left": "12px", "border-radius": "4px" }}
              alt="logo"
            />
          </a>
          <div class="loader" style={{ "margin-top": "10px" }}></div>
          <div className="icons-container">
            <div className="leaderboard-button">
              <svg
                fill="#ffffff"
                width="35px"
                height="35px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6.5,12h-4a.5.5,0,0,0-.5.5V20H7V12.5A.5.5,0,0,0,6.5,12Z" />
                <path d="M14,4H10a.5.5,0,0,0-.5.5V20h5V4.5A.5.5,0,0,0,14,4Z" />
                <path d="M21.5,8h-4a.5.5,0,0,0-.5.5V20h5V8.5A.5.5,0,0,0,21.5,8Z" />
              </svg>
              <span className="tooltip-icon absolute bg-gray-800 text-white text-xs px-2 py-1 rounded">
                leaderboard
              </span>
            </div>
            <a
              href="https://twitter.com/thenodeapes"
              target="_blank"
              style={{ "margin-right": "12px" }}
            >
              <img
                src={x}
                alt="Twitter Logo"
                style={{
                  width: "36px",
                  height: "auto",
                  display: "block",
                  margin: "auto",
                }}
              />
            </a>
          </div>
          <div className="hamburger-menu">
            {hamburgerOpen ? (
              <span
                class="material-symbols-outlined hamburger-icon relative hamburger-menu-icon"
                onClick={() => {
                  setHamburgerOpen(false);
                }}
              >
                close
                <div className="hamburger-menu-container  text-white text-xs ">
                  <a href="https://www.sendnodeapes.com/">home</a>
                  <a href="#">leaderboard</a>
                  <a
                    href="https://twitter.com/thenodeapes"
                    target="_blank"
                    style={{ "margin-right": "12px" }}
                  >
                    <img
                      src={x}
                      alt="Twitter Logo"
                      style={{
                        width: "36px",
                        height: "auto",
                        display: "block",
                        margin: "auto",
                      }}
                    />
                  </a>
                  <div class="backdrop"></div>
                </div>
                <div class="backdrop"></div>
              </span>
            ) : (
              <span
                class="material-symbols-outlined"
                onClick={() => {
                  setHamburgerOpen(true);
                }}
              >
                menu
              </span>
            )}
          </div>
        </div>
      </nav>
      <div
        className={`main-heading text-5xl 
        `}
      >
        <b>NODEAPES</b>
      </div>
      <DashboardComponent />
      <footer class="feeter">
        <p class="text-1xl">
          {" "}
          <a href="">Made by Ordilabs 2024</a>
        </p>
      </footer>
      <ToastContainer />
    </div>
  );
}

export default App;
