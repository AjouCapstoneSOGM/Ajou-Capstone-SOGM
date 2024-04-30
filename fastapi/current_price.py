def get_current_price(ticker):
    import requests

    url = f"https://finance.naver.com/item/main.naver?code={ticker}"
    response = requests.get(url)
    if response.status_code == 200:
        content = response.text
        start_index = content.find("<dd>현재가 ") + len("<dd>현재가 ")
        end_index = content.find(" ", start_index)
        current_price = content[start_index:end_index].replace(",", "")
        return current_price
    else:
        return None


# tickers = ["005930", "000020", "009470"]
# for i in range(10):
#     for ticker in tickers:
#         current_price = get_current_price(ticker)
