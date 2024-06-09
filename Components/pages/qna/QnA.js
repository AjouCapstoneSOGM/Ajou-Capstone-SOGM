import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider } from "@rneui/base";
import { getUsertoken } from "../../utils/localStorageUtils";
import urls from "../../utils/urls";
import AppText from "../../utils/AppText";
import { timeAgo } from "../../utils/utils";

const QnA = ({ navigation }) => {
  const [qnaList, setQnaList] = useState([]);
  const [qnaResult, setQnaResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");

  const handleSelectedId = (id) => {
    if (selectedId !== id) setSelectedId(id);
    else if (selectedId === id) setSelectedId("");
  };

  const handleQnaDelete = async () => {
    const result = await fetchQnADelete();
    if (result === "success") {
      Alert.alert("삭제 완료", "삭제가 완료되었습니다.", [
        {
          text: "확인",
          onPress: async () => {
            await loadQna();
          },
          style: "cancel",
        },
      ]);
    } else if (result === "fail") {
      Alert.alert("삭제 실패", "삭제에 실패했습니다.", [
        {
          text: "확인",
          onPress: () => {},
          style: "cancel",
        },
      ]);
    }
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
        return "success";
      } else {
        throw new Error("qna delete error");
      }
    } catch (error) {
      console.log(error);
      return "fail";
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
  const loadQna = async () => {
    const qnaLists = await fetchQnAList();
    const qnaIdList = qnaLists.map((qna) => qna.id);
    const qnaResults = await getQnaResults(qnaIdList);

    setQnaList(qnaLists);
    setQnaResult(qnaResults);
    setLoading(false);
  };
  useEffect(() => {
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
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => {
            navigation.navigate("QnACreate");
          }}
        >
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
              const result = qnaResult.find((result) => result.id === qna.id);
              return (
                <React.Fragment>
                  <TouchableOpacity
                    key={index}
                    style={styles.qnaItem}
                    onPress={() => handleSelectedId(index)}
                  >
                    <View>
                      <AppText style={{ color: "#f0f0f0", fontSize: 17 }}>
                        {qna.title}
                      </AppText>
                      <AppText style={{ color: "#999", fontSize: 13 }}>
                        {timeAgo(qna.createdDate)}
                      </AppText>
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
                    <React.Fragment>
                      <View style={styles.qnaContent}>
                        <View style={{ marginBottom: 10 }}>
                          <AppText
                            style={{
                              color: "#999",
                              fontSize: 25,
                              marginBottom: 10,
                            }}
                          >
                            내용
                          </AppText>
                          <AppText style={{ color: "#333" }}>
                            {result?.content}
                          </AppText>
                        </View>
                        {qna.answered && (
                          <View style={{ marginBottom: 10 }}>
                            <AppText
                              style={{
                                color: "#999",
                                fontSize: 25,
                                marginBottom: 10,
                              }}
                            >
                              답변
                            </AppText>
                            <AppText style={{ color: "#333" }}>
                              {result?.answer}
                            </AppText>
                          </View>
                        )}
                      </View>
                      <Button
                        title="삭제"
                        type="clear"
                        titleStyle={{ color: "#ff5858" }}
                        containerStyle={{ alignSelf: "flex-end" }}
                        onPress={() => {
                          handleQnaDelete(qna.id);
                        }}
                      />
                    </React.Fragment>
                  )}
                </React.Fragment>
              );
            })
          )}
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  qnaList: {
    marginVertical: 20,
  },
  qnaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  qnaContent: {
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
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
