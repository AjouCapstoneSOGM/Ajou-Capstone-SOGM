import numpy as np
import pandas as pd
from pandas_datareader import data as web
import yfinance as yf
from datetime import datetime, timedelta
import datetime
from scipy.optimize import minimize

yf.pdr_override()


class MakePortrolio:
    def __init__(self):
        self.today = datetime.datetime.today()

    def make_portfolio(self, tickers, safe_asset_ratio, initial_cash):
        start = (self.today - timedelta(weeks=52 * 1)).strftime("%Y-%m-%d")
        end = (self.today - timedelta(days=1)).strftime("%Y-%m-%d")
        total_ratio_final, int_asset_num, cash_hold, final_returns, final_vol = (
            self.total_returns(tickers, start, end, safe_asset_ratio, initial_cash)
        )
        evaluation_results = self.evaluate(
            total_ratio_final, int_asset_num, cash_hold, final_returns, final_vol
        )
        return evaluation_results

    def cal_stock(self, tickers, start, end):
        stock_adjClose = pd.DataFrame()
        for item in tickers:
            data = web.get_data_yahoo(item, start=start, end=end, progress=False)
            stock_adjClose[item] = data["Adj Close"].round().astype(int)
        adjClose = stock_adjClose.bfill()
        # 로그 리턴 계산
        daily_log_returns = np.log(adjClose / adjClose.shift(1)).dropna()
        # 연간 로그 수익률 계산
        meanReturns = daily_log_returns.mean()
        annualReturns = meanReturns * 252

        return daily_log_returns, annualReturns

    def cal_bond(self, start, end):
        bond_adjClose = pd.DataFrame()
        # # 단기채, 장기채, 달러, 금
        # bonds = ['114260.KS', '148070.KS', '261240.KS', '411060.KS']
        # 단기채, 달러, 금
        # bonds = ["114260.KS", "261240.KS", "411060.KS"]
        # 달러, 금
        bonds = ["261240.KS", "411060.KS"]

        for item in bonds:
            data = web.get_data_yahoo(item, start=start, end=end, progress=False)
            bond_adjClose[item] = data["Adj Close"].round().astype(int)

            bond_adj = bond_adjClose.bfill()

            # 로그 리턴 계산
            bond_log_returns = np.log(bond_adj / bond_adj.shift(1)).dropna()
            bond_log_returns.name = "Bond_Returns"
            # 연간 로그 수익률 계산
            bond_meanReturns = bond_log_returns.mean()
            bond_annualReturns = bond_meanReturns * 252

        return bond_log_returns, bond_annualReturns

    def total_returns(self, tickers, start, end, safe_asset_ratio, initial_cash):
        stock_daily_log_returns, stock_annual_Returns = self.cal_stock(
            tickers, start, end
        )
        bond_daily_log_returns, bond_annual_Returns = self.cal_bond(start, end)

        total_returns = pd.merge(
            stock_daily_log_returns, bond_daily_log_returns, on="Date"
        )
        total_returns_annual = pd.concat([stock_annual_Returns, bond_annual_Returns])

        # 공분산 계산
        stock_cov_daily = stock_daily_log_returns.cov()
        stock_cov_annual = stock_cov_daily * 252
        total_cov_daily = total_returns.cov()
        total_cov_annual = total_cov_daily * 252

        # risk-parity weight 계산
        weights = self.optimize_weights(stock_cov_annual)

        # 주식 w : 달러 (1-w)
        port_bond_ratio = safe_asset_ratio
        bonds = bond_daily_log_returns.columns.tolist()
        port_bond_ratio_element = (np.ones([len(bonds)]) / len(bonds)) * port_bond_ratio
        port_bond_ratio_array = np.array([port_bond_ratio_element]).flatten()
        port_stock_ratio = weights * (1 - port_bond_ratio)
        total_ratio = np.concatenate((port_stock_ratio, port_bond_ratio_array))
        total_ratio = np.array(total_ratio)
        stock_tickers = total_returns.columns.tolist()

        # 비중에 대한 투자금액 계산
        total_ratio_final, int_asset_num, cash_hold = self.calculate_cash_allocation(
            total_ratio, initial_cash, stock_tickers, len(bonds)
        )

        final_returns = self.cal_return(total_ratio_final[:-1], total_returns_annual)
        final_vol = self.cal_vol(total_ratio_final[:-1], total_cov_annual)

        return total_ratio_final, int_asset_num, cash_hold, final_returns, final_vol

    # 비중에 대한 변동성 계산함수
    def cal_vol(self, weights, covmat):
        vol = np.sqrt(np.dot(weights, np.dot(covmat, weights.T)))
        return vol

    # 비중에 대한 수익률 계산 함수
    def cal_return(self, weight, annualreturns):
        returns = np.sum(weight * annualreturns)
        return returns

    # 리스크 기여도 계산
    def cal_risk_contribution(self, w, covmat):
        w = np.matrix(w)
        sigma = self.cal_vol(w, covmat)
        MRC = np.dot(covmat, w.T)
        RC = np.multiply(MRC, w.T) / sigma
        return RC

    # 최적화 목적함수
    def risk_budget_objective(self, weights, covmat):
        # 포트폴리오 위험계산
        sig_p = self.cal_vol(weights, covmat)
        # 자산별 위험목표 설정
        risk_target = np.multiply(sig_p, weights)
        # 자산 위험도 계산
        asset_RC = self.cal_risk_contribution(weights, covmat)
        # 목적함수 평가: 자산 위험 기여금과 각각의 위험 목표 간의 차이의 제곱합
        result = sum(np.square(asset_RC - risk_target.T))[0, 0]
        return result

    def optimize_weights(self, covmat):
        n_assets = covmat.shape[0]
        weights = np.ones(n_assets) / n_assets
        bnds = tuple((0.05, 1) for _ in range(n_assets))
        cons = {"type": "eq", "fun": lambda w: np.sum(w) - 1}
        options = {"maxiter": 1000}
        res = minimize(
            self.risk_budget_objective,
            weights,
            args=(covmat,),
            method="SLSQP",
            bounds=bnds,
            constraints=cons,
            options=options,
        )
        return res["x"]

    def calculate_cash_allocation(
        self, total_ratio, initial_cash, stock_tickers, num_bonds
    ):

        start = (self.today - timedelta(days=14)).strftime("%Y-%m-%d")
        end = (self.today).strftime("%Y-%m-%d")
        final_adjClose = pd.DataFrame()

        for item in stock_tickers:
            data = web.get_data_yahoo(item, start=start, end=end, progress=False)
            final_adjClose[item] = data["Adj Close"].round().astype(int)

        final_adjClose = final_adjClose.tail(1)
        adj_asset = final_adjClose.values.flatten()
        initial_cash = initial_cash  # 투자금액
        invest = initial_cash * total_ratio  # 종목당 투자금액

        # 초기값 계산
        asset_num = invest / adj_asset
        int_asset_num = np.floor(asset_num).astype(int)
        remaining_decimals = asset_num - int_asset_num

        # 투자 가능한 총 현금 계산
        cash = (adj_asset * remaining_decimals).sum()
        # 이전의 정수 자산 개수를 비교하기 위해 저장
        int_asset_num_stock_all_old = int_asset_num[:-num_bonds]

        max_iter = 10
        cash_hold = 0
        # 수렴이나 특정 조건이 충족될 때까지 반복
        for _ in range(max_iter):
            # 각 주식 자산에 투자할 금액 계산
            invest = cash * total_ratio[:-num_bonds]
            # 각 주식 자산에 투자할 수량 계산

            asset_num = invest / adj_asset[:-num_bonds]
            # 수량을 정수로 변환하고 이전 정수 자산 번호에 더함

            int_asset_num_stock = np.floor(asset_num).astype(int)
            remaining_decimals_stock = asset_num - int_asset_num_stock
            int_asset_num_stock_all = int_asset_num_stock_all_old + int_asset_num_stock
            # 정수 자산 번호의 합이 이전 반복에서 변하지 않았는지 확인

            if int_asset_num_stock_all.sum() == int_asset_num_stock_all_old.sum():
                # 합이 변하지 않으면, 남은 달러 값을 정수 자산 번호에 추가

                dollar_num = np.array(int_asset_num[len(int_asset_num) - num_bonds :])
                int_asset_num = np.append(int_asset_num_stock_all, dollar_num)
                # 총 투자 현금과 남은 현금 계산

                total_invest_cash = (adj_asset * int_asset_num).sum()
                cash_hold = initial_cash - total_invest_cash
                break

            # 다음 반복을 위해 이전 정수 자산 번호 업데이트
            int_asset_num_stock_all_old = int_asset_num_stock_all
            # 남은 소수 자산에 투자한 후의 총 현금 계산
            new_cash = (adj_asset[:-num_bonds] * remaining_decimals_stock).sum()

            # 수렴을 확인하거나 new_cash가 0인지 확인
            if (
                (abs((cash - new_cash) / new_cash) < 0.001)
                or (cash == new_cash)
                or (new_cash == 0)
            ):
                # 수렴이 달성되면, 남은 안전자산 값을 정수 자산 번호에 추가
                dollar_num = np.array(int_asset_num[len(int_asset_num) - num_bonds :])
                int_asset_num = np.append(int_asset_num_stock_all, dollar_num)
                # 총 투자 현금과 남은 현금 계산
                total_invest_cash = (adj_asset * int_asset_num).sum()
                cash_hold = initial_cash - total_invest_cash
                break
            # 다음 반복을 위해 cash 업데이트
            cash = new_cash

        asset_ratio = (adj_asset * int_asset_num) / initial_cash
        cash_ratio = cash_hold / initial_cash
        total_ratio_final = np.append(asset_ratio, cash_ratio)

        return total_ratio_final, int_asset_num, cash_hold

    def evaluate(
        self, total_ratio_final, int_asset_num, cash_hold, final_returns, final_vol
    ):

        int_asset_num = int_asset_num.tolist()
        total_ratio_final = total_ratio_final.tolist()
        final_returns = round(final_returns * 100, 2).item()
        final_vol = round(final_vol * 100, 2).item()
        cash_hold = cash_hold.item()

        evaluation_results = {
            "int_asset_num": int_asset_num,
            "cash_hold": cash_hold,
            "total_ratio_final": total_ratio_final,
            "final_returns": final_returns,
            "final_vol": final_vol,
        }
        return evaluation_results
