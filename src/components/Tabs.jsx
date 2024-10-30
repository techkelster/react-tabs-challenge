import React, { useState, useEffect } from "react";

const Tabs = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CACHE_KEY = "tabsContent";
  const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

  useEffect(() => {
    const fetchTabsContent = async () => {
      // Check for cached data
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setTabs(data);
          setLoading(false);
          return;
        }
      }

      // Fetch new data if cache is expired or missing
      try {
        const responses = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/posts/1"),
          fetch("https://jsonplaceholder.typicode.com/posts/2"),
          fetch("https://jsonplaceholder.typicode.com/posts/3"),
          fetch("https://jsonplaceholder.typicode.com/posts/4"),
        ]);

        const tabsContent = await Promise.all(
          responses.map(async (response, index) => {
            const data = await response.json();
            return {
              title: `Tab ${index + 1}`,
              content: data.body,
            };
          })
        );

        console.log("here is", tabsContent);

        // Store data in localStorage
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: tabsContent, timestamp: Date.now() })
        );

        setTabs(tabsContent);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tab content:", err);
        setError("Failed to load content. Please try again later.");
        setLoading(false);
      }
    };

    fetchTabsContent();
  }, [CACHE_EXPIRY]);

  const handleTabClick = (index) => setActiveTab(index);

  return (
    <div className="container">
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab ${index === activeTab ? "active" : ""}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div>
            <h1 className="tab-title">Title {activeTab + 1}</h1>
            <div>{tabs[activeTab]?.content}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
