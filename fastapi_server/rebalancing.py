import numpy as np


def optimize_investment(
    int_asset_num, current_price, initial_cash, initial_ratio, num_safe
):
    asset_num = int_asset_num[:-num_safe]
    remaining_decimals = int_asset_num - np.floor(int_asset_num)

    cash = (current_price * remaining_decimals).sum()
    int_asset_num_stock_all_old = int_asset_num[:-num_safe]

    max_iter = 100
    cash_hold = 0
    for _ in range(max_iter):
        invest = cash * initial_ratio[:-num_safe]
        asset_num = invest / current_price[:-num_safe]
        int_asset_num_stock = np.floor(asset_num).astype(int)
        remaining_decimals_stock = asset_num - int_asset_num_stock
        int_asset_num_stock_all = int_asset_num_stock_all_old + int_asset_num_stock

        if int_asset_num_stock_all.sum() == int_asset_num_stock_all_old.sum():
            safe_num = np.array(int_asset_num[len(int_asset_num) - num_safe :])
            int_asset_num = np.append(int_asset_num_stock_all, safe_num)
            total_invest_cash = (current_price * int_asset_num).sum()
            cash_hold = initial_cash - total_invest_cash
            break

        int_asset_num_stock_all_old = int_asset_num_stock_all
        new_cash = (current_price[:-num_safe] * remaining_decimals_stock).sum()
        if (
            (abs((cash - new_cash) / new_cash) < 0.001)
            or (cash == new_cash)
            or (new_cash == 0)
        ):
            safe_num = np.array(int_asset_num[len(int_asset_num) - num_safe :])
            int_asset_num = np.append(int_asset_num_stock_all, safe_num)
            total_invest_cash = (current_price * int_asset_num).sum()
            cash_hold = initial_cash - total_invest_cash
            break
        cash = new_cash

    return int_asset_num, cash_hold


def ratio_re(
    total_current_invest,
    current_asset_num,
    initial_ratio,
    current_price,
    average_price,
    num_safe,
):
    print(average_price)
    total_invest_money = total_current_invest
    new_asset_num = (total_invest_money * initial_ratio / current_price).astype(int)
    new_asset_num, cash_hold = optimize_investment(
        new_asset_num, current_price, total_invest_money, initial_ratio, num_safe
    )
    change_asset_num = new_asset_num - current_asset_num
    for i in range(len(change_asset_num)):
        if change_asset_num[i] > 0:
            average_price[i] = (
                (current_price[i] * change_asset_num[i])
                + (average_price[i] * (new_asset_num[i] - change_asset_num[i]))
            ) / new_asset_num[i]

    print(average_price)
    print(f"투자액에서 변화된금액:{(change_asset_num * current_price).sum()}")

    current_invest_asset = average_price * new_asset_num
    total_cash = cash_hold + current_invest_asset.sum()

    if total_cash.sum() != total_invest_money.sum():
        e = total_invest_money - total_cash
        cash_hold += e
        total_cash += e

    print(current_asset_num)
    print(change_asset_num)
    cash_hold = cash_hold.astype(int)
    current_asset_num = new_asset_num
    re = False
    print("현금보유액", cash_hold)
    print("총자산", total_cash)
    print(current_asset_num)

    return current_asset_num, change_asset_num, cash_hold, average_price, total_cash, re


def check_rebalancing(
    initial_ratio,
    adj_close,
    average_price,
    initial_asset_num,
    invest_money,
    cash_hold,
    num_safe=2,
):
    re = False

    invest_money = invest_money
    initial_ratio = initial_ratio
    current_asset_num = initial_asset_num
    cash_hold = cash_hold

    current_price = adj_close
    current_invest_asset = current_asset_num * current_price

    total_current_invest = np.append(current_invest_asset, cash_hold).sum()
    current_ratio = current_invest_asset / total_current_invest
    print(current_asset_num)
    print("현재자산평가금액", current_invest_asset.sum())
    print("현금보유", cash_hold)
    print("현재총포트폴리오평가금액", total_current_invest)

    percentage_difference = (
        np.abs((current_ratio - initial_ratio) / initial_ratio) * 100
    )
    if np.any(percentage_difference > 25):
        print("re")
        re = True

    if re:
        (
            current_asset_num,
            change_asset_num,
            cash_hold,
            average_price,
            total_cash,
            re,
        ) = ratio_re(
            total_current_invest,
            current_asset_num,
            initial_ratio,
            current_price,
            average_price,
            num_safe,
        )

    return current_asset_num, change_asset_num, cash_hold, average_price, total_cash, re
