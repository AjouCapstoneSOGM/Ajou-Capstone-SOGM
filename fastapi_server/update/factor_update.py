from sqlalchemy import create_engine
import pymysql
import pandas as pd
import numpy as np
import statsmodels.api as sm
from scipy.stats import zscore
from datetime import datetime


class update_factor_score:
    def __init__(self):
        self.con_url = "mysql+pymysql://root:Tjdgus12!@127.0.0.1:3306/kr_stock_db"
        pass

    def connect_db(self):
        engine = create_engine(self.con_url)
        con = pymysql.connect(
            user="root",
            passwd="Tjdgus12!",
            host="127.0.0.1",
            db="kr_stock_db",
            charset="utf8",
        )
        return engine, con

    def get_from_db(self):
        # sql 접속 url
        engine = create_engine(self.con_url)

        # Read data from database tables
        ticker_list = pd.read_sql(
            """
            SELECT * FROM ticker
            WHERE 기준일 = (SELECT MAX(기준일) FROM ticker)
            AND 종목구분 = '보통주';
            """,
            con=engine,
        )

        price_list = pd.read_sql(
            """
            SELECT 날짜, 종가, 종목코드 FROM price
            WHERE 날짜 >= (SELECT MAX(날짜) FROM price) - INTERVAL 1 YEAR;
            """,
            con=engine,
        )

        fs_list = pd.read_sql(
            """
            SELECT * FROM financial_statement
            WHERE 계정 IN ('당기순이익', '매출총이익', '영업활동으로인한현금흐름', '자산',
                            '자본', '부채', '매출액', '영업이익', '감가상각비','현금및현금성자산')
            AND 공시구분 = 'q';
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

        return ticker_list, price_list, fs_list, sector_list

    def ticker_list_sector(self, ticker_list, sector_list):
        ticker_list = pd.merge(
            ticker_list, sector_list, how="left", on="섹터id"
        ).drop_duplicates()
        return ticker_list

    def filter_earliest_four_quarters(self, group):
        return group.tail(4)

    def cal_fs(self, fs_list):
        # 재무정보 최근 4분기 가져오기
        fs_list_sorted = fs_list.sort_values(by=["종목코드", "계정", "기준일"])
        fs_list_sorted = fs_list_sorted.drop_duplicates()
        grouped = fs_list_sorted.groupby(["종목코드", "계정"])
        fs_list = grouped.apply(self.filter_earliest_four_quarters, include_groups=True)
        fs_list.reset_index(drop=True, inplace=True)

        # TTM 구하기
        fs_list = fs_list.sort_values(["종목코드", "계정", "기준일"])
        fs_list["ttm"] = (
            fs_list.groupby(["종목코드", "계정"], as_index=False)["값"]
            .rolling(window=4, min_periods=4)
            .sum()["값"]
        )

        # 자산, 부채, 자본, 현금및현금성자산은 평균 구하기
        fs_list_clean = fs_list.copy()
        fs_list_clean["ttm"] = np.where(
            fs_list_clean["계정"].isin(["자산", "부채", "자본", "현금및현금성자산"]),
            fs_list_clean["ttm"] / 4,
            fs_list_clean["ttm"],
        )
        fs_list_clean = fs_list_clean.groupby(["계정", "종목코드"]).tail(1)
        return fs_list_clean

    def cal_quality(self, fs_list_clean):
        # 각종 퀄리티팩터 계산
        fs_list_pivot = fs_list_clean.pivot(
            index="종목코드", columns="계정", values="ttm"
        )
        fs_list_pivot["ROE"] = fs_list_pivot["당기순이익"] / fs_list_pivot["자본"]
        fs_list_pivot["ROA"] = fs_list_pivot["당기순이익"] / fs_list_pivot["자산"]
        fs_list_pivot["GPA"] = fs_list_pivot["매출총이익"] / fs_list_pivot["자산"]
        fs_list_pivot["GM"] = fs_list_pivot["매출총이익"] / fs_list_pivot["매출액"]
        fs_list_pivot["OP"] = fs_list_pivot["영업이익"] / fs_list_pivot["매출액"]
        fs_list_pivot["CFROA"] = (
            fs_list_pivot["영업활동으로인한현금흐름"] / fs_list_pivot["자산"]
        )

        return fs_list_pivot

    def cal_value(self, ticker_list, fs_list_clean):
        ev_df = self.cal_ev(ticker_list, fs_list_clean)
        value_df = self.cal_market_value(ticker_list, fs_list_clean)
        all_value_list = pd.concat([value_df, ev_df], ignore_index=True)
        all_value_list = all_value_list.sort_values(by="종목코드").reset_index(
            drop=True
        )
        all_value_list = all_value_list.pivot(
            index="종목코드", columns="지표", values="값"
        )
        return all_value_list

    def cal_ev(self, ticker_list, fs_list_clean):
        # 기업가치 밸류
        temp_ticker = ticker_list[["종목코드", "시가총액", "기준일"]]
        temp_fs = fs_list_clean.pivot(index="종목코드", columns="계정", values="ttm")

        temp_merged_df = pd.merge(temp_fs, temp_ticker, on="종목코드")
        # EV 계산
        temp_merged_df["EV"] = (
            temp_merged_df["시가총액"]
            + temp_merged_df["부채"]
            - temp_merged_df["현금및현금성자산"]
        )
        # EBITDA 계산
        temp_merged_df["EBITDA"] = (
            temp_merged_df["영업이익"] + temp_merged_df["감가상각비"]
        )

        # EV/EBITDA 계산
        temp_merged_df["EV/EBITDA"] = (
            temp_merged_df["EV"] / temp_merged_df["EBITDA"]
        ).round(4)

        # EV/sales 계산
        temp_merged_df["EV/sales"] = (
            temp_merged_df["EV"] / temp_merged_df["매출액"]
        ).round(4)
        # 필요한 열만 선택하여 새로운 DataFrame 생성
        ev_list = temp_merged_df[["종목코드", "기준일", "EV/EBITDA", "EV/sales"]]

        # 무한대 및 결측치를 None으로 대체
        ev_list = ev_list.replace([np.inf, -np.inf, np.nan], None)
        ev_df = ev_list.melt(
            id_vars=["종목코드", "기준일"], var_name="지표", value_name="값"
        )
        return ev_df

    def cal_market_value(self, ticker_list, fs_list_clean):
        # 가치지표
        value_merge = fs_list_clean[["계정", "종목코드", "ttm"]].merge(
            ticker_list[["종목코드", "시가총액", "기준일"]], on="종목코드"
        )
        # 시가총액을 재무데이터 값으로 나누어 가치지표 계산
        value_merge["value"] = value_merge["시가총액"] / value_merge["ttm"]
        value_merge["value"] = value_merge["value"].round(4)
        value_merge["지표"] = np.where(
            value_merge["계정"] == "매출액",
            "PSR",
            np.where(
                value_merge["계정"] == "영업활동으로인한현금흐름",
                "PCR",
                np.where(
                    value_merge["계정"] == "자본",
                    "PBR",
                    np.where(value_merge["계정"] == "당기순이익", "PER", None),
                ),
            ),
        )
        value_merge.rename(columns={"value": "값"}, inplace=True)
        value_merge = value_merge[["종목코드", "기준일", "지표", "값"]]
        value_merge = value_merge[value_merge["지표"].notnull()]
        value_df = value_merge.replace([np.inf, -np.inf, np.nan], None)
        return value_df

    def cal_dps(self, ticker_list, price_list):
        # 배당수익률 계산
        price_pivot = price_list.pivot(index="날짜", columns="종목코드", values="종가")
        temp_last_price = price_pivot.iloc[-1].reset_index()
        temp_last_price.columns = ["종목코드", "종가"]
        temp_dy = pd.merge(ticker_list, temp_last_price, on="종목코드")
        temp_dy["값"] = (
            temp_dy["주당배당금"] / temp_dy["종가"]
        )  # 배당수익률 = 주당배당금 / 종가
        temp_dy["값"] = temp_dy["값"].round(4)  # 값 소수점 4자리까지 반올림
        temp_dy["지표"] = "DPS"  # 배당수익률 지표 표시
        dps_list = temp_dy[
            ["종목코드", "기준일", "지표", "값"]
        ]  # 필요한 열만 선택하여 새로운 DataFrame 생성
        dps_list = dps_list.replace(
            [np.inf, -np.inf, np.nan], None
        )  # 무한대 및 결측치를 None으로 대체
        dps_list = dps_list.pivot(index="종목코드", columns="지표", values="값")
        return dps_list

    def cal_momentum(self, price_list):
        # 12개월 상승률
        price_pivot = price_list.pivot(index="날짜", columns="종목코드", values="종가")
        # 가격테이블에서 가장 끝행을 가장 첫행으로 나누어 각 종목의 12개월 수익률을 구한다.
        ret_list = pd.DataFrame(
            data=price_pivot.iloc[-1] / price_pivot.iloc[0] - 1, columns=["12M_ret"]
        )
        ret_list["종목코드"] = ret_list.index
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
        k_ratio_bind.columns = ["종목코드", "K_ratio"]

        return ret_list, k_ratio_bind

    def insert_into_value_db(self, data, con):
        data = data.replace({np.nan: None})
        query = """
        INSERT INTO value (점수기준일, 종목코드, 섹터명, ROE, ROA, GPA, GM, OP, CFROA, `EV/EBITDA`, `EV/sales`, PER, PBR, PCR, PSR, DPS, `12M_ret`, K_ratio, quality, value, momentum, score, ranking)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """
        with con.cursor() as cursor:
            args = data.values.tolist()
            cursor.executemany(query, args)
            con.commit()

    def merge_data(self, ticker_list, price_list, fs_list):
        fs_list_clean = self.cal_fs(fs_list)
        fs_list_pivot = self.cal_quality(fs_list_clean)
        all_value_list = self.cal_value(ticker_list, fs_list_clean)
        dps_list = self.cal_dps(ticker_list, price_list)
        ret_list, k_ratio_bind = self.cal_momentum(price_list)
        # 티커, 섹터, 퀄리티, 벨류, 12개월 수익률, k-ratio를 하나로 합친다.
        # 섹터 정보가 없을 경우 '기타'를 입력
        data_bind = (
            ticker_list[["종목코드", "종목명", "섹터명"]]
            .merge(
                fs_list_pivot[["ROE", "ROA", "GPA", "GM", "OP", "CFROA"]],
                how="left",
                on="종목코드",
            )
            .merge(all_value_list, how="left", on="종목코드")
            .merge(ret_list, how="left", on="종목코드")
            .merge(k_ratio_bind, how="left", on="종목코드")
            .merge(dps_list, how="left", on="종목코드")
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
        data_bind_group = data_bind.set_index(["종목코드", "섹터명"]).groupby("섹터명")
        # quality z_score
        z_quality = (
            data_bind_group[["ROE", "ROA", "GPA", "GM", "OP", "CFROA"]]
            .apply(lambda x: self.col_clean(x, 0.01, False))
            .sum(axis=1, skipna=True)
            .to_frame("z_quality")
        )
        data_bind = data_bind.merge(z_quality, how="left", on=["종목코드"])
        # value z_score
        value_1 = (
            data_bind_group[["EV/EBITDA", "PBR", "PCR", "PER", "PSR"]]
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
            value_1.merge(value_2, on=["종목코드"])
            .sum(axis=1, skipna=True)
            .to_frame("z_value")
        )
        data_bind = data_bind.merge(z_value, how="left", on=["종목코드"])
        # momentum z_score
        z_momentum = (
            data_bind_group[["12M_ret", "K_ratio"]]
            .apply(lambda x: self.col_clean(x, 0.01, False))
            .sum(axis=1, skipna=True)
            .to_frame("z_momentum")
        )
        data_bind = data_bind.merge(z_momentum, how="left", on=["종목코드"])
        # 분포가 비슷하지 않기 때문에 다시한번 z-score를 계산
        data_bind_final = (
            data_bind[["종목코드", "z_quality", "z_value", "z_momentum"]]
            .set_index("종목코드")
            .apply(zscore, nan_policy="omit")
        )
        data_bind_final.columns = ["quality", "value", "momentum"]
        data_bind = pd.merge(data_bind, data_bind_final, on="종목코드")
        final_data_bind = data_bind.drop(["z_quality", "z_value", "z_momentum"], axis=1)
        return final_data_bind

    def reset_db(self, con):
        delete_query = "DELETE FROM value;"
        with con.cursor() as cursor:
            cursor.execute(delete_query)
            con.commit()

    def cal_score(self, data_bind):
        grouped = data_bind.groupby("섹터명")
        today = datetime.today().strftime("%Y-%m-%d")
        # 모멘텀에 낮은 가중치
        wts = [0.5, 0.5, 0]
        port_score_dict = {}
        engine, con = self.connect_db()
        self.reset_db(con)
        # 각 그룹별로 데이터프레임을 불러와서 순위를 계산
        for name, group in grouped:
            df_name_sum = (
                (group[["quality", "value", "momentum"]] * wts)
                .sum(axis=1, skipna=False)
                .to_frame()
            )
            df_name_sum.columns = ["score"]
            port_score = group.merge(df_name_sum, left_index=True, right_index=True)
            port_score["rank"] = port_score["score"].rank(
                ascending=True, method="first"
            )
            port_score = port_score.sort_values(by="rank", ascending=True)
            port_score["점수기준일"] = today
            port_score = port_score.drop("종목명", axis=1)
            port_score = port_score.reindex(
                columns=[
                    "점수기준일",
                    "종목코드",
                    "섹터명",
                    "ROE",
                    "ROA",
                    "GPA",
                    "GM",
                    "OP",
                    "CFROA",
                    "EV/EBITDA",
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
            port_score = port_score.reset_index(drop=True)
            port_score_dict[name] = port_score
            # 재무제표 데이터를 DB에 저장
            self.insert_into_value_db(port_score_dict[name], con)
        engine.dispose()
        con.close()

    def run(self):
        ticker_list, price_list, fs_list, sector_list = self.get_from_db()
        ticker_list = self.ticker_list_sector(ticker_list, sector_list)
        data_bind = self.merge_data(ticker_list, price_list, fs_list)
        final_data_bind = self.cal_zsocre(data_bind)
        self.cal_score(final_data_bind)
