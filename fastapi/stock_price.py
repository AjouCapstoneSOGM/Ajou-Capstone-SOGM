import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import pymysql
from sqlalchemy import create_engine
from pandas_datareader import data as web
import yfinance as yf

yf.pdr_override()


class stock_price_update:
    def __init__(self):
        pass

    def all_price_update():
        # 모든 주가 종목 시장 정보 크롤링

        # sql 접속 url
        con_url = f"mysql+pymysql://root:Tjdgus12!@127.0.0.1:3306/kr_stock_db"
        engine = create_engine(con_url)
        con = pymysql.connect(
            user="root",
            passwd="Tjdgus12!",
            host="127.0.0.1",
            db="kr_stock_db",
            charset="utf8",
        )
        mycursor = con.cursor()

        # 티커 리스트 불러오기
        with engine.connect() as conn:
            ticker_list = pd.read_sql(
                sql="""select * from kor_ticker
                                where 기준일 = (select max(기준일) from kor_ticker)
                                and 종목구분 = '보통주';""",
                con=conn.connection,
            )

        # DB 저장 쿼리
        query = f"""
        INSERT INTO price (종목코드, 종가, 날짜)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE
        종가 = VALUES(종가);
        """

        # 오류 발생 시 저장할 리스트 생성
        error_list = []

        # 전 종목 주가 다운로드 및 저장
        for i in range(0, len(ticker_list)):
            # 티커 선택
            ticker = ticker_list["종목코드"][i]
            yf_ticker = ticker + (
                ".KS" if ticker_list["시장구분"][i] == "KOSPI" else ".KQ"
            )

            # 오류 발생 시 이를 무시하고 다음 루프로 진행
            try:
                # 시작일과 종료일
                today = datetime.today()
                # 3년간의 주가 다운로드
                start = (today - timedelta(days=252 * 3)).strftime("%Y-%m-%d")
                end = (today - timedelta(days=1)).strftime("%Y-%m-%d")

                data = web.get_data_yahoo(
                    yf_ticker, start=start, end=end, progress=False
                )
                # Adjust DataFrame columns and values
                data["종목코드"] = ticker
                data.reset_index(inplace=True)
                data.rename(columns={"Date": "날짜", "Adj Close": "종가"}, inplace=True)
                data["종가"] = data["종가"].round().astype(int)
                data["날짜"] = pd.to_datetime(data["날짜"]).dt.strftime("%Y-%m-%d")

                data = data.reset_index(drop=True)
                data = data[["종목코드", "종가", "날짜"]]
                # 주가 데이터를 DB에 저장
                args = data.values.tolist()
                mycursor.executemany(query, args)
                con.commit()

            except Exception as e:
                error_list.append(ticker)

        # DB 연결 종료
        engine.dispose()
        con.close()

    def price_update():
        # 종목 시장 정보 업데이트
        # sql 접속 url
        con_url = f"mysql+pymysql://root:Tjdgus12!@127.0.0.1:3306/kr_stock_db"
        engine = create_engine(con_url)
        con = pymysql.connect(
            user="root",
            passwd="Tjdgus12!",
            host="127.0.0.1",
            db="kr_stock_db",
            charset="utf8",
        )
        mycursor = con.cursor()

        # 티커 리스트 불러오기
        with engine.connect() as conn:
            ticker_list = pd.read_sql(
                sql="""select * from kor_ticker
                                where 기준일 = (select max(기준일) from kor_ticker)
                                and 종목구분 = '보통주';""",
                con=conn.connection,
            )

        # 저장해둔 주가 리스트 불러오기
        with engine.connect() as conn:
            price_list = pd.read_sql(
                sql="""select 날짜 from price
                                where 날짜 = (select max(날짜) from price);""",
                con=conn.connection,
            )

        # DB 저장 쿼리
        query = f"""
        INSERT INTO price (종목코드, 종가, 날짜)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE
        종가 = VALUES(종가);
        """

        # 가장 최신 주가 데이터 날짜 추출
        price_list = price_list.drop_duplicates()
        price_list = price_list.iloc[0, 0]

        # 오류 발생 시 저장할 리스트 생성
        error_list = []

        # 전 종목 주가 다운로드 및 저장
        for i in range(0, len(ticker_list)):
            # 티커 선택
            ticker = ticker_list["종목코드"][i]
            yf_ticker = ticker + (
                ".KS" if ticker_list["시장구분"][i] == "KOSPI" else ".KQ"
            )

            # 오류 발생 시 이를 무시하고 다음 루프로 진행
            try:
                # 시작일과 종료일
                today = datetime.today()
                # 시작날짜를 데이터베이스의 최근날짜로 지정
                start = price_list.strftime("%Y-%m-%d")
                end = (today - timedelta(days=1)).strftime("%Y-%m-%d")

                data = web.get_data_yahoo(
                    yf_ticker, start=start, end=end, progress=False
                )
                # 데이터 전처리
                data["종목코드"] = ticker
                data.reset_index(inplace=True)
                data.rename(columns={"Date": "날짜", "Adj Close": "종가"}, inplace=True)
                data["종가"] = data["종가"].round().astype(int)
                data["날짜"] = pd.to_datetime(data["날짜"]).dt.strftime("%Y-%m-%d")

                data = data.reset_index(drop=True)
                data = data[["종목코드", "종가", "날짜"]]
                # 주가 데이터를 DB에 저장
                args = data.values.tolist()
                mycursor.executemany(query, args)
                con.commit()

            except Exception as e:
                # 오류 발생 시 error_list에 티커 저장하고 넘어가기
                # 오류가 나는 종목들은 대부분 거래정지된 종목
                error_list.append(ticker)

        # DB 연결 종료
        engine.dispose()
        con.close()
