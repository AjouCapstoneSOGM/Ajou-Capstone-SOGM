import requests as rq
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime

today = datetime.today().strftime("%Y%m%d")

# URLs
# links = "https://finance.naver.com/news/news_list.naver?mode=LSS2D&section_id=101&section_id2=258&page="
links = f"""https://finance.naver.com/news/news_list.naver?mode=LSS2D&section_id=101&section_id2=258&date={today}&page="""
urls = [links + str(i) for i in range(1, 30)]

# Lists to store titles and summaries
titles = []
summaries = []

# Fetching data and creating BeautifulSoup objects
for url in urls:
    response = rq.get(url)
    html = BeautifulSoup(response.content, "html.parser")
    print(html)

    # Extracting titles and summaries
    titles += html.select("dl > dd.articleSubject > a") + html.select(
        "dl > dt.articleSubject > a"
    )
    summaries += html.select("dl > dd.articleSummary")
    title_list = [i["title"] for i in titles]
    title_list = [s.replace("\xa0", "") for s in title_list]
    for i in range(len(summaries)):
        span_elements = summaries[i].find_all("span")
        for span_element in span_elements:
            span_element.decompose()
    summary_list = [i.text for i in summaries]
    summary_list = [s.strip("\n, \t") for s in summary_list]
    news_list = pd.DataFrame({"title": title_list, "summary": summary_list})

news_list.to_csv("news_list.csv", index=False)
