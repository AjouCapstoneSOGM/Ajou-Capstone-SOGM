import pandas as pd
import numpy as np
import requests as rq
from datetime import datetime, timedelta
from io import BytesIO
from sqlalchemy import create_engine
import pymysql
import time


class update_stock_info:
    def __init__(self):
        self.biz_day = self.get_biz_day()
        self.con_url = "mysql+pymysql://root:Tjdgus12!@127.0.0.1:3306/kr_stock_db"

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

    def get_biz_day(self):
        return (datetime.today() - timedelta(days=2)).strftime("%Y%m%d")

    def generate_otp(self, url, params, headers):
        response = rq.post(url, params, headers=headers).text
        return response

    def download_data(self, otp_code, download_url, headers):
        response = rq.post(download_url, {"code": otp_code}, headers=headers)
        data = pd.read_csv(BytesIO(response.content), encoding="EUC-KR")
        return data

    def down_market_data(self, mkt_id):
        gen_otp_url = "http://data.krx.co.kr/comm/fileDn/GenerateOTP/generate.cmd"
        headers = {"Referer": "http://dart.krx.co.kr/contents/MDC/MDI/mdiLoader"}
        params = {
            "mktId": mkt_id,
            "trdDd": self.biz_day,
            "money": "1",
            "csvxls_isNo": "false",
            "name": "fileDown",
            "url": "dbms/MDC/STAT/standard/MDCSTAT03901",
        }
        otp_code = self.generate_otp(gen_otp_url, params, headers)
        data = self.download_data(
            otp_code,
            "http://data.krx.co.kr/comm/fileDn/download_csv/download.cmd",
            headers,
        )
        return data

    def market_data(self, kospi, kosdaq):
        kor_market = pd.concat([kospi, kosdaq]).reset_index(drop=True)
        kor_market["종목명"] = kor_market["종목명"].str.strip()
        kor_market["기준일"] = self.biz_day
        return kor_market

    def index_data(self):
        gen_otp_url = "http://data.krx.co.kr/comm/fileDn/GenerateOTP/generate.cmd"
        params = {
            "searchType": "1",
            "mktId": "ALL",
            "trdDd": self.biz_day,
            "csvxls_isNo": "false",
            "name": "fileDown",
            "url": "dbms/MDC/STAT/standard/MDCSTAT03501",
        }
        headers = {"Referer": "http://dart.krx.co.kr/contents/MDC/MDI/mdiLoader"}
        otp_code = self.generate_otp(gen_otp_url, params, headers)
        download_url = "http://data.krx.co.kr/comm/fileDn/download_csv/download.cmd"
        df = self.download_data(otp_code, download_url, headers)
        df["종목명"] = df["종목명"].str.strip()
        df["기준일"] = self.biz_day

        return df

    def merge_data(self, kor_sector, kor_ind):
        # symmetric_difference 대칭차 구하는 함수
        diff = list(
            set(kor_sector["종목명"]).symmetric_difference(set(kor_ind["종목명"]))
        )
        kor_ticker = pd.merge(
            kor_sector,
            kor_ind,
            on=kor_sector.columns.intersection(kor_ind.columns).tolist(),
            how="outer",
        )
        kor_ticker["종목구분"] = np.where(
            kor_ticker["종목명"].str.contains("스팩|제[0-9]+호"),
            "스팩",
            np.where(
                kor_ticker["종목코드"].str[-1:] != "0",
                "우선주",
                np.where(
                    kor_ticker["종목명"].str.endswith("리츠"),
                    "리츠",
                    np.where(kor_ticker["종목명"].isin(diff), "기타", "보통주"),
                ),
            ),
        )
        kor_ticker = kor_ticker.reset_index(drop=True)
        kor_ticker.columns = kor_ticker.columns.str.replace(" ", "")
        # 팩터 지표들은 추후 따로 계산
        kor_ticker["주당배당금"] = (
            kor_ticker["주당배당금"].fillna(0).infer_objects(copy=False)
        )
        kor_ticker = kor_ticker[
            [
                "종목코드",
                "종목명",
                "종가",
                "시가총액",
                "주당배당금",
                "시장구분",
                "기준일",
                "종목구분",
            ]
        ]
        kor_ticker = kor_ticker.replace({np.nan: None})
        kor_ticker["기준일"] = pd.to_datetime(kor_ticker["기준일"])

        return kor_ticker

    def sector_data(self):
        biz_day = self.biz_day
        # 섹터 정보
        sector_code = [
            "G25",
            "G35",
            "G50",
            "G40",
            "G10",
            "G20",
            "G55",
            "G30",
            "G15",
            "G45",
        ]
        data_sector = []
        for i in sector_code:
            url = f"""https://www.wiseindex.com/Index/GetIndexComponets?ceil_yn=0&dt={biz_day}&sec_cd={i}"""
            data = rq.get(url).json()
            data_pd = pd.json_normalize(data["list"])
            data_sector.append(data_pd)
            time.sleep(1)

        df = pd.concat(data_sector, axis=0)
        df = df[["IDX_CD", "CMP_CD", "CMP_KOR", "SEC_NM_KOR"]]
        df["기준일"] = biz_day
        df["기준일"] = pd.to_datetime(df["기준일"])
        df.columns = ["섹터id", "종목코드", "종목명", "섹터명", "기준일"]
        df = df[["종목코드", "종목명", "섹터id", "섹터명", "기준일"]]
        return df

    def merge_db_data(self, kor_ticker, kor_sector):
        kor_stock = pd.merge(
            kor_ticker,
            kor_sector,
            on=kor_ticker.columns.intersection(kor_sector.columns).tolist(),
            how="outer",
        )
        kor_stock.loc[kor_stock["섹터id"].isnull(), "섹터id"] = "G99"
        kor_stock.loc[kor_stock["섹터명"].isnull(), "섹터명"] = "기타"
        # 시가총액을 억단위로 변환
        kor_stock["시가총액"] = kor_stock["시가총액"] / 100000000
        kor_stock["주당배당금"] = kor_stock["주당배당금"].astype(int)
        kor_stock = kor_stock.dropna()

        return kor_stock

    def insert_into_ticker_db(self, data, con):
        query = """
        INSERT INTO ticker (종목코드, 종목명, 시가총액, 주당배당금, 시장구분, 기준일, 종목구분, 섹터id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
        시가총액 = VALUES(시가총액), 주당배당금 = VALUES(주당배당금);
        """
        with con.cursor() as cursor:
            args = data.values.tolist()
            cursor.executemany(query, args)
            con.commit()

    def sector_db_data(self, kor_stock):
        kor_sector_db = (
            kor_stock[["섹터id", "섹터명"]]
            .drop_duplicates()
            .sort_values("섹터id")
            .reset_index()
            .drop("index", axis=1)
        )
        kor_stock = kor_stock.drop(["종가", "섹터명"], axis=1)
        return kor_stock, kor_sector_db

    def insert_into_sector_db(self, data, con):
        query = """
        INSERT INTO sector (섹터id, 섹터명)
        VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE
        섹터명 = VALUES(섹터명);
        """
        with con.cursor() as cursor:
            args = data.values.tolist()
            cursor.executemany(query, args)
            con.commit()

    def update(self):
        kospi_data = self.down_market_data("STK")
        kosdaq_data = self.down_market_data("KSQ")
        kor_market = self.market_data(kospi_data, kosdaq_data)
        kor_ind = self.index_data()
        kor_ticker = self.merge_data(kor_market, kor_ind)
        kor_sector = self.sector_data()
        kor_stock = self.merge_db_data(kor_ticker, kor_sector)
        # 섹터 테마 db용
        kor_stock, kor_sector_db = self.sector_db_data(kor_stock)

        engine, con = self.connect_db()
        self.insert_into_ticker_db(kor_stock, con)
        self.insert_into_sector_db(kor_sector_db, con)
        engine.dispose()
        con.close()
