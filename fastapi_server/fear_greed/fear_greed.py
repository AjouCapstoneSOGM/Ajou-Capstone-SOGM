import fear_and_greed

def get_fear_and_greed():
    result = fear_and_greed.get()
    return int(result.value)