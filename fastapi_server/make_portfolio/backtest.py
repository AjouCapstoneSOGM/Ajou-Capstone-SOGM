from sqlalchemy import create_engine
import pymysql
import statsmodels.api as sm
from scipy.stats import zscore

import numpy as np
import pandas as pd
from pandas_datareader import data as web
import yfinance as yf
from datetime import datetime, timedelta
from scipy.optimize import minimize
import warnings

warnings.filterwarnings("ignore")


yf.pdr_override()


class fs_clean:
    def __init__(self):
        self.con_url = "mysql+pymysql://dbadmin:U239!!f8mm@127.0.0.1:3307/eta_db"
        pass

    def get_from_db(self, today):
        end_date = today - timedelta(days=500)
        end_date_str = end_date.strftime("%Y-%m-%d")

        # sql 접속 url
        engine = create_engine(self.con_url)

        fs_list = pd.read_sql(
            f"""
            select * from financial_statement
            where account in('당기순이익', '매출총이익', '영업활동현금흐름', '자산총계', '매출액',
            '자본총계', '부채총계','현금및현금성자산', '영업이익','매출','자본','부채','자산',
            '영업활동으로인한현금흐름','영업수익','영업수익(매출액)', '현금및예치금','순영업수익')
            and period = 'q' and date >= '{end_date_str}' AND date < '{today}';
            """,
            con=engine,
        )
        engine.dispose()

        return fs_list

    def filter_earliest_four_quarters(self, group):
        return group.tail(4)

    def cal_fs(self, fs_list):
        # 재무정보 최근 4분기 가져오기
        fs_list_sorted = fs_list.sort_values(by=["ticker", "account", "date"])
        fs_list_sorted = fs_list_sorted.drop_duplicates()
        grouped = fs_list_sorted.groupby(["ticker", "account"])
        fs_list = grouped.apply(self.filter_earliest_four_quarters)
        fs_list.reset_index(drop=True, inplace=True)

        # TTM 구하기
        fs_list = fs_list.sort_values(["ticker", "account", "date"])
        fs_list["ttm"] = (
            fs_list.groupby(["ticker", "account"], as_index=False)["value"]
            .rolling(window=4, min_periods=4)
            .sum()["value"]
        )

        # 자산, 부채, 자본총계, 현금및현금성자산은 평균 구하기
        fs_list_clean = fs_list.copy()
        fs_list_clean["ttm"] = np.where(
            fs_list_clean["account"].isin(
                [
                    "자산총계",
                    "부채총계",
                    "자본총계",
                    "현금및현금성자산",
                    "자본",
                    "부채",
                    "자산",
                    "현금및예치금",
                ]
            ),
            fs_list_clean["ttm"] / 4,
            fs_list_clean["ttm"],
        )
        fs_list_clean = fs_list_clean.groupby(["account", "ticker"]).tail(1)
        return fs_list_clean

    def run(self, today):
        fs_list = self.get_from_db(today)
        fs_list_clean = self.cal_fs(fs_list)
        return fs_list_clean


