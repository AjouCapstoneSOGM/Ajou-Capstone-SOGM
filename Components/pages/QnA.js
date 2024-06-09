import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider } from "@rneui/base";
import { getUsertoken } from "../utils/localStorageUtils";
import urls from "../utils/urls";
import AppText from "../utils/AppText";

const QnA = ({ navigation }) => {
  const [qnaList, setQnaList] = useState([]);
  const [qnaResult, setQnaResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");

  const handleSelectedId = (id) => {
    setSelectedId(id);
  };

  const fetchQnAList = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/question/list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.questions;
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchQnACreate = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/question/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });
      if (response.ok) {
        return { result: "success" };
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      return { result: "fail" };
    }
  };

  const fetchQnAModify = async (id) => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/question/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });
      if (response.ok) {
        return { result: "success" };
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      return { result: "fail" };
    }
  };

  const fetchQnADelete = async (id) => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/question/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return { result: "success" };
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      return { result: "fail" };
    }
  };

  const fetchQnAResult = async (id) => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/question/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        data.id = id;
        return data;
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const getQnaResults = async (idList) => {
    const promises = idList.map((id) => {
      return fetchQnAResult(id);
    });
    return await Promise.all(promises);
  };

  useEffect(() => {
    const loadQna = async () => {
      const qnaLists = await fetchQnAList();
      const qnaIdList = qnaLists.map((qna) => qna.id);
      const qnaResults = await getQnaResults(qnaIdList);

      //setQnaList(qnaList);
      setQnaList([
        {
          id: 0,
          title: 테스트제목1,
          created_date: "2024-05-05",
          answered: true,
        },
        {
          id: 1,
          title: 테스트제목2,
          created_date: "2024-05-05",
          answered: false,
        },
      ]);

      setQnaResult(qnaResults);
      setLoading(false);
    };
    loadQna();
  }, []);

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
        <AppText style={{ fontSize: 30, fontWeight: "bold" }}>문의하기</AppText>
      </View>
      <ScrollView style={styles.settingList}>
        <TouchableOpacity style={styles.settingItem} onPress={() => {}}>
          <AppText style={{ color: "#f0f0f0", fontSize: 18 }}>
            문의 보내기
          </AppText>
        </TouchableOpacity>
        <Divider />
        <View style={styles.settingItem}>
          <AppText style={{ color: "#f0f0f0", fontSize: 25 }}>
            내 문의 목록
          </AppText>
        </View>
        <Divider />
        <View style={styles.qnaList}>
          {qnaList.length === 0 ? (
            <AppText style={[styles.text, { color: "#aaa" }]}>
              문의 내역이 없습니다.
            </AppText>
          ) : (
            qnaList.map((qna, index) => {
              const result = qnaResult.find((result) => result.id === qna);
              return (
                <React.Fragment>
                  <TouchableOpacity
                    key={index}
                    style={styles.qnaItem}
                    onPress={() => handleSelectedId(index)}
                  >
                    <View>
                      <AppText>{qna.title}</AppText>
                      <AppText>{qna.created_date}</AppText>
                    </View>
                    <AppText
                      style={[
                        styles.text,
                        { color: qna.answered ? "#93ff93" : "#ff5858" },
                      ]}
                    >
                      {qna.answered ? "답변완료" : "답변 중"}
                    </AppText>
                  </TouchableOpacity>
                  <Divider />
                  {selectedId === index && (
                    <View>
                      <AppText>내용</AppText>
                      <AppText>{result.content}</AppText>
                      <AppText>답변</AppText>
                      <AppText>{result.answer}</AppText>
                    </View>
                  )}
                </React.Fragment>
              );
            })
          )}
        </View>
      </ScrollView>
      {/* <ModalComponent
        isVisible={pwModalVisible}
        onToggle={togglePwModalVisible}
      >
        <View style={styles.textInputContainer}>
          <AppText style={{ flex: 1, fontSize: 11, color: "#f0f0f0" }}>
            새 비밀번호
          </AppText>
          <TextInput
            secureTextEntry
            style={styles.passwordInput}
            onChangeText={setPassword}
            value={password}
          ></TextInput>
        </View>
        {password && password.length < 10 && (
          <AppText style={{ fontSize: 12, color: "#ff5858" }}>
            비밀번호는 10자리 이상이어야 합니다.
          </AppText>
        )}
        <View style={styles.textInputContainer}>
          <AppText style={{ flex: 1, fontSize: 11, color: "#f0f0f0" }}>
            새 비밀번호 확인
          </AppText>
          <TextInput
            secureTextEntry
            style={styles.passwordInput}
            onChangeText={setPwCheck}
            value={pwCheck}
          ></TextInput>
        </View>
        {pwCheck && pwCheck != password && (
          <AppText style={{ fontSize: 12, color: "#ff5858" }}>
            비밀번호를 정확히 입력해주세요.
          </AppText>
        )}
        <Button
          buttonStyle={styles.submitButton}
          title="변경"
          onPress={handleChangedPassword}
          disabled={!pwValid}
        />
      </ModalComponent>
      <ModalComponent
        isVisible={nameModalVisible}
        onToggle={toggleNameModalVisible}
      >
        <View style={styles.textInputContainer}>
          <AppText style={{ flex: 1, fontSize: 11, color: "#f0f0f0" }}>
            새 닉네임
          </AppText>
          <TextInput
            style={styles.passwordInput}
            onChangeText={setNewUserName}
            value={newUserName}
          ></TextInput>
        </View>
        <Button
          buttonStyle={styles.submitButton}
          title="변경"
          onPress={handleChangedName}
          disabled={newUserName.length == 0}
        />
      </ModalComponent> */}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  qnaList: {
    marginVertical: 20,
  },
  qnaItem: {},
  text: {
    color: "#f0f0f0",
    fontSize: 15,
  },
  textInputContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 2,
    color: "#f0f0f0",
    borderBottomColor: "#777",
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  submitButton: {
    backgroundColor: "#6262e8",
    borderRadius: 10,
    height: 40,
    marginVertical: 10,
  },
});

export default QnA;
