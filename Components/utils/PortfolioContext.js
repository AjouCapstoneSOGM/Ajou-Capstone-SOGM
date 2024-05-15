import React, { createContext, useContext, useState, useEffect } from "react";
import urls from "./urls";
import GetCurrentPrice from "./GetCurrentPrice";
import { useAuth } from "./AuthContext";
import { getUsertoken } from "./localStorageUtils";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [portLoading, setPortLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  const fetchPortfolios = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/portfolio`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPortfolios(data);
        return data;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getPortfolioIds = (portfolioList) => {
    result = portfolioList.map((portfolio) => {
      return portfolio.id;
    });
    return result;
  };

  const fetchAllStocks = async (portfolioIds) => {
    const promises = portfolioIds.map((id) => {
      return fetchStocksByPortfolioId(id);
    });
    const portfoliosWithStocks = await Promise.all(promises);
    return portfoliosWithStocks;
  };

  const fetchStocksByPortfolioId = async (id) => {
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/portfolio/${id}/performance`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const stocks = await response.json();

      if (response.ok) {
        const sortedStocks = sortStocks(stocks.portfolioPerformances);
        return {
          currentCash: stocks.currentCash,
          stocks: sortedStocks,
        };
      } else {
        console.log(stocks);
      }
    } catch (error) {
      console.error("Could not fetch stocks for portfolio:", id, error);
      return {
        currentCash: 0,
        stocks: [],
      };
    }
  };

  const sortStocks = (stocks) => {
    const sortedStocks = stocks.sort(
      (a, b) => b.averageCost * b.quantity - a.averageCost * a.quantity
    );
    return sortedStocks;
  };

  const fetchAllCurrent = async (portfoliosWithStocks) => {
    const result = await Promise.all(
      portfoliosWithStocks.map((portfolio) => {
        return fetchCurrentPrice(portfolio);
      })
    );
    return result;
  };

  const fetchCurrentPrice = async (portfolio) => {
    const result = await Promise.all(
      portfolio.stocks.map((stocks) => {
        return GetCurrentPrice(stocks.ticker);
      })
    );
    portfolio.stocks.forEach((stocks, index) => {
      if (result[index] && result[index].currentPrice) {
        stocks.currentPrice = result[index].currentPrice;
      } else {
        console.log(
          `No current price data available for stock at index ${index}`
        );
      }
    });
    return portfolio;
  };

  const fetchDelete = async (id) => {
    setPortLoading(true);
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/portfolio/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPortfolios(portfolios.filter((portfolio) => portfolio.id !== id));
        setPortLoading(false);
        return true;
      } else {
        console.log(response.status);
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };

  const fetchUserInfo = async (userInfo) => {
    setPortLoading(true);
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/portfolio/create/auto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            country: "KOR",
            sector: [userInfo.interest],
            asset: userInfo.amount,
            riskValue: userInfo.riskLevel,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
    await loadData();
  };

  const fetchModify = async (rebalances, portId, rnId) => {
    setPortLoading(true);
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/rebalancing/${portId}/${rnId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rnList: rebalances }),
        }
      );
      if (response.ok) {
      } else {
        console.log(response.status);
        setPortLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
    await loadData();
  };

  const getPortfolioById = (id) => {
    return portfolios.find((portfolio) => portfolio.id === id);
  };

  const loadData = async () => {
    const data = await fetchPortfolios();
    const portfolioList = data.portfolios;
    const portfolioIds = getPortfolioIds(portfolioList);
    const portfolioStocks = await fetchAllStocks(portfolioIds);
    const stocksWithCurrent = await fetchAllCurrent(portfolioStocks);
    portfolioList.forEach((portfolio, index) => {
      portfolio.detail = stocksWithCurrent[index];
    });
    setPortfolios(portfolioList);
    setPortLoading(false);
  };

  useEffect(() => {
    setPortLoading(true);
    if (isLoggedIn) loadData();
  }, [isLoggedIn]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        fetchPortfolios,
        fetchDelete,
        fetchUserInfo,
        getPortfolioById,
        fetchModify,
        portLoading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
export const usePortfolio = () => useContext(PortfolioContext);