class get_factor_score:
    def __init__(self):
        self.con_url = "mysql+pymysql://dbadmin:U239!!f8mm@127.0.0.1:3307/eta_db"
        pass

    def connect_db(self):
        engine = create_engine(self.con_url)
        con = pymysql.connect(
            user="dbadmin",
            passwd="U239!!f8mm",
            host="127.0.0.1",
            port=3307,
            db="eta_db",
            charset="utf8",
        )
        return engine, con

    def get_from_db(self, start_day):
        start_day_minus_one_year = start_day - timedelta(days=365)
        start_day_minus_one_year_str = start_day_minus_one_year.strftime("%Y-%m-%d")

        # sql 접속 url
        engine = create_engine(self.con_url)

        # Read data from database tables
        ticker_list = pd.read_sql(
            """
            SELECT * FROM ticker
            WHERE updated_date = (SELECT MAX(updated_date) FROM ticker)
            AND equity = '보통주';
            """,
            con=engine,
        )

        price_list = pd.read_sql(
            f"""
            SELECT date, close, ticker 
            FROM price
            WHERE date >= '{start_day_minus_one_year_str}' AND date < '{start_day}';
            """,
            con=engine,
        )

        sector_list = pd.read_sql(
            """
            SELECT * FROM sector;
            """,
            con=engine,
        )

        engine.dispose()

        return ticker_list, price_list, sector_list

    def ticker_list_sector(self, ticker_list, sector_list, sector_id):
        ticker_list = pd.merge(
            ticker_list, sector_list, how="left", on="sector_id"
        ).drop_duplicates()
        ticker_list = ticker_list[ticker_list["sector_id"] == sector_id]
        return ticker_list

    def cal_quality(self, fs_list_clean):
        # 각종 퀄리티 팩터 계산
        fs_list_pivot = fs_list_clean.pivot(
            index="ticker", columns="account", values="ttm"
        )

        # 크롤링 소스 전처리
        fs_list_pivot["자본총계"] = fs_list_pivot["자본총계"].fillna(
            fs_list_pivot["자본"]
        )
        fs_list_pivot["자산총계"] = fs_list_pivot["자산총계"].fillna(
            fs_list_pivot["자산"]
        )
        fs_list_pivot["부채총계"] = fs_list_pivot["부채총계"].fillna(
            fs_list_pivot["부채"]
        )

        # '자본', '자산', '부채' 열 삭제
        fs_list_pivot.drop(
            columns=["자본", "자산", "부채"], inplace=True, errors="ignore"
        )

        # # 금융 전처리
        fs_list_pivot["매출액"] = fs_list_pivot["매출액"].fillna(
            fs_list_pivot["영업수익"]
        )
        fs_list_pivot["매출액"] = fs_list_pivot["매출액"].fillna(
            fs_list_pivot["영업수익(매출액)"]
        )

        fs_list_pivot["매출액"] = fs_list_pivot["매출액"].fillna(
            fs_list_pivot["순영업수익"]
        )

        fs_list_pivot["매출총이익"] = fs_list_pivot["매출총이익"].fillna(
            fs_list_pivot["매출액"]
        )

        fs_list_pivot["영업활동현금흐름"] = fs_list_pivot["영업활동현금흐름"].fillna(
            fs_list_pivot["영업활동으로인한현금흐름"]
        )

        fs_list_pivot.drop(
            columns=[
                "영업수익",
                "영업활동으로인한현금흐름",
                "영업수익(매출액)",
                "순영업수익",
            ],
            inplace=True,
            errors="ignore",
        )

        fs_list_pivot["ROE"] = fs_list_pivot["당기순이익"] / fs_list_pivot["자본총계"]
        fs_list_pivot["ROA"] = fs_list_pivot["당기순이익"] / fs_list_pivot["자산총계"]
        fs_list_pivot["GPA"] = fs_list_pivot["매출총이익"] / fs_list_pivot["자산총계"]
        fs_list_pivot["GM"] = fs_list_pivot["매출총이익"] / fs_list_pivot["매출액"]
        fs_list_pivot["OP"] = fs_list_pivot["영업이익"] / fs_list_pivot["매출액"]
        fs_list_pivot["CFROA"] = (
            fs_list_pivot["영업활동현금흐름"] / fs_list_pivot["자산총계"]
        )

        # 'GM' 또는 'OP' 열에 결측치가 있는 행 필터링
        mask_gm = fs_list_pivot["GM"].isnull()
        mask_op = fs_list_pivot["OP"].isnull()

        # 'GM' 결측치가 있는 경우 계산하여 채우기
        if mask_gm.any():
            # '매출총이익', '매출' 열이 결측치가 아닌지 확인
            gm_mask = (
                mask_gm
                & fs_list_pivot["매출총이익"].notnull()
                & fs_list_pivot["매출"].notnull()
            )
            # 결측치가 있는 경우에만 계산하여 채우기
            fs_list_pivot.loc[gm_mask, "GM"] = (
                fs_list_pivot.loc[gm_mask, "매출총이익"]
                / fs_list_pivot.loc[gm_mask, "매출"]
            )

        # 'OP' 결측치가 있는 경우 계산하여 채우기
        if mask_op.any():
            # '영업이익', '매출액' 열이 결측치가 아닌지 확인
            op_mask = (
                mask_op
                & fs_list_pivot["영업이익"].notnull()
                & fs_list_pivot["매출"].notnull()
            )
            # 결측치가 있는 경우에만 계산하여 채우기
            fs_list_pivot.loc[op_mask, "OP"] = (
                fs_list_pivot.loc[op_mask, "영업이익"]
                / fs_list_pivot.loc[op_mask, "매출"]
            )

        return fs_list_pivot

    def cal_value(self, ticker_list, fs_list_clean):
        ev_df = self.cal_ev(ticker_list, fs_list_clean)
        value_df = self.cal_market_value(ticker_list, fs_list_clean)
        all_value_list = pd.concat([value_df, ev_df], ignore_index=True)
        all_value_list = all_value_list.sort_values(by="ticker").reset_index(drop=True)
        all_value_list = all_value_list.pivot_table(
            index="ticker", columns="지표", values="value", aggfunc="first"
        ).reset_index()
        return all_value_list

    def cal_ev(self, ticker_list, fs_list_clean):
        # 기업가치 밸류
        temp_ticker = ticker_list[["ticker", "market_cap", "updated_date"]]
        temp_fs = fs_list_clean.pivot(index="ticker", columns="account", values="ttm")

        temp_merged_df = pd.merge(temp_fs, temp_ticker, on="ticker")
        # 크롤링 소스 전처리
        temp_merged_df["부채총계"] = temp_merged_df["부채총계"].fillna(
            temp_merged_df["부채"]
        )
        temp_merged_df["현금및현금성자산"] = temp_merged_df["현금및현금성자산"].fillna(
            temp_merged_df["현금및예치금"]
        )

        # # 금융 전처리
        temp_merged_df["매출액"] = temp_merged_df["매출액"].fillna(
            temp_merged_df["영업수익"]
        )
        temp_merged_df["매출액"] = temp_merged_df["매출액"].fillna(
            temp_merged_df["영업수익(매출액)"]
        )
        temp_merged_df["매출액"] = temp_merged_df["매출액"].fillna(
            temp_merged_df["순영업수익"]
        )

        temp_merged_df.drop(
            columns=["영업수익", "영업수익(매출액)", "순영업수익"],
            inplace=True,
            errors="ignore",
        )

        # EV 계산
        temp_merged_df["EV"] = (
            temp_merged_df["market_cap"]
            + temp_merged_df["부채총계"]
            - temp_merged_df["현금및현금성자산"]
        )

        # EV/sales 계산
        temp_merged_df["EV/sales"] = (
            temp_merged_df["EV"] / temp_merged_df["매출액"]
        ).round(4)
        # 'GM' 또는 'OP' 열에 결측치가 있는 행 필터링
        mask = temp_merged_df[["EV/sales"]].isnull().any(axis=1)

        # 결측치가 있는 경우 계산하여 채우기
        if mask.any():
            # '매출총이익', '영업이익', '매출' 열이 결측치가 아닌지 확인
            evs_mask = (
                mask & temp_merged_df["EV"].notnull() & temp_merged_df["매출"].notnull()
            )
            # 결측치가 있는 경우에만 계산하여 채우기
            temp_merged_df.loc[evs_mask, "EV/sales"] = (
                temp_merged_df.loc[evs_mask, "EV"]
                / temp_merged_df.loc[evs_mask, "매출"]
            )

        # 필요한 열만 선택하여 새로운 DataFrame 생성
        ev_list = temp_merged_df[["ticker", "updated_date", "EV/sales"]]

        # 무한대 및 결측치를 None으로 대체
        ev_list = ev_list.replace([np.inf, -np.inf, np.nan], None)
        ev_df = ev_list.melt(
            id_vars=["ticker", "updated_date"], var_name="지표", value_name="value"
        )
        return ev_df

    def cal_market_value(self, ticker_list, fs_list_clean):
        # 가치지표
        value_merge = fs_list_clean[["account", "ticker", "ttm"]].merge(
            ticker_list[["ticker", "market_cap", "updated_date"]], on="ticker"
        )
        value_merge.loc[value_merge["account"] == "자본", "account"] = "자본총계"

        # # 금융 전처리
        # '매출액'에 해당하는 다른 명칭들을 '매출액'으로 통합
        value_merge.loc[value_merge["account"] == "영업수익", "account"] = "매출액"
        value_merge.loc[value_merge["account"] == "영업수익(매출액)", "account"] = (
            "매출액"
        )
        value_merge.loc[value_merge["account"] == "순영업수익", "account"] = "매출액"

        # 필요 없는 컬럼 제거
        value_merge.drop(
            columns=[
                "영업수익",
                "영업수익(매출액)",
                "자본",
            ],
            inplace=True,
            errors="ignore",
        )
        # market_cap을 재무데이터 value으로 나누어 가치지표 계산
        value_merge["value"] = value_merge["market_cap"] / value_merge["ttm"]
        value_merge["value"] = value_merge["value"].round(4)
        value_merge["지표"] = np.where(
            (value_merge["account"] == "매출액") | (value_merge["account"] == "매출"),
            "PSR",
            np.where(
                (value_merge["account"] == "영업활동현금흐름")
                | (value_merge["account"] == "영업활동으로인한현금흐름"),
                "PCR",
                np.where(
                    value_merge["account"] == "자본총계",
                    "PBR",
                    np.where(value_merge["account"] == "당기순이익", "PER", None),
                ),
            ),
        )
        # 중복된 'ticker'에 대해서는 첫 번째 값을 유지하고 나머지는 제거합니다.
        # 이때 '매출액'이 '매출'보다 먼저 오도록 정렬했기 때문에, '매출액' 기반의 값이 우선적으로 유지됩니다.
        value_merge = value_merge.sort_values(
            by=["ticker", "account"], ascending=[True, False]
        )
        value_merge = value_merge.drop_duplicates(
            subset=["ticker", "지표"], keep="first"
        )

        value_merge.rename(columns={"value": "value"}, inplace=True)
        value_merge = value_merge[["ticker", "updated_date", "지표", "value"]]
        value_merge = value_merge[value_merge["지표"].notnull()]
        value_df = value_merge.replace([np.inf, -np.inf, np.nan], None)
        value_df = value_df.drop_duplicates()
        return value_df

    def cal_dps(self, ticker_list, price_list):
        # 배당수익률 계산
        price_pivot = price_list.pivot(
            index="date", columns="ticker", values="close"
        ).bfill()
        temp_last_price = price_pivot.iloc[-1].reset_index()
        temp_last_price.columns = ["ticker", "close"]
        temp_dy = pd.merge(ticker_list, temp_last_price, on="ticker")
        temp_dy["value"] = (
            temp_dy["dividend"] / temp_dy["close"]
        )  # 배당수익률 = 주당배당금 / 종가
        temp_dy["value"] = temp_dy["value"].round(4)  # value 소수점 4자리까지 반올림
        temp_dy["지표"] = "DPS"  # 배당수익률 지표 표시
        dps_list = temp_dy[
            ["ticker", "updated_date", "지표", "value"]
        ]  # 필요한 열만 선택하여 새로운 DataFrame 생성
        dps_list = dps_list.replace(
            [np.inf, -np.inf, np.nan], 0
        )  # 무한대 및 결측치를 None으로 대체
        dps_list = dps_list.pivot(index="ticker", columns="지표", values="value")
        return dps_list

    def cal_momentum(self, price_list):
        # 12개월 상승률
        price_pivot = price_list.pivot(
            index="date", columns="ticker", values="close"
        ).bfill()
        # 가격테이블에서 가장 끝행을 가장 첫행으로 나누어 각 종목의 12개월 수익률을 구한다.
        ret_list = pd.DataFrame(
            data=price_pivot.iloc[-1] / price_pivot.iloc[0] - 1, columns=["12M_ret"]
        )
        ret_list["ticker"] = ret_list.index
        ret_list.reset_index(drop=True, inplace=True)
        # 12개월 K-ratio
        ret = price_pivot.pct_change(fill_method=None).iloc[1:]
        # 로그 누적 수익률로 계산
        ret_cum = np.log(1 + ret).cumsum()

        # 모든 종목의 k-ratio 계산
        x = np.array(range(len(ret)))
        k_ratio = {}

        for ticker in price_pivot.columns:
            try:
                y = ret_cum[ticker]
                reg = sm.OLS(y, x).fit()
                res = float(reg.params.iloc[0] / reg.bse.iloc[0])
            except:
                # 상장이 1년 미만일 경우 Nan
                res = np.nan
            k_ratio[ticker] = res

        k_ratio_bind = pd.DataFrame.from_dict(k_ratio, orient="index").reset_index()
        k_ratio_bind.columns = ["ticker", "K_ratio"]

        return ret_list, k_ratio_bind

    def merge_data(self, ticker_list, price_list, fs_list_clean):

        fs_list_pivot = self.cal_quality(fs_list_clean)
        all_value_list = self.cal_value(ticker_list, fs_list_clean)
        dps_list = self.cal_dps(ticker_list, price_list)
        ret_list, k_ratio_bind = self.cal_momentum(price_list)
        # 티커, 섹터, 퀄리티, 벨류, 12개월 수익률, k-ratio를 하나로 합친다.
        # 섹터 정보가 없을 경우 '기타'를 입력
        data_bind = (
            ticker_list[["ticker", "name", "sector_name"]]
            .merge(
                fs_list_pivot[["ROE", "ROA", "GPA", "GM", "OP", "CFROA"]],
                how="left",
                on="ticker",
            )
            .merge(all_value_list, how="left", on="ticker")
            .merge(ret_list, how="left", on="ticker")
            .merge(k_ratio_bind, how="left", on="ticker")
            .merge(dps_list, how="left", on="ticker")
        )
        pd.set_option("future.no_silent_downcasting", True)
        data_bind.replace([np.inf, -np.inf], np.nan, inplace=True)
        return data_bind

    def col_clean(self, df, cutoff=0.01, asc=False):
        q_low = df.quantile(cutoff)
        q_hi = df.quantile(1 - cutoff)

        df_trim = df[(df > q_low) & (df < q_hi)]

        if asc == False:
            df_z_score = df_trim.rank(axis=0, ascending=False).apply(
                zscore, nan_policy="omit"
            )
        elif asc == True:
            df_z_score = df_trim.rank(axis=0, ascending=True).apply(
                zscore, nan_policy="omit"
            )

        return df_z_score

    def cal_zsocre(self, data_bind):
        data_bind_group = data_bind.set_index(["ticker", "sector_name"]).groupby(
            "sector_name"
        )
        # quality z_score
        z_quality = (
            data_bind_group[["ROE", "ROA", "GPA", "GM", "OP", "CFROA"]]
            .apply(lambda x: self.col_clean(x, 0.01, False))
            .sum(axis=1, skipna=True)
            .to_frame("z_quality")
        )
        data_bind = data_bind.merge(z_quality, how="left", on=["ticker"])
        # value z_score
        value_1 = (
            data_bind_group[["PBR", "PCR", "PER", "PSR"]]
            .apply(lambda x: self.col_clean(x, 0.01, True))
            .sum(axis=1, skipna=True)
            .to_frame("value_1")
        )
        value_2 = (
            data_bind_group[["DPS"]]
            .apply(lambda x: self.col_clean(x, 0.01, False))
            .sum(axis=1, skipna=True)
            .to_frame("value_2")
        )
        z_value = (
            value_1.merge(value_2, on=["ticker"])
            .sum(axis=1, skipna=True)
            .to_frame("z_value")
        )
        data_bind = data_bind.merge(z_value, how="left", on=["ticker"])
        # momentum z_score
        z_momentum = (
            data_bind_group[["12M_ret", "K_ratio"]]
            .apply(lambda x: self.col_clean(x, 0.01, False))
            .sum(axis=1, skipna=True)
            .to_frame("z_momentum")
        )
        data_bind = data_bind.merge(z_momentum, how="left", on=["ticker"])
        # 분포가 비슷하지 않기 때문에 다시한번 z-score를 계산
        data_bind_final = (
            data_bind[["ticker", "z_quality", "z_value", "z_momentum"]]
            .set_index("ticker")
            .apply(zscore, nan_policy="omit")
        )
        data_bind_final.columns = ["quality", "value", "momentum"]
        data_bind = pd.merge(data_bind, data_bind_final, on="ticker")
        final_data_bind = data_bind.drop(["z_quality", "z_value", "z_momentum"], axis=1)
        return final_data_bind

    def cal_score(self, data_bind, current_day):
        data_bind_sector = data_bind
        # today = datetime.today().strftime("%Y-%m-%d")
        # today = "2024-04-01"
        # 모멘텀에 낮은 가중치
        wts = [0.45, 0.45, 0.1]
        # engine, con = self.connect_db()
        # self.reset_db(con)
        # 각 그룹별로 데이터프레임을 불러와서 순위를 계산
        df_name_sum = (
            (data_bind_sector[["quality", "value", "momentum"]] * wts)
            .sum(axis=1, skipna=False)
            .to_frame()
        )
        df_name_sum.columns = ["score"]
        port_score = data_bind_sector.merge(
            df_name_sum, left_index=True, right_index=True
        )
        port_score["rank"] = port_score["score"].rank(ascending=True, method="first")
        port_score = port_score.sort_values(by="rank", ascending=True)
        port_score["점수date"] = current_day
        port_score = port_score.drop("name", axis=1)
        port_score = port_score.reindex(
            columns=[
                "점수date",
                "ticker",
                "sector_name",
                "ROE",
                "ROA",
                "GPA",
                "GM",
                "OP",
                "CFROA",
                "EV/sales",
                "PER",
                "PBR",
                "PCR",
                "PSR",
                "DPS",
                "12M_ret",
                "K_ratio",
                "quality",
                "value",
                "momentum",
                "score",
                "rank",
            ]
        )
        port_score["rank"] = port_score["rank"].astype(int)
        port_score = port_score[port_score["rank"] < 11]
        port_score = port_score.reset_index(drop=True)
        port_score = port_score["ticker"].tolist()
        return port_score

    def get_yf_ticker(self, ticker_list, tickers):
        yf_tickers = []
        ticker_list = ticker_list[ticker_list["ticker"].isin(tickers)]
        for ticker in tickers:
            exchange = ticker_list[ticker_list["ticker"] == ticker]["exchange"].iloc[0]
            yf_tickers.append(ticker + ".KS" if exchange == "KOSPI" else ticker + ".KQ")

        yf_tickers.extend(["261240.KS", "411060.KS"])
        return yf_tickers

    def run(self, current_day, sector_id, fs_list_clean):
        ticker_list, price_list, sector_list = self.get_from_db(current_day)
        ticker_list = self.ticker_list_sector(ticker_list, sector_list, sector_id)
        data_bind = self.merge_data(ticker_list, price_list, fs_list_clean)
        final_data_bind = self.cal_zsocre(data_bind)
        port_list = self.cal_score(final_data_bind, current_day)
        port_list = self.get_yf_ticker(ticker_list, port_list)
        return port_list


