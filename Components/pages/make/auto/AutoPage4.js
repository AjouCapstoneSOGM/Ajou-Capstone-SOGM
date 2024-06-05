import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { getUsertoken } from "../../../utils/localStorageUtils";
import urls from "../../../utils/urls";
import Loading from "../../../utils/Loading";
import AppText from "../../../utils/AppText";
import { usePortfolio } from "../../../utils/PortfolioContext";
import { Button, Divider, Icon } from "@rneui/base";
import { width, height, filteringNumber } from "../../../utils/utils";
import { CommonActions, useNavigation } from "@react-navigation/native";
import ModalComponent from "../../../utils/Modal";
import { TextInput } from "react-native-gesture-handler";

const AutoPage4 = ({ step, setStep, amount, riskLevel, interest }) => {
  const navigation = useNavigation();
  const {
    fetchStocksByPortfolioId,
    fetchRebalanceList,
    loadData,
    fetchModify,
  } = usePortfolio();
  const [loading, setLoading] = useState(true);
  const [rnId, setRnId] = useState("");
  const [pfId, setPfId] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [initRebalance, setInitRebalance] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [infoContent, setInfoContent] = useState("");
  const [infoVisible, setInfoVisible] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [checkList, setCheckList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modifyIndex, setModifyIndex] = useState("");

  const handleCheckList = (index) => {
    setCheckList((prevIndices) => {
      // 인덱스가 이미 존재하는지 확인
      const currentIndex = prevIndices.indexOf(index);
      if (currentIndex === -1) {
        // 인덱스가 존재하지 않으면 추가
        return [...prevIndices, index];
      } else {
        // 인덱스가 존재하면 제거
        return prevIndices.filter((i) => i !== index);
      }
    });
  };

  const handleChangePrice = (value) => {
    const newRebalances = [...initRebalance];
    if (value <= 9999999)
      newRebalances[modifyIndex].price = filteringNumber(value);
    setInitRebalance(newRebalances);
  };

  const toggleInfoModal = () => {
    setInfoVisible(!infoVisible);
  };

  const toggleModifyModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleSelectedId = (index) => {
    if (selectedId === index) setSelectedId(null);
    else setSelectedId(index);
  };

  const getRemainCash = () => {
    const initialAsset = portfolio?.initialAsset;
    const totalPrice = initRebalance?.reduce(
      (acc, cur) => acc + Number(cur.price) * Number(cur.quantity),
      0
    );
    return initialAsset - totalPrice;
  };
  const isChecked = (index) => {
    const currentIndex = checkList.indexOf(index);
    if (currentIndex === -1) return false;
    else return true;
  };

  const handleSort = (prop) => {
    setIsAscending(!isAscending);

    if (prop === "name") {
      setInitRebalance(
        [...initRebalance].sort((a, b) => {
          return isAscending
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        })
      );
    } else {
      setInitRebalance(
        [...initRebalance].sort((a, b) => {
          const sortFactor = isAscending ? 1 : -1;
          return (a[prop] - b[prop]) * sortFactor;
        })
      );
    }
  };

  const updateKey = (rebalance) => {
    const updated = rebalance.map((stock) => {
      return {
        isBuy: stock.isBuy,
        quantity: Number(stock.quantity),
        price: parseFloat(stock.price),
        ticker: stock.ticker,
      };
    });

    return updated;
  };

  const handleModify = async () => {
    const rebalanceData = updateKey([...initRebalance]);
    await fetchModify(rebalanceData, pfId, rnId);
    await loadData();
  };

  useEffect(() => {
    if (pfId) {
      const loadPortfolio = async () => {
        const portfolio = await fetchStocksByPortfolioId(pfId);
        const rebalance = await fetchRebalanceList(pfId);
        setPortfolio(portfolio);
        setRnId(rebalance[0].rnId);
        setInitRebalance(rebalance[0].rebalancings);
        setLoading(false);
      };
      loadPortfolio();
    }
  }, [pfId]);

  useEffect(() => {
    const fetchAutoInfo = async () => {
      try {
        const token = await getUsertoken();
        const response = await fetch(
          `${urls.springUrl}/api/portfolio/create/auto`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              country: "KOR",
              sector: [interest],
              asset: amount,
              riskValue: riskLevel,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPfId(data.pfId);
          console.log("Success:", data);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
        throw error;
      }
    };

    if (portfolio.length === 0) fetchAutoInfo();
  }, []);

  const gotoDetailPage = async () => {
    await loadData();
    navigation.dispatch(
      CommonActions.reset({
        index: 2,
        routes: [
          { name: "Home" },
          { name: "ViewPortfolio" },
          { name: "PortfolioDetails", params: { id: pfId } },
        ],
      })
    );
  };

  if (loading)
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <AppText style={styles.titleText}>
            {"\n"}
            {"\n"}
          </AppText>
        </View>
        <View style={styles.contentsContainer}>
          <Loading />
        </View>
      </View>
    );

  // const result1 = () => {
  //   return (
  //     <View style={styles.pageContainer}>
  //       <View style={styles.infoContainer}>
  //         <AppText
  //           style={{ color: "#f0f0f0", fontSize: 18, fontWeight: "bold" }}
  //         >
  //           현재 기업들의 가치지표 순위에 따라 다음과 같은 종목이 선별되었어요
  //         </AppText>
  //       </View>
  //       <View style={styles.column}>
  //         <AppText style={styles.columnName}>종목</AppText>
  //         <View style={styles.tickerBox}>
  //           <AppText style={styles.columnTicker}>티커</AppText>
  //           <Button
  //             containerStyle={styles.stockinfoButton}
  //             type="clear"
  //             onPress={() => {
  //               setInfoContent(
  //                 "티커(ticker)란 주식 시장에서 회사의 주식을 대표하는 고유한 심볼이나 일련번호를 말합니다. 티커는 주로 주식의 거래를 쉽게 식별하고 추적할 수 있게 해주는 목적으로 사용되며, 주식 거래소에서는 이 티커 심볼을 이용하여 주식이 실시간으로 거래되는 것을 보여줍니다."
  //               );
  //               toggleInfoModal();
  //             }}
  //             icon={{
  //               name: "questioncircleo",
  //               type: "antdesign",
  //               color: "#888",
  //               size: width * 20,
  //             }}
  //           />
  //         </View>
  //       </View>
  //       <View style={styles.labelContainer}>
  //         <ScrollView persistentScrollbar={true}>
  //           {portfolio.stocks.map(
  //             (stock, index) =>
  //               stock.equity === "보통주" && (
  //                 <TouchableOpacity
  //                   key={index}
  //                   style={styles.labelItemContent}
  //                   onPress={() => handleSelectedId(index)}
  //                 >
  //                   <AppText style={styles.itemName}>
  //                     {stock.companyName}
  //                   </AppText>
  //                   <AppText style={styles.itemTicker}>{stock.ticker}</AppText>
  //                 </TouchableOpacity>
  //               )
  //           )}
  //         </ScrollView>
  //       </View>
  //     </View>
  //   );
  // };
  // const result2 = () => {
  //   return (
  //     <View style={styles.pageContainer}>
  //       <View style={styles.infoContainer}>
  //         <AppText
  //           style={{ color: "#f0f0f0", fontSize: 18, fontWeight: "bold" }}
  //         >
  //           그리고 두 개의 안전자산을 포함시킬게요{"\n"}
  //         </AppText>
  //       </View>
  //       <View style={styles.column}>
  //         <AppText style={styles.columnName}>종목</AppText>
  //         <View style={styles.tickerBox}>
  //           <AppText style={styles.columnTicker}>티커</AppText>
  //           <Button
  //             containerStyle={styles.stockinfoButton}
  //             type="clear"
  //             onPress={() => {
  //               setInfoContent(
  //                 "티커(ticker)란 주식 시장에서 회사의 주식을 대표하는 고유한 심볼이나 일련번호를 말합니다. 티커는 주로 주식의 거래를 쉽게 식별하고 추적할 수 있게 해주는 목적으로 사용되며, 주식 거래소에서는 이 티커 심볼을 이용하여 주식이 실시간으로 거래되는 것을 보여줍니다."
  //               );
  //               toggleInfoModal();
  //             }}
  //             icon={{
  //               name: "questioncircleo",
  //               type: "antdesign",
  //               color: "#888",
  //               size: width * 20,
  //             }}
  //           />
  //         </View>
  //       </View>
  //       <View style={styles.labelContainer}>
  //         <ScrollView>
  //           {portfolio.stocks.map(
  //             (stock, index) =>
  //               stock.equity === "안전자산" && (
  //                 <TouchableOpacity
  //                   key={index}
  //                   style={styles.labelItemContent}
  //                   onPress={() => handleSelectedId(index)}
  //                 >
  //                   <AppText style={styles.itemName}>
  //                     {stock.companyName}
  //                   </AppText>
  //                   <AppText style={styles.itemTicker}>{stock.ticker}</AppText>
  //                 </TouchableOpacity>
  //               )
  //           )}
  //         </ScrollView>
  //       </View>
  //       <AppText style={styles.safeinfoText}>안전자산이란?</AppText>
  //       <AppText style={styles.safeinfoText}>
  //         시장이 불안정해도 가치가 잘 보존되는 경향이 있는 자산을 뜻해요. 주로
  //         금, 달러와 같은 종목으로 구성돼요.
  //       </AppText>
  //     </View>
  //   );
  // };
  const result3 = () => {
    return (
      <View style={styles.pageContainer}>
        <View>
          <AppText
            style={{
              color: "#f0f0f0",
              marginBottom: 10,
              fontWeight: "bold",
            }}
          >
            주식 매수를 진행하고, 완료된 종목은 체크해주세요.
          </AppText>
        </View>
        <View style={styles.column}>
          <Icon
            name="checkcircle"
            type="antdesign"
            color="#333"
            size={15}
            style={{ marginRight: 5 }}
          />
          <Button
            title="기업명"
            type="clear"
            containerStyle={styles.columnName}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {
              handleSort("name");
            }}
            icon={{
              type: "antdesign",
              name: "caretdown",
              color: "#808080",
              size: 11,
            }}
            iconPosition="right"
          />
          <Button
            title="수량"
            type="clear"
            containerStyle={styles.columnNumber}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {
              handleSort("quantity");
            }}
            icon={{
              type: "antdesign",
              name: "caretdown",
              color: "#808080",
              size: 11,
            }}
            iconPosition="right"
          />
          <Button
            title="총 금액"
            type="clear"
            containerStyle={styles.columnPrice}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {
              handleSort("price");
            }}
            icon={{
              type: "antdesign",
              name: "caretdown",
              color: "#808080",
              size: 11,
            }}
            iconPosition="right"
          />
        </View>
        <ScrollView>
          {initRebalance.map((stock, index) => (
            <TouchableOpacity
              key={index}
              style={styles.labelItemContent}
              onPress={() => handleCheckList(index)}
            >
              <Icon
                name="checkcircle"
                type="antdesign"
                color={isChecked(index) ? "#97f697" : "#808080"}
                size={15}
                style={{ marginRight: 5 }}
              />
              <View style={styles.itemNameBox}>
                <AppText style={styles.itemName}>{stock.name}</AppText>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <AppText style={styles.itemOnePrice}>
                    {Number(stock.price).toLocaleString()}원
                  </AppText>
                  <Button
                    containerStyle={{ marginHorizontal: -5 }}
                    type="clear"
                    onPress={() => {
                      setModifyIndex(index);
                      setModalVisible(true);
                    }}
                    icon={{
                      name: "pencil",
                      type: "ionicon",
                      color: "#999",
                      size: 13,
                    }}
                  />
                </View>
              </View>

              <AppText style={styles.itemNumber}>{stock.quantity}주</AppText>
              <AppText style={styles.itemPrice}>
                {(
                  Number(stock.price) * Number(stock.quantity)
                ).toLocaleString()}
                원
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.cashContainer}>
          <AppText style={{ color: "#ccc" }}>남은 현금</AppText>
          <AppText style={{ color: "#ccc" }}>
            {getRemainCash().toLocaleString()}원
          </AppText>
        </View>
        <AppText style={{ paddingBottom: 10, color: "#999", fontSize: 13 }}>
          입력되어있는 가격은 실시간 기준입니다. 만약 다를 경우 수정해주세요.
        </AppText>
        <ModalComponent isVisible={modalVisible} onToggle={toggleModifyModal}>
          <AppText
            style={{
              position: "absolute",
              top: 0,
              color: "#888",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            가격 수정
          </AppText>
          <View style={styles.content}>
            <AppText
              style={{ fontSize: 20, color: "#f0f0f0", marginVertical: 20 }}
            >
              {initRebalance[modifyIndex]?.name}
            </AppText>
            <TextInput
              style={styles.modifyPrice}
              value={String(initRebalance[modifyIndex]?.price)}
              onChangeText={(value) => handleChangePrice(value)}
            />
            <Button
              buttonStyle={styles.submitButton}
              title="확인"
              onPress={async () => {
                toggleModifyModal();
              }}
            />
          </View>
        </ModalComponent>
      </View>
    );
  };
  // const result4 = () => {
  //   return (
  //     <View style={styles.pageContainer}>
  //       <View style={styles.infoContainer}>
  //         <ScrollView>
  //           <AppText
  //             style={{ color: "#ffbf44", fontSize: 20, fontWeight: "bold" }}
  //           >
  //             아직 포트폴리오 활성화를 위한 단계가 남았어요. 한 단계씩
  //             알려드릴게요.
  //           </AppText>
  //           <Divider style={{ marginVertical: 20 }} />
  //           <AppText
  //             style={{ color: "#ffbf44", fontSize: 20, fontWeight: "bold" }}
  //           >
  //             1단계
  //           </AppText>
  //           <AppText style={{ color: "#ddd", fontSize: 16 }}>
  //             방금 보여드린 정보는 알림으로 보내드릴게요. 알림 목록을
  //             확인해주세요.
  //           </AppText>
  //           <View style={styles.imageContainer}>
  //             <Image
  //               source={require("../../../assets/images/guide.png")}
  //               style={styles.image}
  //             />
  //           </View>
  //           <Divider style={{ marginVertical: 20 }} />
  //           <AppText
  //             style={{ color: "#ffbf44", fontSize: 20, fontWeight: "bold" }}
  //           >
  //             2단계
  //           </AppText>
  //           <AppText style={{ color: "#ddd", fontSize: 16 }}>
  //             알림 정보를 바탕으로 다른 주식 거래 앱에서 주식을 구매해요.
  //           </AppText>
  //           <AppText
  //             style={{ color: "#ff5858", fontSize: 16, fontWeight: "bold" }}
  //           >
  //             저희 ETA 서비스는 실제 주식 거래 기능을 제공하지 않아요.
  //           </AppText>
  //           <Divider style={{ marginVertical: 20 }} />
  //           <AppText
  //             style={{ color: "#ffbf44", fontSize: 20, fontWeight: "bold" }}
  //           >
  //             3단계
  //           </AppText>
  //           <AppText style={{ color: "#ddd", fontSize: 16 }}>
  //             거래를 완료하면 반영하기 버튼을 눌러요. 필요에 따라 가격 정보를
  //             변경할 수 있어요.
  //           </AppText>
  //           <Divider style={{ marginVertical: 20 }} />
  //           <AppText
  //             style={{ color: "#ffbf44", fontSize: 20, fontWeight: "bold" }}
  //           >
  //             4단계
  //           </AppText>
  //           <AppText style={{ color: "#ddd", fontSize: 16 }}>
  //             포트폴리오 활성화가 완료되었어요.
  //           </AppText>
  //           <AppText
  //             style={{ color: "#f0f0f0", fontSize: 20, fontWeight: "bold" }}
  //           >
  //             이후에도 ETA가 알림을 통해 지속적으로 포트폴리오 관리를
  //             도와드릴게요!
  //           </AppText>
  //         </ScrollView>
  //       </View>
  //     </View>
  //   );
  // };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText style={styles.titleText}>
          정보를 토대로 저평가된 주식을 선별했어요.
        </AppText>
      </View>
      <View style={styles.contentsContainer}>
        {/* {step === 4 && result1()} */}
        {/* {step === 5 && result2()} */}
        {step === 4 && result3()}
        {/* {step === 7 && result4()} */}
      </View>
      <View style={styles.nextButtonContainer}>
        <Button
          buttonStyle={styles.nextButton}
          title={"완료"}
          onPress={() => {
            handleModify();
            gotoDetailPage();
          }}
          disabled={checkList.length < 12 || getRemainCash() < 0}
        />
      </View>
      <ModalComponent isVisible={infoVisible} onToggle={toggleInfoModal}>
        <AppText style={styles.infoText}>{infoContent}</AppText>
      </ModalComponent>
    </View>
  );
};

