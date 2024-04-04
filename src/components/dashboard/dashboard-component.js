import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./dashboard-component.css";
import Loader from "../loader/loader";
import { toast } from "react-toastify";
import "../progress-bar/progress-bar.scss";
import gemImage from "../../images/gem.png";
import potionImage from "../../images/potion.png";

function numberWithCommas(number) {
  if (typeof number === "string") {
    return number;
  }
  if (typeof number === "boolean") {
    return number ? "yes" : "no";
  }
  // Remove decimal part if it exists
  number = Math.floor(number);

  // Convert number to string and add commas
  return number.toString().replace(/\d(?=(\d{3})+$)/g, "$&,");
}

const NumberBlock = ({
  label,
  value,
  dashboardState,
  gemCount,
  potionCount,
}) => {
  return (
    <div className="number-block border-gray">
      <span className="text-lg dashboard-label">
        <span>{label}&nbsp;</span>
      </span>
      {label === "boosting" || label === "boosters" ? (
        <div className="dashboard-icon-container">
          <div className="dashboard-icon-item">
            <img src={gemImage} alt="gem"></img>
            <span> {gemCount} |&nbsp;</span>
          </div>
          <div className="dashboard-icon-item">
            <img src={potionImage} alt="potion"></img>
            <span>{potionCount}</span>
          </div>
        </div>
      ) : (
        <p className="text-base">{numberWithCommas(value)}</p>
      )}
    </div>
  );
};

const dummyLabels = ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"];
const dummy_data_global = [
  { type: "global", label: "mined", value: "-" },
  { type: "global", label: "holders", value: "-" },
  { type: "global", label: "boosting", value: "-" },
  { type: "global", label: "avg per block", value: "-" },
  { type: "global", label: "avg per wallet", value: "-" },
  { type: "global", label: "avg per miner", value: "-" },
];

const dummy_data_inscription = [
  { type: "global", label: "inscription1", value: "-" },
  { type: "global", label: "inscription1", value: "-" },
  { type: "global", label: "inscription1", value: "-" },
  { type: "global", label: "inscription1", value: "-" },
  { type: "global", label: "inscription1", value: "-" },
  { type: "global", label: "inscription1", value: "-" },
  { type: "global", label: "miner", value: "-" },
];
const dummy_data_wallet = [
  { type: "global", label: "Wallet1", value: "-" },
  { type: "global", label: "Wallet1", value: "-" },
  { type: "global", label: "Wallet1", value: "-" },
  { type: "global", label: "Wallet1", value: "-" },
  { type: "global", label: "Wallet1", value: "-" },
  { type: "global", label: "wallet", value: "-" },
];

