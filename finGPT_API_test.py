from gradio_client import Client
import time

start_time = time.time()
client = Client("https://fingpt-fingpt-forecaster.hf.space/--replicas/bbyl6/")
result = client.predict(
    "AAPL",  # str  in 'Ticker' Textbox component
    "2024-03-14",  # str  in 'Date' Textbox component
    1,  # int | float (numeric value between 1 and 4) in 'n_weeks' Slider component
    False,  # bool  in 'Use Latest Basic Financials' Checkbox component
    api_name="/predict",
)
end_time = time.time()

time_taken = end_time - start_time
print(f"Time taken: {time_taken:.2f} seconds")
print(result)