class Re_MakePortrolio:
    def __init__(self):
        pass

    def make_portfolio(self, tickers, safe_asset_ratio, initial_cash, today):
        start = (today - timedelta(days=252 * 1)).strftime("%Y-%m-%d")
        end = (today - timedelta(days=1)).strftime("%Y-%m-%d")
        stock_tickers = tickers[:-2]
        bond_tickers = tickers[-2:]
        total_ratio_final, int_asset_num, cash_hold, final_returns, final_vol, end = (
            self.total_returns(
                stock_tickers,
                bond_tickers,
                start,
                end,
                safe_asset_ratio,
                initial_cash,
                today,
            )
        )
        evaluation_results = self.evaluate(
            total_ratio_final, int_asset_num, cash_hold, final_returns, final_vol, end
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

    def cal_bond(self, bonds, start, end):
        bond_adjClose = pd.DataFrame()

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

    def total_returns(
        self,
        stock_tickers,
        bond_tickers,
        start,
        end,
        safe_asset_ratio,
        initial_cash,
        today,
    ):
        stock_daily_log_returns, stock_annual_Returns = self.cal_stock(
            stock_tickers, start, end
        )
        bond_daily_log_returns, bond_annual_Returns = self.cal_bond(
            bond_tickers, start, end
        )

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
        total_ratio_final, int_asset_num, cash_hold, adj_asset = (
            self.calculate_cash_allocation(
                total_ratio, initial_cash, stock_tickers, len(bonds), today
            )
        )

        final_returns = self.cal_return(total_ratio_final[:-1], total_returns_annual)
        final_vol = self.cal_vol(total_ratio_final[:-1], total_cov_annual)

        return (
            total_ratio_final,
            int_asset_num,
            cash_hold,
            final_returns,
            final_vol,
            adj_asset,
        )

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
        self, total_ratio, initial_cash, stock_tickers, num_safe, today
    ):

        start = (today - timedelta(days=14)).strftime("%Y-%m-%d")
        end = (today - timedelta(days=1)).strftime("%Y-%m-%d")
        final_adjClose = pd.DataFrame()

        for item in stock_tickers:
            data = web.get_data_yahoo(item, start=start, end=end, progress=False)
            final_adjClose[item] = data["Adj Close"].round().astype(int)

        final_adjClose = final_adjClose.tail(1)
        adj_asset = final_adjClose.values.flatten()
        invest = initial_cash * total_ratio  # 종목당 투자금액

        # 초기값 계산
        asset_num = invest / adj_asset
        int_asset_num = np.floor(asset_num).astype(int)
        remaining_decimals = asset_num - int_asset_num

        # 투자 가능한 총 현금 계산
        cash = (adj_asset * remaining_decimals).sum()
        # 이전의 정수 자산 개수를 비교하기 위해 저장
        int_asset_num_stock_all_old = int_asset_num[:-num_safe]

        max_iter = 100
        cash_hold = 0
        # 수렴이나 특정 조건이 충족될 때까지 반복
        for _ in range(max_iter):
            # 각 주식 자산에 투자할 금액 계산
            invest = cash * total_ratio[:-num_safe]
            # 각 주식 자산에 투자할 수량 계산

            asset_num = invest / adj_asset[:-num_safe]
            # 수량을 정수로 변환하고 이전 정수 자산 번호에 더함

            int_asset_num_stock = np.floor(asset_num).astype(int)
            remaining_decimals_stock = asset_num - int_asset_num_stock
            int_asset_num_stock_all = int_asset_num_stock_all_old + int_asset_num_stock
            # 정수 자산 번호의 합이 이전 반복에서 변하지 않았는지 확인

            if int_asset_num_stock_all.sum() == int_asset_num_stock_all_old.sum():
                # 합이 변하지 않으면, 남은 달러 값을 정수 자산 번호에 추가

                safe_num = np.array(int_asset_num[len(int_asset_num) - num_safe :])
                int_asset_num = np.append(int_asset_num_stock_all, safe_num)
                # 총 투자 현금과 남은 현금 계산
                total_invest_cash = (adj_asset * int_asset_num).sum()
                cash_hold = initial_cash - total_invest_cash
                break

            # 다음 반복을 위해 이전 정수 자산 번호 업데이트
            int_asset_num_stock_all_old = int_asset_num_stock_all
            # 남은 소수 자산에 투자한 후의 총 현금 계산
            new_cash = (adj_asset[:-num_safe] * remaining_decimals_stock).sum()
            # 수렴을 확인하거나 new_cash가 0인지 확인
            if (
                (abs((cash - new_cash) / new_cash) < 0.001)
                or (cash == new_cash)
                or (new_cash == 0)
            ):
                # 수렴이 달성되면, 남은 안전자산 값을 정수 자산 번호에 추가
                safe_num = np.array(int_asset_num[len(int_asset_num) - num_safe :])
                int_asset_num = np.append(int_asset_num_stock_all, safe_num)
                # 총 투자 현금과 남은 현금 계산
                total_invest_cash = (adj_asset * int_asset_num).sum()
                cash_hold = initial_cash - total_invest_cash
                break
            # 다음 반복을 위해 cash 업데이트
            cash = new_cash

        asset_ratio = (adj_asset * int_asset_num) / initial_cash
        cash_ratio = cash_hold / initial_cash
        total_ratio_final = np.append(asset_ratio, cash_ratio)
        total_ratio_final = np.round(total_ratio_final, 5)
        final_total_cash = cash_hold + (int_asset_num * adj_asset).sum()

        if final_total_cash != initial_cash:
            e = 0
            e = initial_cash - final_total_cash
            cash_hold += e

        return total_ratio_final, int_asset_num, cash_hold, final_adjClose.index

    def evaluate(
        self, total_ratio_final, int_asset_num, cash_hold, final_returns, final_vol, end
    ):
        int_asset_num = int_asset_num.tolist()
        total_ratio_final = total_ratio_final.tolist()
        final_returns = round(final_returns * 100, 2).item()
        final_vol = round(final_vol * 100, 2).item()
        if cash_hold != 0:
            cash_hold = int(cash_hold.item())

        evaluation_results = {
            "int_asset_num": int_asset_num,
            "cash_hold": cash_hold,
            "total_ratio_final": total_ratio_final,
            "final_returns": final_returns,
            "final_vol": final_vol,
            "buy_date": end,
        }
        return evaluation_results


