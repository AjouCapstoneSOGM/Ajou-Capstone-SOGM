import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import urls from "./urls";
import GetCurrentPrice from "./GetCurrentPrice";
import { getUsertoken } from "./localStorageUtils";
import { useAuth } from "./AuthContext";

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({
  children,
}) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    {
      id: 0,
      name: "",
      country: "",
      isAuto: true,
      riskValue: 1,
      createdDate: new Date("2000-01-01"),
    },
  ]);
  const [portLoading, setPortLoading] = useState<boolean>(false);
  const [rebalances, setRebalances] = useState<RebalancingList[]>([
    {
      portfolioName: "",
      id: 0,
      list: [],
      createdDate: new Date("2000-01-01"),
    },
  ]);

  const [rebalanceRecords, setrebalanceRecords] = useState<
    RebalanceRecordList[]
  >([
    {
      date: new Date("2000-01-01"),
      pfId: 0,
      records: [],
    },
  ]);
  const { isLoggedIn } = useAuth();

  const removePortfolios = (): void => {
    setPortfolios([]);
  };

  const fetchRebalanceList = async (
    pfId: number
  ): Promise<RebalancingList | []> => {
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
          data.rebalancing.forEach((item: RebalancingList) => {
            item.portfolioName = data.portfolioName;
          });
          return data.rebalancing.flat();
        }
      }
    } catch (error) {
      console.error(error);
    }
    return [];
  };

  const fetchRebalanceRecordList = async (
    pfId: number
  ): Promise<RebalanceRecordList | []> => {
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
        if (data.length > 0) {
          data.forEach((item: RebalanceRecordList) => {
            item.pfId = pfId;
          });
          return data.flat();
        }
      }
    } catch (error) {
      console.error(error);
    }
    return [];
  };

  const fetchChangePortName = async (
    pfId: number,
    name: string
  ): Promise<{ result: string }> => {
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

  const fetchAllRebalances = async (
    portfolioIds: number[]
  ): Promise<RebalancingList[]> => {
    const promises = portfolioIds.map((id) => {
      return fetchRebalanceList(id);
    });
    const rebalancesList = await Promise.all(promises);
    return rebalancesList.flat();
  };

  const fetchAllRebalanceRecords = async (
    portfolioIds: number[]
  ): Promise<RebalanceRecordList[]> => {
    const promises = portfolioIds.map((id) => {
      return fetchRebalanceRecordList(id);
    });
    const rebalanceRecordsList = await Promise.all(promises);
    return rebalanceRecordsList.flat();
  };

  const fetchPortfolios = async (): Promise<Portfolio[]> => {
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
        return data.portfolios;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
    return [];
  };

  const getPortfolioIds = (portfolioList: Portfolio[]): number[] => {
    const result = portfolioList.map((portfolio) => {
      return portfolio.id;
    });
    return result;
  };

  const fetchAllStocks = async (
    portfolioIds: number[]
  ): Promise<PortfolioDetail[]> => {
    const promises = portfolioIds.map((id) => {
      return fetchStocksByPortfolioId(id);
    });
    const portfoliosWithStocks = await Promise.all(promises);
    return portfoliosWithStocks;
  };

  const fetchStocksByPortfolioId = async (
    id: number
  ): Promise<PortfolioDetail> => {
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
    }
    return {
      initialAsset: 0,
      currentCash: 0,
      stocks: [],
    };
  };

  const sortStocks = (stocks: Stock[]): Stock[] => {
    const generalStocks = stocks.filter((stock) => stock.equity === "보통주");
    const otherStocks = stocks.filter((stock) => stock.equity !== "보통주");

    generalStocks.sort(
      (a, b) => b.averageCost * b.quantity - a.averageCost * a.quantity
    );

    return [...generalStocks, ...otherStocks];
  };

  const fetchAllCurrent = async (
    portfoliosWithStocks: PortfolioDetail[]
  ): Promise<PortfolioDetail[]> => {
    const result = await Promise.all(
      portfoliosWithStocks.map((portfolio) => {
        return fetchCurrentPrice(portfolio);
      })
    );
    return result;
  };

  const fetchCurrentPrice = async (
    portfolio: PortfolioDetail
  ): Promise<PortfolioDetail> => {
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

  const fetchDelete = async (id: number): Promise<boolean> => {
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
        setRebalances(rebalances.filter((rebalance) => rebalance.id !== id));
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

  const fetchModify = async (
    rebalances: RebalancingStock,
    portId: number,
    rnId: number
  ): Promise<void> => {
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

  const getPortfolioById = (id: number): Portfolio | undefined => {
    return portfolios.find((portfolio) => portfolio.id === id);
  };

  const reloadPortfolio = async (id: number): Promise<void> => {
    const oldPortfolios = [...portfolios];
    const newPortfolioStocks = await fetchStocksByPortfolioId(id);
    const newPortfolioWithCurrent = await fetchCurrentPrice(newPortfolioStocks);
    const changedPortfolios = oldPortfolios.map((portfolio) => {
      if (portfolio.id === id) {
        return { ...portfolio, detail: newPortfolioWithCurrent };
      }
      return portfolio;
    });
    setPortfolios(changedPortfolios);
  };

  const loadData = async (): Promise<void> => {
    setPortLoading(true);
    const portData = await fetchPortfolios();
    const portfolioIds = getPortfolioIds(portData);
    const portfolioStocks = await fetchAllStocks(portfolioIds);
    const stocksWithCurrent = await fetchAllCurrent(portfolioStocks);
    const portfoliosWithDetail = portData.map((portfolio, index) => ({
      ...portfolio,
      detail: stocksWithCurrent[index],
    }));

    const rebalancesList = await fetchAllRebalances(portfolioIds);
    rebalancesList.sort(
      (a, b) =>
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );

    const rebalanceRecordsList = await fetchAllRebalanceRecords(portfolioIds);

    setRebalances(rebalancesList);
    setrebalanceRecords(rebalanceRecordsList);
    setPortfolios(portfoliosWithDetail);
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
        rebalanceRecords,
        fetchPortfolios,
        fetchDelete,
        getPortfolioById,
        fetchModify,
        removePortfolios,
        fetchStocksByPortfolioId,
        fetchCurrentPrice,
        fetchRebalanceList,
        fetchChangePortName,
        reloadPortfolio,
        loadData,
        portLoading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === null) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
