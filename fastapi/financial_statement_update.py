import pandas as pd
import requests as rq
from bs4 import BeautifulSoup
import re
import time
from sqlalchemy import create_engine
import pymysql


class fs_update:
    def __init__(self):
        pass

    # 재무 클렌징 함수
    # 입력값으로 데이터프레임, 티커, 공시구분(연간/분기)
    def clean_fs(self, df, ticker, frequency):
        # 모든 연도의 데이터가 NaN인 항목은 제외
        df = df[~df.loc[:, ~df.columns.isin(["계정"])].isna().all(axis=1)]
        df = df.drop_duplicates(["계정"], keep="first")
        # melt() 함수를 이용해 열로 긴 데이터를 행으로 긴 데이터로 변환
        df = pd.melt(df, id_vars="계정", var_name="기준일", value_name="값")
        df["계정"] = df["계정"].replace({"계산에 참여한 계정 펼치기": ""}, regex=True)
        df["기준일"] = (
            pd.to_datetime(df["기준일"], format="%Y/%m") + pd.tseries.offsets.MonthEnd()
        )
        df["종목코드"] = ticker
        df["공시구분"] = frequency

        return df

    def fs_update(self):
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
                sql="""select * from ticker
                                where 기준일 = (select max(기준일) from ticker)
                                and 종목구분 = '보통주';""",
                con=conn.connection,
            )

        # DB 저장 쿼리
        query = f"""
        insert into financial_statement (종목코드, 계정, 값, 공시구분, 기준일)
        values(%s,%s,%s,%s,%s) as new
        on duplicate key update
        값 = new.값
        """

        # 오류 발생 시 저장할 리스트 생성

        error_list = []

        # 전 종목 주가 다운로드 및 저장
        for i in range(0, len(ticker_list)):

            # 티커 선택
            ticker = ticker_list["종목코드"][i]

            # 오류 발생 시 이를 무시하고 다음 루프로 진행
            try:
                # url 생성
                url = f"https://comp.fnguide.com/SVO2/ASP/SVD_Finance.asp?pGB=1&gicode=A{ticker}"

                # 데이터 다운로드
                data = pd.read_html(url, displayed_only=False)

                # 연간 데이터
                data_fs_y = pd.concat(
                    [
                        data[0].iloc[:, ~data[0].columns.str.contains("전년동기")],
                        data[2],
                        data[4],
                    ]
                )
                data_fs_y = data_fs_y.rename(columns={data_fs_y.columns[0]: "계정"})

                # 결산년 찾기
                page_data = rq.get(url)
                page_data_html = BeautifulSoup(page_data.content, "html.parser")

                fiscal_data = page_data_html.select("div.corp_group1 > h2")
                fiscal_data_text = fiscal_data[1].text
                fiscal_data_text = re.findall("[0-9]+", fiscal_data_text)

                # 결산년에 해당하는 계정만 남기기
                data_fs_y = data_fs_y.loc[
                    :,
                    (data_fs_y.columns == "계정")
                    | (data_fs_y.columns.str[-2:].isin(fiscal_data_text)),
                ]

                # 클렌징
                data_fs_y_clean = self.clean_fs(data_fs_y, ticker, "y")

                # 분기데이터
                data_fs_q = pd.concat(
                    [
                        data[1].iloc[:, ~data[1].columns.str.contains("전년동기")],
                        data[3],
                        data[5],
                    ]
                )
                data_fs_q = data_fs_q.rename(columns={data_fs_q.columns[0]: "계정"})

                # 클렌징
                data_fs_q_clean = self.clean_fs(data_fs_q, ticker, "q")

                # 2개 합치기
                data_fs_bind = pd.concat([data_fs_y_clean, data_fs_q_clean]).fillna(0)

                data_fs_bind = data_fs_bind[
                    ["종목코드", "계정", "값", "공시구분", "기준일"]
                ]
                # 재무제표 데이터를 DB에 저장
                args = data_fs_bind.values.tolist()
                mycursor.executemany(query, args)
                con.commit()

            except Exception as e:
                # 오류 발생 시 error_list에 티커 저장하고 넘어가기
                error_list.append(ticker)

            # 타임슬립 적용
            time.sleep(1)

        # DB 연결 종료
        engine.dispose()
        con.close()
