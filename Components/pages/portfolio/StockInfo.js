import { Button, Overlay, Tooltip, color } from "@rneui/base";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import urls from "../../utils/urls";
import { getUsertoken } from "../../utils/localStorageUtils";
import Loading from "../../utils/Loading";
import AppText from "../../utils/AppText";
import ModalComponent from "../../utils/Modal";
import { width, height } from "../../utils/utils";

const StockInfo = ({ isVisible, onToggle, ticker }) => {
  const [loading, setLoading] = useState(true);
  const [infoVisible, setInfoVisible] = useState(false);
  const [infoContent, setInfoContent] = useState("");
  const [info, setInfo] = useState({
    name: "default",
    ticker: "000000",
    roe: 0,
    roa: 0,
    per: 0,
    pbr: 0,
    month12: 0,
  });

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
        setInfo(data);
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
        await stockInfo(ticker);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    loadInfo();
  }, [ticker]);

  return (
    <ModalComponent isVisible={isVisible} onToggle={onToggle}>
      {loading && <Loading />}
      {!loading && (
        <React.Fragment>
          <View style={styles.title}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AppText
                style={{ color: "#888", fontSize: 20, marginHorizontal: 10 }}
              >
                종목 정보
              </AppText>
            </View>
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
              <AppText style={styles.columnText}>분야 내 순위</AppText>
            </View>
            <View style={styles.stockColumn}>
              <Button
                containerStyle={styles.stockinfoButton}
                type="clear"
                onPress={() => {
                  setInfoContent(
                    "ROE는 'Return on Equity'의 줄임말이에요.\n이 지표는 기업이 주주들에게 얼마나 많은 돈을 벌어다주는지를 보여주는 거에요.\nROE가 높을수록 기업이 주주들에게 더 많은 수익을 만들어내는 것이기 때문에 ROE가 높을수록 좋은 회사에요."
                  );
                  toggleInfoModal();
                }}
                icon={{
                  name: "questioncircleo",
                  type: "antdesign",
                  color: "#888",
                  size: width * 20,
                }}
              />
              <AppText style={styles.infoText}>ROE</AppText>
              <AppText style={styles.infoText}>
                {info.roe == -9900 ? "X" : info.roe}
              </AppText>
              <AppText style={styles.infoText}>
                {info.roeRank} / {info.total}
              </AppText>
            </View>
            <View style={styles.stockColumn}>
              <Button
                containerStyle={styles.stockinfoButton}
                type="clear"
                onPress={() => {
                  setInfoContent(
                    "ROA는 'Return on Assets'의 줄임말이에요.\n이 지표는 기업이 자산을 얼마나 효율적으로 활용해서 이익을 내는지를 보여주는 거에요. \nROA가 높을수록 기업이 자산을 잘 활용해서 더 많은 이익을 내는 것이기 때문에 ROA가 높을수록 좋은 회사에요."
                  );
                  toggleInfoModal();
                }}
                icon={{
                  name: "questioncircleo",
                  type: "antdesign",
                  color: "#888",
                  size: width * 20,
                }}
              />
              <AppText style={styles.infoText}>ROA</AppText>
              <AppText style={styles.infoText}>
                {" "}
                {info.roa == -9900 ? "X" : info.roa}
              </AppText>
              <AppText style={styles.infoText}>
                {info.roaRank} / {info.total}
              </AppText>
            </View>
            <View style={styles.stockColumn}>
              <Button
                containerStyle={styles.stockinfoButton}
                type="clear"
                onPress={() => {
                  setInfoContent(
                    "PER는 'Price to Earnings Ratio'의 줄임말이에요.\n이 지표는 주가가 기업의 이익에 비해 얼마나 높은지를 보여주는 거에요. \nPER가 낮을수록 투자자들이 그 주식을 더 저렴하게 사는 것이기 때문에 PER가 낮을수록 좋은 회사에요."
                  );
                  toggleInfoModal();
                }}
                icon={{
                  name: "questioncircleo",
                  type: "antdesign",
                  color: "#888",
                  size: width * 20,
                }}
              />
              <AppText style={styles.infoText}>PER</AppText>
              <AppText style={styles.infoText}>
                {" "}
                {info.per == -99 ? "X" : info.per}
              </AppText>
              <AppText style={styles.infoText}>
                {info.perRank} / {info.total}
              </AppText>
            </View>
            <View style={styles.stockColumn}>
              <Button
                containerStyle={styles.stockinfoButton}
                type="clear"
                onPress={() => {
                  setInfoContent(
                    "PBR는 'Price to Book Ratio'의 줄임말이에요.\n이 지표는 주가가 기업의 순자산에 비해 얼마나 높은지를 보여주는 거에요. \nPBR가 낮을수록 주가가 기업의 자산 가치에 비해 저평가된 것이기 때문에 PBR가 낮을수록 좋은 회사에요."
                  );
                  toggleInfoModal();
                }}
                icon={{
                  name: "questioncircleo",
                  type: "antdesign",
                  color: "#888",
                  size: width * 20,
                }}
              />
              <AppText style={styles.infoText}>PBR</AppText>
              <AppText style={styles.infoText}>{info.pbr}</AppText>
              <AppText style={styles.infoText}>
                {info.pbrRank} / {info.total}
              </AppText>
            </View>
            <View style={styles.stockColumn}>
              <Button
                containerStyle={styles.stockinfoButton}
                type="clear"
                onPress={() => {
                  setInfoContent(
                    "지난 1년 대비 주가의 변화 정도를 나타내는 지표입니다. 이 지표는 주가가 지난 1년 동안 얼마나 올랐거나 내렸는지를 보여줘요."
                  );
                  toggleInfoModal();
                }}
                icon={{
                  name: "questioncircleo",
                  type: "antdesign",
                  color: "#888",
                  size: width * 20,
                }}
              />
              <AppText style={[styles.infoText, { fontSize: 14 }]}>
                1년 수익률
              </AppText>
              <AppText style={styles.infoText}>{info.twelveMonthRet}%</AppText>
              <AppText style={styles.infoText}>
                {info.twelveMonthRetRank} / {info.total}
              </AppText>
            </View>
            <AppText style={styles.text}></AppText>
          </View>
          {infoVisible && (
            <ModalComponent isVisible={infoVisible} onToggle={toggleInfoModal}>
              <AppText style={{ fontSize: 14, color: "#fff" }}>
                {infoContent}
              </AppText>
            </ModalComponent>
          )}
        </React.Fragment>
      )}
    </ModalComponent>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#333",
  },
  overlayContent: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    position: "absolute",
    top: 0,
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  infoButton: {
    marginHorizontal: width * -20,
    padding: 0,
  },
  stockinfoButton: {
    marginHorizontal: width * -25,
    marginVertical: height * -10,
    padding: 0,
    zIndex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10,
  },
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