export default AutoPage4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  textContainer: {
    paddingHorizontal: width * 10,
    paddingBottom: height * 10,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    marginTop: height * -10,
    marginBottom: height * 10,
  },
  contentsContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#333",
    paddingTop: height * 20,
  },
  labelContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#333",
    paddingTop: 0,
  },
  column: {
    flexDirection: "row",
    marginBottom: height * 5,
  },
  columnName: {
    flex: 1,
    color: "#808080",
    textAlign: "center",
  },
  columnNumber: {
    flex: 1,
    color: "#808080",
    textAlign: "center",
  },
  columnPrice: {
    flex: 1,
    color: "#808080",
    textAlign: "center",
  },
  tickerBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  columnTicker: {
    color: "#808080",
    textAlign: "center",
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: height * 15,
  },
  labelItemContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 12,
    marginTop: 12,
    borderBottomColor: "#434343",
    borderBottomWidth: 1,
  },
  chartContainer: {
    alignItems: "center",
  },
  itemName: {
    flex: 1,
    color: "#f0f0f0",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  itemNumber: {
    flex: 1,
    color: "#f0f0f0",
    textAlign: "center",
    fontSize: 15,
  },
  itemNameBox: {
    flex: 1,
  },
  itemPrice: {
    flex: 1,
    color: "#f0f0f0",
    textAlign: "center",
    fontSize: 15,
  },
  itemOnePrice: {
    color: "#999",
    textAlign: "center",
    fontSize: 12,
  },
  itemTicker: {
    flex: 1,
    color: "#f0f0f0",
    textAlign: "center",
    fontSize: 15,
  },
  imageContainer: {
    marginVertical: 30,
    width: "100%",
    height: 200,
    borderColor: "#888",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  nextButton: {
    backgroundColor: "#6262e8",
    borderRadius: 10,
    height: height * 50,
  },
  nextButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: height * 5,
    backgroundColor: "#333",
  },
  stockinfoButton: {
    marginVertical: height * -10,
    padding: 0,
    zIndex: 1,
  },
  infoText: {
    color: "#f0f0f0",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  cashContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
    borderBottomColor: "#434343",
    borderBottomWidth: 1,
  },
  safeinfoText: {
    fontSize: 11,
    marginBottom: 3,
    color: "#999",
  },
  modifyPrice: {
    color: "#f0f0f0",
    borderBottomColor: "#434343",
    borderBottomWidth: 1,
  },
  submitButton: {
    backgroundColor: "#6262e8",
    borderRadius: 10,
    height: 40,
    marginVertical: 10,
  },
});