const DashboardComponent = () => {
  const [dashboardState, setDashboardState] = useState("global");
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardData, setDashboardData] = useState(dummy_data_global);
  const [percentage, setPercentage] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [toggleInfo, setToggleInfo] = useState(false);
  const [blockNumber, setBlockNumber] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef(null);

  const checkIsMobile = () => {
    setIsMobile(window.innerWidth < 600); // Adjust the width value as needed
  };

  useEffect(() => {
    checkIsMobile();
    fetchHoldersData();
    window.addEventListener("resize", checkIsMobile);
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setError(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Remove event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const fetchHoldersData = async () => {
    const setData = async (res) => {
      const response = await res;
      const data = [];
      data.push({
        label: "total mined",
        value: response["data"]["total_runes_mined"],
        gemCount: null,
        potionCount: null,
      });
      data.push({
        label: "holders",
        value: response["data"]["total_wallets"],
        gemCount: null,
        potionCount: null,
      });
      data.push({
        label: "boosting",
        value: null,
        gemCount: response["data"]["booster"]["rarity"],
        potionCount: response["data"]["booster"]["juggernaut"],
      });
      data.push({
        label: "avg per block",
        value: response["data"]["total_runes_mined"],
        gemCount: null,
        potionCount: null,
      });
      data.push({
        label: "avg per wallet",
        value: response["data"]["avg_runes_per_wallet"],
        gemCount: null,
        potionCount: null,
      });
      data.push({
        label: "avg per miner",
        value: response["data"]["avg_runes_per_miner"],
        gemCount: null,
        potionCount: null,
      });
      return data;
    };
    const getPercentage = (response) => {
      return (
        ((response["data"]["last_updated_block"] -
          response["data"]["block_range"][0]) /
          (response["data"]["block_range"][1] -
            response["data"]["block_range"][0])) *
        100
      ).toFixed(2);
    };
    setLoading(true);
    try {
      const response = await axios.get("https://nodeape-api.onrender.com/api/");
      setBlockNumber(await response["data"]["last_updated_block"]);
      const data = await setData(response);
      setDashboardData(data);
      setDashboardState("global");
      const percentageValue = await getPercentage(response);
      setPercentage(percentageValue);
      const remainingDaysValue = (
        (response["data"]["block_range"][1] -
          response["data"]["last_updated_block"]) /
        144
      ).toFixed();
      setRemainingDays(remainingDaysValue);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching numbers:", error);
    }
  };

  const handleSearch = async (query) => {
    if (!searchQuery.trim()) {
      setError(true);
      return;
    }

    const setWalletData = async (res) => {
      const response = await res;
      const data = [];
      data.push({
        label: "mined",
        value: response["data"]["data"]["runes"],
        gemCount: null,
        potionCount: null,
      });
      data.push({
        label: "claimed",
        value: response["data"]["data"]["claimedRunes"],
        gemCount: null,
        potionCount: null,
      });
      data.push({
        label: "boosters",
        value: null,
        gemCount: response["data"]["data"]["booster"]["rarity"],
        potionCount: response["data"]["data"]["booster"]["juggernaut"],
      });
      data.push({
        label: "apes",
        value: response["data"]["data"]["apes"],
        gemCount: null,
        potionCount: null,
      });
      data.push({
        label: "miners",
        value: response["data"]["data"]["miners"],
        gemCount: null,
        potionCount: null,
      });
      data.push({
        label: "$cybd",
        value: response["data"]["data"]["cbrc"],
        gemCount: null,
        potionCount: null,
      });
      data.push({
        label: "wallet address",
        value: response["data"]["data"]["id"],
        gemCount: null,
        potionCount: null,
      });
      return data;
    };

    const setMinerData = async (res) => {
      const response = await res;
      const data = [];
      data.push({
        label: "mined",
        value: response["data"]["data"]["runes"],
        gemCount: null,
        potionCount: null,
      });
      data.push({
        label: "claimed",
        value: response["data"]["data"]["isClaimed"],
        gemCount: null,
        potionCount: null,
      });
      data.push({
        label: "rank",
        value: response["data"]["data"]["rank"],
        gemCount: null,
        potionCount: null,
      });
      data.push({
        label: "inscription id",
        value: response["data"]["data"]["id"],
        gemCount: null,
        potionCount: null,
      });
      return data;
    };
    setLoading(true);
    try {
      const response = await axios.get(
        `https://nodeape-api.onrender.com/api/${searchQuery}`
      );
      if (response["data"]["key"] === "wallet") {
        setDashboardState("wallet");
        setDashboardData(await setWalletData(response));
        toast.success("Wallet stats fetched sucessfully");
      } else if (response["data"]["key"] === "miner") {
        setDashboardState("miner");
        setDashboardData(await setMinerData(response));
        toast.success("Miner stats fetched sucessfully");
      } else {
        console.error("Error searching:", "Wrong Input");
      }
    } catch (error) {
      if (searchQuery.startsWith("bc1p")) {
        toast.error("Cannot find wallet address");
      } else {
        toast.error("Cannot find inscription id");
      }

      fetchHoldersData();
      setDashboardState("global");
    }
    setSearchQuery("");
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="dashboard border-gray  backdrop-filter backdrop-blur-md">
        <div className="dashboard-heading text-center text-3xl md:text-4xl lg:text-4xl">
          🔨 RUNES MINING DASHBOARD 🔨
        </div>
        <div className="dashboard-heading-2 text-center text-2xl">
          <span>🔨 RUNES MINING 🔨</span>
          <span>DASHBOARD </span>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div>
            {" "}
            <div class="progress-bar-container mb-8 border-b-2 border-double pb-8 ">
              <div className="progress-heading  mb-1">
                <div className="countdown-label">
                  <span className="countdown-heading-1">
                    countdown to halving{" "}
                  </span>
                  <span className="countdown-heading-2">to halving </span>
                  <span className="remaining-days">
                    {" "}
                    [~{remainingDays} days remaining]
                  </span>
                </div>
                <div className="days-label">[{blockNumber}/840000]</div>
              </div>
              <div class="progress progress-striped active-bar border-gray">
                <div
                  role="progressbar progress-striped"
                  style={{ width: `${percentage}%` }}
                  class="progress-bar"
                >
                  <span>{percentage}%</span>
                </div>
              </div>
            </div>
            <div className="search-container ">
              <input
                ref={inputRef}
                type="text"
                className={error ? "search-input error" : "search-input"}
                placeholder="search your taproot wallet address or miner inscription id..."
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setError(false);
                }}
              />
              <button
                className="switch-button font-bold border-gray"
                onClick={() => handleSearch(searchQuery)}
              >
                check
              </button>
            </div>
            <div className="info-container text-2xl">
              {dashboardState === "global"
                ? "runes: all stats"
                : dashboardState === "wallet"
                ? "runes: wallet stats"
                : "runes: miner stats"}
            </div>
            <div className="numbers-container ">
              {dashboardData.map((item, index) => (
                <NumberBlock
                  key={index}
                  label={item["label"]}
                  value={item["value"]}
                  gemCount={item["gemCount"]}
                  potionCount={item["potionCount"]}
                  dashboardState={dashboardState}
                />
              ))}
            </div>
            {dashboardState === "wallet" ? (
              <div className="claim-container mt-4">
                <button className="btn-claim text-2xl font-bold" disabled>
                  claim ᚱunes
                  <span className="tooltip absolute bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    claim will open after bitcoin halving
                  </span>
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
      {dashboardState === "wallet" ? (
        <div class="accordion-container">
          <button
            class={`accordion sm:text-xl md:text-2xl  lg:text-2xlfont-large ${
              toggleInfo ? "active" : ""
            }`}
            onClick={() => {
              setToggleInfo(!toggleInfo);
            }}
          >
            miner timeline
          </button>
          <div
            className={`panel ${toggleInfo ? "display-block" : "display-none"}`}
          >
            this feature is coming soon...
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default DashboardComponent;
