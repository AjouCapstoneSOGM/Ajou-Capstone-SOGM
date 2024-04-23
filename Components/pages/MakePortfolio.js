import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // FontAwesome 아이콘 사용

const MakePortfolio = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [portIsAuto, setPortIsAuto] = useState(null);
  const [portMoney, setPortMoney] = useState(null);

  const submitUserInfo = () => {
    navigation.replace("ViewPortfolio");
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handlePortisAuto = (e) => {
    setPortIsAuto(e.target.value);
  };
  return (
    <View style={styles.container}>
      {step === 0 && (
        <View style={styles.buttonContainer}>
          <Text>Step 1: 포트폴리오 유형을 선택해주세요</Text>
          <TouchableOpacity
            style={[
              styles.makePortButton,
              portIsAuto === true ? styles.makePortButtonActive : {},
            ]}
            onPress={() => {
              setPortIsAuto(true);
            }}
          >
            {portIsAuto === true && (
              <Icon name="check" size={20} style={styles.contentsButtonIcon} />
            )}
            <Text style={styles.makePortButtonText}>자동</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.makePortButton,
              portIsAuto === false ? styles.makePortButtonActive : {},
            ]}
            onPress={() => {
              setPortIsAuto(false);
            }}
          >
            {portIsAuto === false && (
              <View style={styles.contentsButtonIconContainer}>
                <Icon
                  name="check"
                  size={20}
                  style={styles.contentsButtonIcon}
                />
              </View>
            )}
            <Text style={styles.makePortButtonText}>수동</Text>
          </TouchableOpacity>
          <Button
            title="Next"
            disabled={portIsAuto === null}
            onPress={nextStep}
          />
        </View>
      )}
      {/*  */}
      {/* 자동 */}
      {/*  */}
      {step === 1 && portIsAuto === true && (
        <View style={styles.buttonContainer}>
          <Text>Step 2: 자동 포트폴리오 생성</Text>
          <TouchableOpacity style={styles.makePortButton}>
            <Text>자동테스트1-1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.makePortButton}>
            <Text>자동테스트1-2</Text>
          </TouchableOpacity>
          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}
      {step === 2 && portIsAuto === true && (
        <View style={styles.buttonContainer}>
          <Text>Step 3: 자동 포트폴리오 생성2</Text>
          <TouchableOpacity style={styles.makePortButton}>
            <Text>자동테스트2-1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.makePortButton}>
            <Text>자동테스트2-2</Text>
          </TouchableOpacity>
          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}
      {step === 3 && portIsAuto === true && (
        <View style={styles.buttonContainer}>
          <Text>Step 4: 자동 포트폴리오 생성3</Text>
          <TouchableOpacity style={styles.makePortButton}>
            <Text>자동테스트3-1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.makePortButton}>
            <Text>자동테스트3-2</Text>
          </TouchableOpacity>
          <Button title="Submit" onPress={() => submitUserInfo()} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}
      {/*  */}
      {/* 수동 */}
      {/*  */}
      {step === 1 && portIsAuto === false && (
        <View style={styles.buttonContainer}>
          <Text>Step 2: 수동 포트폴리오 생성</Text>
          <TouchableOpacity style={styles.makePortButton}>
            <Text>수동테스트1-1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.makePortButton}>
            <Text>수동테스트1-2</Text>
          </TouchableOpacity>
          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}
      {step === 2 && portIsAuto === false && (
        <View style={styles.buttonContainer}>
          <Text>Step 3: 수동 포트폴리오 생성2</Text>
          <TouchableOpacity style={styles.makePortButton}>
            <Text>수동테스트2-1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.makePortButton}>
            <Text>수동테스트2-2</Text>
          </TouchableOpacity>
          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}
      {step === 3 && portIsAuto === false && (
        <View style={styles.buttonContainer}>
          <Text>Step 4: 수동 포트폴리오 생성3</Text>
          <TouchableOpacity style={styles.makePortButton}>
            <Text>수동테스트3-1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.makePortButton}>
            <Text>수동테스트3-2</Text>
          </TouchableOpacity>
          <Button title="Submit" onPress={() => submitUserInfo()} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 5,
  },
  buttonContainer: {
    alignItems: "center",
  },
  makePortButton: {
    flexDirection: "row", // 내부 요소를 가로로 배열
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#ddd",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
  },
  makePortButtonText: {
    flex: 1,
    textAlign: "center", // 텍스트를 중앙 정렬
  },
  makePortButtonActive: {
    backgroundColor: "#E5FFDD", // 활성화 상태에서의 테두리 색상
  },
  contentsButtonIconContainer: {
    width: 30, // 고정된 크기를 가진 아이콘 컨테이너
    alignItems: "center",
  },
  contentsButtonIcon: {
    color: "#4CAF50", // 아이콘 색상
    flex: 0,
  },
});
export default MakePortfolio;
