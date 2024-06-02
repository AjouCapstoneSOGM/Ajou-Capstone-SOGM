import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { usePortfolio } from "../../utils/PortfolioContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, Button } from "@rneui/base";
import PagerView from "react-native-pager-view";

import AppText from "../../utils/AppText";
import FooterComponent from "../../utils/Footer";
import HeaderComponent from "../../utils/Header";
import PortfolioPieChart from "../../utils/PortfolioPieChart";
import Loading from "../../utils/Loading";
import { useAuth } from "../../utils/AuthContext";
import { width, height } from "../../utils/utils";
import ModalComponent from "../../utils/Modal";
import { removeSpecialChars } from "../../utils/utils";

const PortfolioList = ({ navigation }) => {
  const { portfolios, loadData, portLoading } = usePortfolio();
  const { userName } = useAuth();
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [changedName, setChangedName] = useState("");
  const pagerRef = useRef(null);

  const handleChangedName = (value) => {
    if (value.length < 20) setChangedName(removeSpecialChars(value));
  };

  const portfolioExist = () => {
    if (portLoading) return false;
    if (portfolios.length > 0) return true;
    return false;
  };

  const getTotalPrice = (stocks) => {
    const totalPrice = stocks.reduce(
      (acc, cur) => acc + cur.currentPrice * cur.quantity,
      0
    );
    return totalPrice;
  };

  // 포트폴리오의 총 수익률 계산 후 반환
  const getTotalROI = (detail) => {
    const benefit =
      getTotalPrice(detail.stocks) + detail.currentCash - detail.initialAsset;
    const totalROI = ((benefit / detail.initialAsset) * 100).toFixed(2);
    return totalROI;
  };

  const sumAllPrices = () => {
    if (portfolioExist()) {
      return portfolios.reduce((total, portfolio) => {
        const stockTotal = getTotalPrice(portfolio.detail.stocks);
        return total + stockTotal + portfolio.detail.currentCash;
      }, 0);
    }
    return 0;
  };

  const handlePageChange = (e) => {
    setSelectedIndex(e.nativeEvent.position);
  };

  const handlePageNext = () => {
    setSelectedIndex(selectedIndex + 1);
    pagerRef.current?.setPage(selectedIndex + 1);
  };
  const handlePagePrev = () => {
    setSelectedIndex(selectedIndex - 1);
    pagerRef.current?.setPage(selectedIndex - 1);
  };

  const reloadData = async () => {
    await loadData();
  };

  useEffect(() => {
    if (portfolios[selectedIndex])
      setChangedName(portfolios[selectedIndex]?.name);
  }, [selectedIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />
      {portLoading && <Loading />}
      <View style={styles.totalContainer}>
        <AppText style={{ fontSize: 25 }}>
          <AppText style={{ fontWeight: "bold" }}>{userName}</AppText>
          <AppText>님 총 자산</AppText>
        </AppText>
        <AppText>
          <AppText style={{ fontSize: 32, fontWeight: "bold" }}>
            {sumAllPrices().toLocaleString()}{" "}
          </AppText>
          <AppText style={{ fontSize: 20 }}>원</AppText>
        </AppText>
      </View>
      {portfolioExist() && (
        <View style={styles.chartContainer}>
          <Button
            containerStyle={{ zIndex: 1 }}
            type="clear"
            onPress={() => {
              handlePagePrev();
            }}
            icon={{
              name: "caretleft",
              type: "antdesign",
              color: "#333",
              size: 30,
            }}
            disabled={selectedIndex == 0}
            disabledStyle={{ opacity: 0 }}
          />
          <PortfolioPieChart
            data={portfolios[selectedIndex]?.detail}
            size={width * 0.9}
            mode={"light"}
          />
          <Button
            containerStyle={{ zIndex: 1 }}
            type="clear"
            onPress={() => {
              handlePageNext();
            }}
            icon={{
              name: "caretright",
              type: "antdesign",
              color: "#333",
              size: 30,
            }}
            disabled={selectedIndex == portfolios?.length - 1}
            disabledStyle={{ opacity: 0 }}
          />
        </View>
      )}
      {portfolioExist() && (
        <React.Fragment>
          <View style={styles.pageIndicator}>
            {portfolios.map((_, index) => (
              <AppText
                key={index}
                style={{ marginHorizontal: 2, color: "#333" }}
              >
                {selectedIndex === index ? "●" : "○"}
              </AppText>
            ))}
          </View>
          <PagerView
            style={styles.listContainer}
            initialPage={0}
            onPageSelected={handlePageChange}
            ref={pagerRef}
          >
            {portfolios.map((portfolio, index) => {
              const roi = getTotalROI(portfolio.detail);
              const roiFormatted = roi > 0 ? `+${roi}` : `${roi}`;
              const currentCash = portfolio.detail.currentCash;
              return (
                <View key={index}>
                  <TouchableOpacity
                    style={styles.portfolio}
                    onPress={() => {
                      navigation.navigate("PortfolioDetails", {
                        id: portfolio.id,
                      });
                    }}
                  >
                    <View style={styles.portfolioHeader}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <AppText style={{ color: "#f0f0f0" }}>
                          {portfolio.name}
                        </AppText>
                        <Button
                          type="clear"
                          onPress={() => {
                            setNameModalVisible(true);
                          }}
                          icon={{
                            name: "pencil",
                            type: "ionicon",
                            color: "#f0f0f0",
                            size: 15,
                          }}
                        />
                      </View>
                      <AppText style={{ color: "#f0f0f0" }}>
                        <AppText>
                          {portfolio.auto ? "자동" : "수동"}
                          {"  "}
                        </AppText>
                        <AppText>{portfolio.country}</AppText>
                      </AppText>
                    </View>
                    <View style={styles.portfolioContent}>
                      <AppText
                        style={{
                          fontSize: 30,
                          color: "#f0f0f0",
                        }}
                      >
                        <AppText style={{ fontWeight: "bold" }}>
                          {(
                            getTotalPrice(portfolio.detail.stocks) + currentCash
                          ).toLocaleString()}{" "}
                        </AppText>
                        <AppText style={{ fontSize: 20 }}>원</AppText>
                      </AppText>
                      <AppText
                        style={[
                          { fontSize: 17, fontWeight: "bold", marginBottom: 5 },
                          roi > 0
                            ? { color: "#ff5858" }
                            : roi < 0
                            ? { color: "#5888ff" }
                            : { color: "#666" },
                        ]}
                      >
                        {roiFormatted}%
                      </AppText>
                      <AppText
                        style={
                          portfolio.riskValue === 1
                            ? { color: "#91ff91" }
                            : portfolio.riskValue === 2
                            ? { color: "#ffbf44" }
                            : { color: "#ff5858" }
                        }
                      >
                        {portfolio.riskValue === 1
                          ? "안정투자형"
                          : portfolio.riskValue === 2
                          ? "위험중립형"
                          : portfolio.riskValue === 3
                          ? "적극투자형"
                          : ""}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </PagerView>
        </React.Fragment>
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          navigation.navigate("MakePortfolio");
        }}
      >
        <Icon name="plus" type="antdesign" color="#f0f0f0" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.reloadButton}
        onPress={() => {
          reloadData();
        }}
      >
        <Icon name="reload1" type="antdesign" color="#f0f0f0" />
      </TouchableOpacity>
      {portfolios[selectedIndex] && (
        <ModalComponent
          isVisible={nameModalVisible}
          onToggle={() => setNameModalVisible(false)}
        >
          <React.Fragment>
            <View style={styles.title}>
              <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>
                이름 변경
              </AppText>
            </View>
            <View>
              <TextInput
                style={styles.nameInput}
                placeholder={portfolios[selectedIndex]?.name}
                placeholderTextColor={"#888"}
                value={changedName}
                onChangeText={(value) => handleChangedName(value)}
              />
            </View>
            <Button
              buttonStyle={styles.submitButton}
              title="반영"
              disabled={changedName === ""}
              onPress={async () => {}}
            />
          </React.Fragment>
        </ModalComponent>
      )}
      <FooterComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#f0f0f0",
  },
  totalContainer: {
    paddingVertical: height * 15,
    paddingHorizontal: width * 15,
  },
  pageIndicator: {
    flexDirection: "row",
    alignSelf: "center",
  },
  listContainer: {
    flex: 1,
  },
  portfolio: {
    height: height * 170,
    backgroundColor: "#333",
    borderRadius: 30,
    paddingVertical: height * 15,
    paddingHorizontal: width * 25,
    marginHorizontal: width * 15,
    marginTop: height * 5,
  },
  portfolioHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 20,
  },
  portfolioContent: {
    justifyContent: "space-around",
  },
  chartContainer: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    alignSelf: "center",
    bottom: height * 110,
  },
  floatingButton: {
    position: "absolute",
    bottom: height * 90,
    right: width * 15,
    width: width * 60,
    height: width * 60,
    borderRadius: 50,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 2 }, // for iOS shadow
    shadowOpacity: 0.3, // for iOS shadow
    shadowRadius: 2, // for iOS shadow
  },
  reloadButton: {
    position: "absolute",
    bottom: height * 90,
    left: width * 15,
    width: width * 60,
    height: width * 60,
    borderRadius: 50,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 2 }, // for iOS shadow
    shadowOpacity: 0.3, // for iOS shadow
    shadowRadius: 2, // for iOS shadow
  },
  title: {
    position: "absolute",
    top: 0,
  },
  nameInput: {
    marginVertical: 20,
    color: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#434343",
  },
  submitButton: {
    backgroundColor: "#6262e8",
    borderRadius: 10,
    height: 40,
  },
});

export default PortfolioList;
