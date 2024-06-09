import requests as rq
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime, timedelta
from tqdm import tqdm
from urllib.parse import urlparse, parse_qs


class News:
    def __init__(self):
        self.today = datetime.today()
        self.period = self.today - timedelta(days=30)
        self.start_date = self.period.strftime("%Y-%m-%d")  # Example start date
        self.end_date = self.today.strftime("%Y-%m-%d")  # Example end date

    def get_recent_news(self):
        today = datetime.today().strftime("%Y%m%d")
        links = f"""https://finance.naver.com/news/news_list.naver?mode=LSS2D&section_id=101&section_id2=258&date={today}&page="""
        urls = [links + str(i) for i in range(1, 2)]

        # Lists to store titles and summaries
        titles = []
        summaries = []
        presses = []
        wdates = []

        # Fetching data and creating BeautifulSoup objects
        for url in urls:
            response = rq.get(url)
            html = BeautifulSoup(response.content, "html.parser")

            # Extracting titles and summaries
            titles += html.select("dl > dd.articleSubject > a") + html.select(
                "dl > dt.articleSubject > a"
            )
            summaries += html.select("dl > dd.articleSummary")
            presses += html.select("dl > dd.articleSummary > span.press")
            wdates += html.select("dl > dd.articleSummary > span.wdate")
            title_list = [i["title"] for i in titles]
            title_list = [s.replace("\xa0", "") for s in title_list]
            href_list = [i["href"] for i in titles]

            for i, href in enumerate(href_list):
                parsed_url = urlparse(href)
                query_params = parse_qs(parsed_url.query)

                # 필요한 정보 추출
                article_id = query_params.get("article_id", [None])[0]
                office_id = query_params.get("office_id", [None])[0]

                # 첫 번째 링크 형식으로 재구성
                if article_id and office_id:
                    href_list[i] = (
                        f"https://n.news.naver.com/mnews/article/{office_id}/{article_id}"
                    )
                else:
                    href_list[i] = "Invalid URL or missing parameters"

            print(href_list)
            # 요약 리스트 생성
            # summary_list = [s.text.strip() for s in summaries]

            # 언론사 리스트 생성
            press_list = [s.text.strip() for s in presses]

            # 날짜 리스트 생성
            wdate_list = [s.text.strip() for s in wdates]

        news_list = pd.DataFrame(
            {
                "title": title_list,
                "press": press_list,
                "wdate": wdate_list,
                "href": href_list,
            }
        )

        word_to_delete = "코스피|코스닥|\\?"
        mask = news_list["title"].str.contains(word_to_delete, case=False)
        news_list = news_list[~mask]
        news_list.reset_index(drop=True, inplace=True)

        return news_list

    async def get_news_title_from_page(self, page, start_date, end_date, ticker):
        url = f"https://finance.naver.com/item/news.naver?code={ticker}&page={page}"

        response = rq.get(url)
        soup = BeautifulSoup(response.content, "html.parser")

        iframe = soup.find("iframe", {"id": "news_frame"})
        iframe_src = iframe["src"]

        iframe_url = f"https://finance.naver.com{iframe_src}"
        iframe_response = rq.get(iframe_url)
        iframe_soup = BeautifulSoup(iframe_response.content, "html.parser")

        # Use the iframe_soup object to find the table within the iframe
        table = iframe_soup.find("table", {"class": "type5"})
        rows = table.find_all("tr")

        # Initialize lists to store titles, dates, infos, and hrefs
        titles = []
        dates = []
        infos = []
        hrefs = []

        for row in rows:
            # Find the title, info, and date within each row
            title_td = row.find("td", {"class": "title"})
            info_td = row.find("td", {"class": "info"})
            date_td = row.find("td", {"class": "date"})

            if title_td:
                a_tag = title_td.find("a", class_="tit")
                if a_tag:
                    title_text = a_tag.text.strip()
                    href = a_tag["href"]
                    titles.append(title_text)
                    hrefs.append(href)

            if info_td:
                infos.append(info_td.text.strip())

            if date_td:
                date_text = date_td.text.strip()
                try:
                    news_date = datetime.strptime(date_text, "%Y.%m.%d %H:%M")
                except ValueError:
                    continue  # Skip this row if the date format is not as expected

                # Check if the news date is within the specified date range
                if (
                    start_date - timedelta(days=1)
                    <= news_date
                    <= end_date + timedelta(days=1)
                ):
                    dates.append(date_text)
                elif news_date < start_date:
                    # If the news date is before the start_date, stop processing further pages
                    return titles, infos, dates, hrefs

        for i, href in enumerate(hrefs):
            parsed_url = urlparse(href)
            query_params = parse_qs(parsed_url.query)

            # 필요한 정보 추출
            article_id = query_params.get("article_id", [None])[0]
            office_id = query_params.get("office_id", [None])[0]

            # 첫 번째 링크 형식으로 재구성
            if article_id and office_id:
                hrefs[i] = (
                    f"https://n.news.naver.com/mnews/article/{office_id}/{article_id}"
                )
            else:
                hrefs[i] = "Invalid URL or missing parameters"
        return titles, infos, dates, hrefs

    async def get_company_news(self, ticker):
        # Initialize lists to store unique titles and dates
        start_date = self.start_date
        end_date = self.end_date
        unique_titles = []
        unique_dates = []
        unique_infos = []
        unique_hrefs = []
        # Convert start_date and end_date to datetime objects if they are not already
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        end_date = datetime.strptime(end_date, "%Y-%m-%d")
        # Iterate through pages until start_date passes
        page = 1
        max_articles = 50  # 최대 기사 수 설정
        while len(unique_titles) < max_articles:
            titles, infos, dates, hrefs = await self.get_news_title_from_page(
                page, start_date, end_date, ticker
            )

            if not dates or datetime.strptime(dates[-1], "%Y.%m.%d %H:%M") < start_date:
                break

            unique_titles.extend(titles)
            unique_dates.extend(dates)
            unique_infos.extend(infos)
            unique_hrefs.extend(hrefs)

            page += 1

        df = pd.DataFrame(
            {
                "title": unique_titles,
                "press": unique_infos,
                "wdate": unique_dates,
                "href": unique_hrefs,
            }
        )

        df.drop_duplicates(subset=["title"], inplace=True)
        df["title"] = df["title"].astype(str)
        word_to_delete = "코스피|코스닥"
        if not df.isnull().values.any():
            mask = df["title"].str.contains(word_to_delete, case=False)
            df = df[~mask]

        df.reset_index(drop=True, inplace=True)

        return df