import React, { createContext, useContext, useEffect, useState } from "react";
import urls from "./urls";
import GetCurrentPrice from "./GetCurrentPrice";
import { getUsertoken } from "./localStorageUtils";
import { useAuth } from "./AuthContext";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [portLoading, setPortLoading] = useState(false);
  const [rebalances, setRebalances] = useState([]);
  const [rebalanceRecodes, setrebalanceRecodes] = useState([]);
  const { isLoggedIn } = useAuth();

  const removePortfolios = () => {
    setPortfolios([]);
  };

  const fetchRebalanceList = async (pfId) => {
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/rebalancing/${pfId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.rebalancing.length > 0) {
          data.rebalancing.forEach((item) => {
            item.pfId = pfId;
            item.portfolioName = data.portfolioName;
          });
          return data.rebalancing.flat();
        }
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRebalanceRecodeList = async (pfId) => {
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/portfolioRecord/${pfId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        //console.log("Li ", data.length);
        if (data.length > 0) {
          data.forEach((item) => {
            item.pfId = pfId;
          });
          return data.flat();
        }
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChangePortName = async (pfId, name) => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/portfolio/${pfId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
        }),
      });
      if (response.ok) {
        portfolios.forEach((item) => {
          if (item.id === pfId) {
            item.name = name;
          }
        });
        return { result: "success" };
      } else {
        return { result: "fail" };
      }
    } catch (error) {
      console.error(error);
      return { result: "fail" };
    }
  };

  const fetchAllRebalances = async (portfolioIds) => {
    const promises = portfolioIds.map((id) => {
      return fetchRebalanceList(id);
    });
    const rebalancesList = await Promise.all(promises);
    return rebalancesList.flat();
  };

  const fetchAllRebalanceRecodes = async (portfolioIds) => {
    const promises = portfolioIds.map((id) => {
      return fetchRebalanceRecodeList(id);
    });
    const rebalanceRecodesList = await Promise.all(promises);
    return rebalanceRecodesList.flat();
  };

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
          initialAsset: stocks.initialAsset,
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
    const generalStocks = stocks.filter((stock) => stock.equity === "보통주");
    const otherStocks = stocks.filter((stock) => stock.equity !== "보통주");

    generalStocks.sort(
      (a, b) => b.averageCost * b.quantity - a.averageCost * a.quantity
    );

    return [...generalStocks, ...otherStocks];
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
        setRebalances(rebalances.filter((rebalance) => rebalance.pfId !== id));
        setPortLoading(false);
        return true;
      } else {
        console.log(response.status);
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
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
  };

  const getPortfolioById = (id) => {
    if (!portLoading)
      return portfolios.find((portfolio) => portfolio.id === id);
    return;
  };

  const loadData = async () => {
    setPortLoading(true);
    const portData = await fetchPortfolios();
    const portfolioList = portData.portfolios;
    const portfolioIds = getPortfolioIds(portfolioList);
    const portfolioStocks = await fetchAllStocks(portfolioIds);
    const stocksWithCurrent = await fetchAllCurrent(portfolioStocks);
    portfolioList.forEach((portfolio, index) => {
      portfolio.detail = stocksWithCurrent[index];
    });

    const rebalancesList = await fetchAllRebalances(portfolioIds);
    rebalancesList.sort(
      (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
    );

    const rebalanceRecodesList = await fetchAllRebalanceRecodes(portfolioIds);
    console.log(rebalanceRecodesList)

    setRebalances(rebalancesList);
    setrebalanceRecodes(rebalanceRecodesList);
    setPortfolios(portfolioList);
    setPortLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        rebalances,
        rebalanceRecodes,
        fetchPortfolios,
        fetchDelete,
        getPortfolioById,
        fetchModify,
        removePortfolios,
        fetchStocksByPortfolioId,
        fetchCurrentPrice,
        fetchRebalanceList,
        fetchChangePortName,
        loadData,
        portLoading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
export const usePortfolio = () => useContext(PortfolioContext);