class backtest:
    def __init__(self):
        pass

    def no_re_return(self, initial_asset_num, past_price, last_price):
        return (initial_asset_num * past_price).sum() / (
            initial_asset_num * last_price
        ).sum() - 1

    def get_initial_data(self, tickers, results, start_day):
        initial_asset_num = np.array(results["int_asset_num"])
        cash_hold = results["cash_hold"]
        initial_ratio = np.array(results["total_ratio_final"])
        initial_ratio = np.array(initial_ratio[:-1])
        buy_date = datetime.strptime(
            results["buy_date"].strftime("%Y-%m-%d").tolist()[0], "%Y-%m-%d"
        )
        asset_adjClose = pd.DataFrame()
        for item in tickers:
            data = web.get_data_yahoo(
                item, start=buy_date, end=start_day, progress=False
            )
            asset_adjClose[item] = data["Adj Close"].round().astype(int)
        asset_adjClose = asset_adjClose.bfill()
        asset_adjClose = asset_adjClose.ffill()

        return buy_date, asset_adjClose, initial_ratio, initial_asset_num, cash_hold

    def optimize_investment(
        self, int_asset_num, current_price, initial_cash, initial_ratio, num_safe
    ):
        asset_num = int_asset_num[:-num_safe]
        remaining_decimals = int_asset_num - np.floor(int_asset_num)
        int_asset_num = int_asset_num.astype(int)

        cash = (current_price * remaining_decimals).sum()
        int_asset_num_stock_all_old = int_asset_num[:-num_safe]

        max_iter = 100
        cash_hold = 0
        for _ in range(max_iter):
            invest = cash * initial_ratio[:-num_safe]
            asset_num = invest / current_price[:-num_safe]
            int_asset_num_stock = np.floor(asset_num).astype(int)
            remaining_decimals_stock = asset_num - int_asset_num_stock
            int_asset_num_stock_all = int_asset_num_stock_all_old + int_asset_num_stock

            if int_asset_num_stock_all.sum() == int_asset_num_stock_all_old.sum():
                safe_num = np.array(int_asset_num[len(int_asset_num) - num_safe :])
                int_asset_num = np.append(int_asset_num_stock_all, safe_num)
                total_invest_cash = (current_price * int_asset_num).sum()
                cash_hold = initial_cash - total_invest_cash
                break

            int_asset_num_stock_all_old = int_asset_num_stock_all
            new_cash = (current_price[:-num_safe] * remaining_decimals_stock).sum()
            if (
                (abs((cash - new_cash) / new_cash) < 0.001)
                or (cash == new_cash)
                or (new_cash == 0)
            ):
                safe_num = np.array(int_asset_num[len(int_asset_num) - num_safe :])
                int_asset_num = np.append(int_asset_num_stock_all, safe_num)
                total_invest_cash = (current_price * int_asset_num).sum()
                cash_hold = initial_cash - total_invest_cash
                break
            cash = new_cash

        return int_asset_num, cash_hold

    def ratio_re(
        self,
        total_current_invest,
        current_asset_num,
        initial_ratio,
        current_price,
        average_price,
        num_safe,
    ):

        total_invest_money = total_current_invest
        new_asset_num = total_invest_money * initial_ratio / current_price
        new_asset_num, cash_hold = self.optimize_investment(
            new_asset_num, current_price, total_invest_money, initial_ratio, num_safe
        )
        change_asset_num = new_asset_num - current_asset_num

        for i in range(len(change_asset_num)):
            if change_asset_num[i] > 0:
                average_price[i] = (
                    (current_price[i] * change_asset_num[i])
                    + (average_price[i] * (new_asset_num[i] - change_asset_num[i]))
                ) / new_asset_num[i]

        average_price = np.round(average_price, 0)
        current_invest_asset = average_price * new_asset_num
        asset_ratio = current_invest_asset / total_invest_money
        cash_ratio = cash_hold / total_invest_money
        total_ratio_final = np.append(asset_ratio, cash_ratio)
        total_ratio_final = np.round(total_ratio_final, 5)
        current_ratio = total_ratio_final[:-1]
        final_total_cash = cash_hold + current_invest_asset.sum()

        if final_total_cash.sum() != total_invest_money.sum():
            e = total_invest_money - final_total_cash
            cash_hold += e
            final_total_cash += e
        cash_hold = cash_hold.astype(int)
        current_asset_num = new_asset_num
        re = False

        return (
            current_asset_num,
            cash_hold,
            average_price,
            current_ratio,
            re,
        )

    def run_investment_strategy(
        self,
        asset_adjClose,
        initial_ratio,
        initial_asset_num,
        invest_money,
        cash_hold,
        safe_asset,
        port_list_day_360,
        port_list_day_180,
        day_180,
        day_90,
        start_day,
        num_safe=2,
    ):

        invest_money = invest_money
        start_price = asset_adjClose.iloc[0]
        past_price = asset_adjClose.iloc[0]
        last_price_start = asset_adjClose.iloc[-1]
        current_ratio = initial_ratio
        start_asset_num = initial_asset_num
        current_asset_num = initial_asset_num
        average_price = past_price
        cash_hold = cash_hold
        re = False
        re_cnt = 0
        i = 0
        while True:
            if (
                asset_adjClose.index[i].to_pydatetime()
                == asset_adjClose.index[-1].to_pydatetime()
            ):
                break

            current_price = asset_adjClose.iloc[i]
            current_invest_asset = current_asset_num * current_price
            total_current_invest = np.append(current_invest_asset, cash_hold).sum()
            current_ratio = current_invest_asset / total_current_invest

            if asset_adjClose.index[i].to_pydatetime() == day_180:
                if i < 10:
                    port_list_day_360 = port_list_day_180
                if sorted(port_list_day_360) != sorted(port_list_day_180):
                    invest_180 = total_current_invest
                    temp = Re_MakePortrolio()
                    results = temp.make_portfolio(
                        port_list_day_180, safe_asset, invest_180, day_180
                    )
                    (
                        buy_date,
                        asset_adjClose,
                        initial_ratio,
                        initial_asset_num,
                        cash_hold,
                    ) = self.get_initial_data(port_list_day_180, results, start_day)
                    past_price = asset_adjClose.iloc[0]
                    current_ratio = initial_ratio
                    current_asset_num = initial_asset_num
                    average_price = past_price
                    final_total_cash = (
                        average_price * current_asset_num
                    ).sum() + cash_hold

                    i = 0
                    port_list_day_360 = port_list_day_180
                else:
                    invest_180 = total_current_invest

            percentage_difference = (
                np.abs((current_ratio - initial_ratio) / initial_ratio) * 100
            )
            if np.any(percentage_difference > 25):
                re = True
                re_cnt += 1

            if re:
                (
                    current_asset_num,
                    cash_hold,
                    average_price,
                    current_ratio,
                    re,
                ) = self.ratio_re(
                    total_current_invest,
                    current_asset_num,
                    initial_ratio,
                    current_price,
                    average_price,
                    num_safe,
                )
            i += 1

        no_re_return = self.no_re_return(start_asset_num, start_price, last_price_start)

        port_return = (total_current_invest) / invest_money - 1

        return invest_money, total_current_invest, port_return, no_re_return

    def kos_return(self, buy_date, start_day):
        kos_data = web.get_data_yahoo(
            "^KS11", start=buy_date, end=start_day, progress=False
        )
        kos_asset_adjClose = kos_data["Adj Close"].round().astype(int)
        kos_start = kos_asset_adjClose.iloc[0]
        kos_end = kos_asset_adjClose.iloc[-1]
        kos_return = kos_end / kos_start - 1
        return kos_return

    def main(
        self,
        start_day,
        day_90,
        day_180,
        port_list_day_180,
        port_list_day_360,
        port_list,
        results,
        invest_money,
        safe_asset,
    ):
        # 백테스팅
        buy_date, asset_adjClose, initial_ratio, initial_asset_num, cash_hold = (
            self.get_initial_data(port_list, results, start_day)
        )

        invest_money, total_current_invest, port_return, no_re_return = (
            self.run_investment_strategy(
                asset_adjClose,
                initial_ratio,
                initial_asset_num,
                invest_money,
                cash_hold,
                safe_asset,
                port_list_day_360,
                port_list_day_180,
                day_180,
                day_90,
                start_day,
            )
        )
        kos_return = self.kos_return(buy_date, start_day)

        return port_return, no_re_return, kos_return


