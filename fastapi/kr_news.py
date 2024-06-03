import requests as rq
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
from datetime import timedelta
from tqdm import tqdm


class get_kr_news:
    def __init__(self):
        pass

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

            # 요약 리스트 생성
            # summary_list = [s.text.strip() for s in summaries]

            # 언론사 리스트 생성
            press_list = [s.text.strip() for s in presses]

            # 날짜 리스트 생성
            wdate_list = [s.text.strip() for s in wdates]

        news_list = pd.DataFrame(
            {"title": title_list, "press": press_list, "wdate": wdate_list}
        )

        word_to_delete = "코스피|코스닥|\\?"
        mask = news_list["title"].str.contains(word_to_delete, case=False)
        news_list = news_list[~mask]
        news_list.reset_index(drop=True, inplace=True)
        news_list_json = news_list.to_json(orient="records", force_ascii=False)

        return news_list_json

    def get_news_title_from_page(self, page, start_date, end_date, ticker):
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

        # Initialize lists to store titles and dates
        titles = []
        dates = []

        for row in rows:
            # Find the title and date within each row
            title = row.find("td", {"class": "title"})
            date = row.find("td", {"class": "date"})

            # If title or date is None, continue to the next row
            if not title or not date:
                continue

            # Extract text from title and date elements
            title_text = title.text.strip()
            date_text = date.text.strip()
            # Convert date text to datetime object
            try:
                news_date = datetime.strptime(date_text, "%Y.%m.%d %H:%M")
            except ValueError:
                continue  # Skip this row if the date format is not as expected

            # Check if news date is within the specified date range
            if (
                start_date - timedelta(days=1)
                <= news_date
                <= end_date + timedelta(days=1)
            ):
                titles.append(title_text)
                dates.append(date_text)
            elif news_date < start_date:
                # If the news date is before the start_date, stop processing further pages
                return titles, dates  # Return the collected titles and dates
        return titles, dates

    def get_company_news(self, start_date, end_date, ticker):
        # Initialize lists to store unique titles and dates
        unique_titles = []
        unique_dates = set()

        # Convert start_date and end_date to datetime objects if they are not already
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        end_date = datetime.strptime(end_date, "%Y-%m-%d")

        # Iterate through pages until start_date passes
        page = 1
        while True:
            # Call the function for the current page
            titles, dates = self.get_news_title_from_page(
                page, start_date, end_date, ticker
            )
            # If there are no more articles or start_date has passed, stop iterating
            if not dates or datetime.strptime(dates[-1], "%Y.%m.%d %H:%M") < start_date:
                break

            # Add titles and dates to the lists
            unique_titles.extend(titles)
            unique_dates.update(dates)

            # Move to the next page
            page += 1
        # Create a DataFrame with the unique titles
        df = pd.DataFrame(unique_titles, columns=["Title"])

        # Remove duplicate titles
        df.drop_duplicates(inplace=True)
        # Delete contain 코스피 or 코스닥
        word_to_delete = "코스피|코스닥"
        mask = df["Title"].str.contains(word_to_delete, case=False)
        df = df[~mask]
        df.reset_index(drop=True, inplace=True)

        # Return the DataFrame
        return df


# get = get_kr_news()
# today = datetime.today()
# # portfolio는 현재 보유중인 티커목록
# df = get.get_recent_news()
# print(df)
# # period = today - timedelta(days=7)
# # start_date = period.strftime("%Y-%m-%d")  # Example start date
# # end_date = today.strftime("%Y-%m-%d")  # Example end date
# # ticker = "207940"  # Example ticker date
# # df = get.get_company_news(start_date, end_date, ticker)

# # tickers = portfolio
# # dfs = []
# # for ticker in tickers:
# #     df = get.get_company_news(start_date, end_date, ticker)
# #     dfs.append(df)
