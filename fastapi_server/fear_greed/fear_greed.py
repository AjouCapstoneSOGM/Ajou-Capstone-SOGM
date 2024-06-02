import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def get_yesterday_fear_and_greed():
    # headless 모드로 설정
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")

    # 드라이버 초기화
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()), options=options
    )

    # 페이지 로드를 최대 10초간 기다림
    driver.implicitly_wait(60)

    # 페이지 방문
    driver.get(url="https://edition.cnn.com/markets/fear-and-greed")

    # 요소가 로드될 때까지 기다림
    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                "/html/body/div[1]/section[4]/section[1]/section[1]/div/section/div[1]/div[2]/div[1]/div/div[1]/div[2]/div[1]/div[2]/div[2]",
            )
        )
    )

    # 텍스트 가져오기
    yesterday_ago = element.text
    driver.quit()  # 드라이버 닫기

    return int(yesterday_ago)


# 함수 호출하여 어제의 값을 가져오기
yesterday_fear_and_greed = get_yesterday_fear_and_greed()
print(yesterday_fear_and_greed)