class back_test_main:
    def __init__(self):
        pass

    def subtract_business_days(self, start_date, days_to_subtract):
        current_date = start_date
        while days_to_subtract > 0:
            current_date -= timedelta(days=1)
            # 주말이 아닌 경우에만 days_to_subtract를 줄임
            if current_date.weekday() < 5:
                days_to_subtract -= 1
        return current_date

    def get_fs_list_clean(self, day):
        make_fs_clean = fs_clean()
        return make_fs_clean.run(day)

    def get_factor_score(self, day, sector_id, fs_list_clean):
        get_score = get_factor_score()
        return get_score.run(day, sector_id, fs_list_clean)

    def get_portfolio(self, port_list, safe_asset, invest_money, day):
        get_port = Re_MakePortrolio()
        return get_port.make_portfolio(port_list, safe_asset, invest_money, day)

    def get_back_result(
        self,
        start_day,
        day_90,
        day_180,
        port_list_day_180,
        port_list_day_360,
        port_list,
        results,
        invest_money,
        safe_asset,
    ):
        get_back = backtest()
        return get_back.main(
            start_day,
            day_90,
            day_180,
            port_list_day_180,
            port_list_day_360,
            port_list,
            results,
            invest_money,
            safe_asset,
        )

    def evaluate(
        self,
        port_return_90,
        not_re_port_return_90,
        kos_return_90,
        port_return_180,
        not_re_port_return_180,
        kos_return_180,
        port_return_360,
        not_re_port_return_360,
        kos_return_360,
    ):
        portfolioBacktesting = [
            {
                "port_return": port_return_90,
                "not_rebalancing_return": not_re_port_return_90,
                "kospi_return": kos_return_90,
            },
            {
                "port_return": port_return_180,
                "not_rebalancing_return": not_re_port_return_180,
                "kospi_return": kos_return_180,
            },
            {
                "port_return": port_return_360,
                "not_rebalancing_return": not_re_port_return_360,
                "kospi_return": kos_return_360,
            },
        ]
        return portfolioBacktesting

    def run(self, sector_id, invest_money, safe_asset):
        start_day_str = datetime.today().strftime("%Y-%m-%d")
        start_day = datetime.strptime(start_day_str, "%Y-%m-%d")
        # 주말을 제외하고 90일, 180일, 270일, 360일을 뺀 날짜 계산
        day_90 = self.subtract_business_days(start_day, 63)
        day_180 = self.subtract_business_days(start_day, 126)
        day_360 = self.subtract_business_days(start_day, 252)

        fs_list_clean_90 = self.get_fs_list_clean(day_90)
        fs_list_clean_180 = self.get_fs_list_clean(day_180)
        fs_list_clean_360 = self.get_fs_list_clean(day_360)

        port_list_day_90 = self.get_factor_score(day_90, sector_id, fs_list_clean_90)
        port_list_day_180 = self.get_factor_score(day_180, sector_id, fs_list_clean_180)
        port_list_day_360 = self.get_factor_score(day_360, sector_id, fs_list_clean_360)

        results_90 = self.get_portfolio(
            port_list_day_90, safe_asset, invest_money, day_90
        )
        results_180 = self.get_portfolio(
            port_list_day_180, safe_asset, invest_money, day_180
        )
        results_360 = self.get_portfolio(
            port_list_day_360, safe_asset, invest_money, day_360
        )

        port_return_90, not_re_port_return_90, kos_return_90 = self.get_back_result(
            start_day,
            day_90,
            day_180,
            port_list_day_180,
            port_list_day_360,
            port_list_day_90,
            results_90,
            invest_money,
            safe_asset,
        )
        port_return_180, not_re_port_return_180, kos_return_180 = self.get_back_result(
            start_day,
            day_90,
            day_180,
            port_list_day_180,
            port_list_day_360,
            port_list_day_180,
            results_180,
            invest_money,
            safe_asset,
        )
        port_return_360, not_re_port_return_360, kos_return_360 = self.get_back_result(
            start_day,
            day_90,
            day_180,
            port_list_day_180,
            port_list_day_360,
            port_list_day_360,
            results_360,
            invest_money,
            safe_asset,
        )

        portfolioBacktesting = self.evaluate(
            port_return_90,
            not_re_port_return_90,
            kos_return_90,
            port_return_180,
            not_re_port_return_180,
            kos_return_180,
            port_return_360,
            not_re_port_return_360,
            kos_return_360,
        )
        return portfolioBacktesting


# sector_id = "G20"
# invest_money = 5000000
# safe_asset = 0.3

# back_test = back_test_main()
# portfolioBacktesting = back_test.run(sector_id, invest_money, safe_asset)
# print(portfolioBacktesting)
