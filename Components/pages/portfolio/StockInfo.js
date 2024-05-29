import { Button, Overlay, Tooltip, color } from "@rneui/base";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import urls from "../../utils/urls";
import { getUsertoken } from "../../utils/localStorageUtils";
import Loading from "../../utils/Loading";
import AppText from "../../utils/AppText";
import InfoModal from "../../utils/InfoModal";

const StockInfo = ({ isVisible, onToggle, ticker }) => {
  const [loading, setLoading] = useState(true);
  const [infoVisible, setInfoVisible] = useState(false);
  const [info, setInfo] = useState({
    name: "",
    ticker: "",
    ROE: 0,
    PER: 0,
  });

  const ex_data = {
    name: "삼성전자",
    ticker: "005930",
    ROE: 1.1,
    PER: 1.1,
  };

  const toggleInfoModal = () => {
    setInfoVisible(!infoVisible);
  };

  const stockInfo = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/ticker/${ticker}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadInfo = async () => {
      try {
        // const data = await stockInfo(ticker);
        const data = ex_data;
        setInfo(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    loadInfo();
  }, []);

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onToggle}
      overlayStyle={styles.overlay}
    >
      <InfoModal isVisible={infoVisible} onToggle={toggleInfoModal}>
        이곳에 설명 입력
      </InfoModal>
      <Button
        containerStyle={styles.closeButton}
        onPress={onToggle}
        type="clear"
        icon={{ name: "close", type: "antdesign", color: "#f0f0f0" }}
      />
      {loading && <Loading />}
      {!loading && (
        <React.Fragment>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AppText style={{ color: "#888", fontSize: 20 }}>종목 정보</AppText>
            <Button
              containerStyle={styles.infoButton}
              type="clear"
              onPress={() => toggleInfoModal()}
              icon={{
                name: "questioncircleo",
                type: "antdesign",
                color: "#888",
                size: 20,
              }}
            />
          </View>
          <View style={styles.content}>
            <View style={styles.stockInfoHeader}>
              <AppText style={[styles.text, { fontSize: 25 }]}>
                {info.name}
              </AppText>
              <AppText style={[styles.text, { color: "#bbb" }]}>
                {info.ticker}
              </AppText>
            </View>
            <View style={styles.stockColumn}>
              <AppText style={styles.columnText}>가치지표</AppText>
              <AppText style={styles.columnText}>수치</AppText>
              <AppText style={styles.columnText}>순위</AppText>
            </View>
            <View style={styles.stockColumn}>
              <AppText style={styles.infoText}>ROE</AppText>
              <AppText style={styles.infoText}>{info.ROE}</AppText>
              <AppText style={styles.infoText}>순위</AppText>
            </View>
            <View style={styles.stockColumn}>
              <AppText style={styles.infoText}>PER</AppText>
              <AppText style={styles.infoText}>{info.PER}</AppText>
              <AppText style={styles.infoText}>순위</AppText>
            </View>
            <AppText style={styles.text}></AppText>
          </View>
        </React.Fragment>
      )}
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#333",
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 16,
    color: "blue",
  },
  infoButton: {},
  text: {
    fontSize: 20,
    color: "#f0f0f0",
  },
  closeButton: {
    marginHorizontal: -5,
    position: "absolute",
    top: 3,
    right: 3,
  },
  stockInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderColor: "#434343",
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  stockColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  columnText: {
    flex: 1,
    color: "#7d7d7d",
    textAlign: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 18,
    color: "#f0f0f0",
    textAlign: "center",
  },
});

export default StockInfo;
