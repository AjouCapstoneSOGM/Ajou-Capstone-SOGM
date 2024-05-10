from sqlalchemy import create_engine
import pymysql
import pandas as pd


class portfolio_stock_select:
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
        value_list = pd.read_sql(
            """
            SELECT * FROM value
            """,
            con=engine,
        )

        ticker_list = pd.read_sql(
            """
            select * from ticker
                            where 기준일 = (select max(기준일) from ticker)
                            and 종목구분 = '보통주';
            """,
            con=engine,
        )

        return ticker_list, value_list

    def change_yf(self, ticker, ticker_list):
        yf_ticker_list = []
        for t in ticker:
            # Filter the DataFrame to get the rows where '종목코드' is equal to the current ticker
            ticker_data = ticker_list[ticker_list["종목코드"] == t]

            # Iterate over the filtered DataFrame
            for i in range(len(ticker_data)):
                # Construct Yahoo Finance ticker
                yf_ticker = ticker_data["종목코드"].iloc[i] + (
                    ".KS" if ticker_data["시장구분"].iloc[i] == "KOSPI" else ".KQ"
                )
                yf_ticker_list.append(yf_ticker)
        return yf_ticker_list

    def run(self, sector_name, ranking_num):
        ticker_list, value_list = self.get_from_db()
        select_stock = value_list[
            (value_list["섹터명"] == sector_name)
            & (value_list["ranking"] <= ranking_num)
        ]
        select_stock = select_stock["종목코드"].tolist()
        select_stock = self.change_yf(select_stock, ticker_list)

        return select_stock
