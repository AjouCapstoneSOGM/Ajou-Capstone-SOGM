declare global {
  type PortfolioContextType = {
    portfolios: Portfolio[];
    rebalances: RebalancingList[];
    rebalanceRecords: RebalanceRecordList[];
    fetchPortfolios: () => Promise<Portfolio[]>;
    fetchDelete: (id: number) => Promise<boolean>;
    getPortfolioById: (id: number) => Portfolio | undefined;
    fetchModify: (
      rebalances: RebalancingStock,
      portId: number,
      rnId: number
    ) => Promise<void>;
    removePortfolios: () => void;
    fetchStocksByPortfolioId: (id: number) => Promise<PortfolioDetail>;
    fetchCurrentPrice: (portfolio: PortfolioDetail) => Promise<PortfolioDetail>;
    fetchRebalanceList: (pfId: number) => Promise<RebalancingList | []>;
    fetchChangePortName: (
      pfId: number,
      name: string
    ) => Promise<{ result: string }>;
    reloadPortfolio: (id: number) => Promise<void>;
    loadData: () => Promise<void>;
    portLoading: boolean;
  };

  type PortfolioProviderProps = {
    children: ReactNode;
  };

  type Stock = {
    averageCost: number;
    companyName: string;
    currentPrice: number;
    equity: string;
    quantity: number;
    ticker: string;
  };

  type PortfolioDetail = {
    currentCash: number;
    initialAsset: number;
    stocks: Stock[];
  };

  type Portfolio = {
    id: number;
    name: string;
    country: string;
    auto: boolean;
    riskValue: number;
    createdDate: Date;
    detail: PortfolioDetail;
  };

  type RebalancingStock = {
    ticker: string;
    number: number;
    isBuy: boolean;
    price: number;
  };

  type RebalancingList = {
    id: number;
    portfolioName?: string;
    list: (RebalancingStock & { name: string })[];
    createdDate: Date;
  };

  type RebalanceRecordList = {
    date: Date | null;
    pfId: number;
    records: RebalancingStock[];
  };
}
export {};
