import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider, Icon } from "@rneui/base";
import AppText from "../../utils/AppText";

const Information = ({ navigation }) => {
  const [index, setIndex] = useState("");

  const handleIndex = (id) => {
    if (index !== id) setIndex(id);
    else if (index === id) setIndex("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          type="clear"
          onPress={() => {
            navigation.goBack();
          }}
          icon={{ name: "left", type: "antdesign", color: "#333" }}
        />
      </View>
      <View style={styles.textContainer}>
        <AppText style={{ fontSize: 30, fontWeight: "bold" }}>설명</AppText>
      </View>
      <ScrollView style={styles.settingList}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleIndex(0)}
        >
          <Icon
            type="antdesign"
            name="down"
            color="#f0f0f0"
            size={20}
            style={{ marginRight: 10 }}
          />
          <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>
            서비스 개요
          </AppText>
        </TouchableOpacity>
        {index === 0 && (
          <TouchableOpacity
            style={styles.infoContainer}
            onPress={() => handleIndex(0)}
          >
            <AppText style={styles.infoText}>
              <AppText style={{ color: "#6495ed" }}>ETA</AppText>는 가치투자
              알고리즘을 활용하여 저평가된 주식들을 식별하고, 이 정보를 사용자
              맞춤형 투자 포트폴리오 형태로 제공하는 서비스입니다.
              {"\n"}
            </AppText>
            <AppText style={styles.infoText}>
              만들어진 포트폴리오는{" "}
              <AppText style={{ color: "#6495ed" }}>ETA</AppText>가 주기적으로
              관리해드립니다! 매일 계산을 통해 포트폴리오 속 주식들의 수량을
              적절히 조절하고, 필요시엔 이를 알려드립니다.{"\n"}
            </AppText>
            <AppText style={styles.infoText}>
              실제 투자 대신 모의 투자를 위해 서비스를 이용하는것도 가능합니다.
              {"\n"}
            </AppText>
            <AppText style={[styles.infoText, { color: "#ff5858" }]}>
              단, <AppText style={{ color: "#6495ed" }}>ETA</AppText>는 실제
              주식 거래 서비스를 제공하지 않습니다. 대신, 알려드린 정보를 토대로
              타 서비스에서 직접 주식을 거래해주세요.
            </AppText>
          </TouchableOpacity>
        )}
        <Divider />
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleIndex(1)}
        >
          <Icon
            type="antdesign"
            name="down"
            color="#f0f0f0"
            size={20}
            style={{ marginRight: 10 }}
          />
          <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>
            가치 투자란?
          </AppText>
        </TouchableOpacity>
        {index === 1 && (
          <TouchableOpacity
            style={styles.infoContainer}
            onPress={() => handleIndex(1)}
          >
            <AppText style={styles.infoText}>
              <AppText style={{ color: "#6495ed" }}>가치투자</AppText>는 투자
              대상의 내재가치와 시장 가격 간의 차이를 이용하는 투자 전략입니다.
              내재가치는 기업의 실질적인 경제적 가치를 말하며, 이는 기업의 자산,
              수익성, 성장성, 경영 효율성 등 다양한 요소를 분석하여 평가됩니다.
              {"\n"}
            </AppText>
            <AppText style={styles.infoText}>
              이후 해당 주식의 본질적 가치가 시장에 인식되어 가격이 상승할
              때까지 기다리는 전략입니다. 이 방식은 장기적인 관점에서 안정적인
              수익을 추구합니다.
              {"\n"}
            </AppText>
            <AppText style={styles.infoText}>
              <AppText style={{ color: "#6495ed" }}>가치투자</AppText>는 벤저민
              그레이엄과 워런 버핏 등 많은 유명 투자자들에 의해 선호되고 실천된
              방식이기도 합니다.
            </AppText>
          </TouchableOpacity>
        )}
        <Divider />
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleIndex(2)}
        >
          <Icon
            type="antdesign"
            name="down"
            color="#f0f0f0"
            size={20}
            style={{ marginRight: 10 }}
          />
          <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>리밸런싱</AppText>
        </TouchableOpacity>
        {index === 2 && (
          <TouchableOpacity
            style={styles.infoContainer}
            onPress={() => handleIndex(2)}
          >
            <AppText style={styles.infoText}>
              <AppText style={{ color: "#6495ed" }}>리밸런싱</AppText>의 주요
              목적은 투자자의 위험 수용 능력과 목표에 맞게 포트폴리오를 유지하는
              것입니다.{"\n"}
            </AppText>
            <AppText style={styles.infoText}>
              예를 들어, 주식이 크게 상승하여 포트폴리오에서 차지하는 비율이
              커진 경우, 이는 전체 포트폴리오의 위험도를 증가시킬 수 있습니다.{" "}
              <AppText style={{ color: "#6495ed" }}>리밸런싱</AppText>을 통해
              이러한 비율을 조정함으로써 원래의 위험 수준을 유지할 수 있습니다.
              {"\n"}
            </AppText>
            <AppText style={styles.infoText}>
              <AppText style={{ color: "#6495ed" }}>리밸런싱</AppText>은
              포트폴리오에서 비율이 높아진 자산을 매도하거나 낮아진 자산을
              매수하는 방식으로 이루어집니다.{"\n"}
            </AppText>
            <AppText style={styles.infoText}>
              이러한 <AppText style={{ color: "#6495ed" }}>리밸런싱</AppText>의{" "}
              정보는 알림을 통해 사용자에게 제공됩니다.
            </AppText>
          </TouchableOpacity>
        )}
        <Divider />
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleIndex(3)}
        >
          <Icon
            type="antdesign"
            name="down"
            color="#f0f0f0"
            size={20}
            style={{ marginRight: 10 }}
          />
          <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>
            자동 포트폴리오
          </AppText>
        </TouchableOpacity>
        {index === 3 && (
          <TouchableOpacity
            style={styles.infoContainer}
            onPress={() => handleIndex(3)}
          >
            <AppText style={styles.infoText}>
              저평가된 주식 종목 정보를 제공해주는{" "}
              <AppText style={{ color: "#6495ed" }}>ETA</AppText>의 주요
              서비스입니다.{"\n"}
            </AppText>
            <AppText style={styles.infoText}>
              운용할 금액과 감당할 수 있는 위험도, 관심있는 분야를 선택해주시면
              그에 알맞은 종목과 수량을 계산하여 정보를 제공해드립니다.
              {"\n"}
            </AppText>
            <AppText style={styles.infoText}>
              또한 주기적인 계산을 통해 종목들의 리밸런싱 정보도 제공해
              드립니다.{"\n"}
            </AppText>
            <AppText style={[styles.infoText, { color: "#ff5858" }]}>
              단, 처음 만들어진 포트폴리오는 주식이 담겨있지 않은 상태로
              제공됩니다. 상세 페이지에서 직접 추가를 완료하고 포트폴리오를
              활성화 시켜주세요.
            </AppText>
          </TouchableOpacity>
        )}
        <Divider />
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleIndex(4)}
        >
          <Icon
            type="antdesign"
            name="down"
            color="#f0f0f0"
            size={20}
            style={{ marginRight: 10 }}
          />
          <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>
            수동 포트폴리오
          </AppText>
        </TouchableOpacity>
        {index === 4 && (
          <TouchableOpacity
            style={styles.infoContainer}
            onPress={() => handleIndex(4)}
          >
            <AppText style={styles.infoText}>
              직접 종목을 골라 포트폴리오를 구성해볼 수 있는 기능입니다.{"\n"}
            </AppText>
            <AppText style={styles.infoText}>
              원하는 종목과 수량을 입력해주시면 그대로 포트폴리오가 생성됩니다.
              {"\n"}
            </AppText>
            <AppText style={styles.infoText}>
              제공되는 종목의 가치정보를 확인하면서 저평가된 주식이 있는지 직접
              찾아보고 만들어보세요.{"\n"}
            </AppText>
            <AppText style={[styles.infoText, { color: "#ff5858" }]}>
              단, 수동 포트폴리오는 리밸런싱 서비스의 대상이 아닙니다.
            </AppText>
          </TouchableOpacity>
        )}
        <Divider />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#f0f0f0",
  },
  header: {
    height: 60,
    alignItems: "flex-start",
  },
  textContainer: {
    height: 90,
    padding: 20,
  },
  settingList: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  infoContainer: {
    marginVertical: 10,
  },
  infoText: {
    color: "#f0f0f0",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
});

export default Information;
