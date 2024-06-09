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
import { TextInput } from "react-native-gesture-handler";
import { height } from "../../utils/utils";

const QnACreate = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleQnaCreate = async () => {
    const result = await fetchQnACreate();
    console.log(result);
    if (result === "success") {
      Alert.alert("문의 완료", "문의 요청이 완료되었습니다.", [
        {
          text: "확인",
          onPress: () => {
            navigation.goBack();
          },
          style: "cancel",
        },
      ]);
    } else if (result === "fail") {
      Alert.alert("문의 실패", "문의 요청에 실패했습니다.", [
        {
          text: "확인",
          onPress: () => {},
          style: "cancel",
        },
      ]);
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
        return "success";
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      return "fail";
    }
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
        <AppText style={{ fontSize: 30, fontWeight: "bold" }}>문의하기</AppText>
      </View>
      <View style={styles.settingList}>
        <View style={styles.qnaContentContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={setTitle}
            value={title}
            multiline={true}
            numberOfLines={3}
            placeholder="제목"
          />
        </View>
        <Divider />
        <View style={styles.qnaContentContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={setContent}
            value={content}
            multiline={true}
            numberOfLines={15}
            placeholder="내용"
          />
        </View>
      </View>
      <View style={styles.nextButtonContainer}>
        <Button
          buttonStyle={styles.nextButton}
          title="보내기"
          onPress={handleQnaCreate}
          disabled={title.length === 0 || content.length === 0}
        />
      </View>
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
    flex: 1,
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  qnaContentContainer: {
    marginVertical: 10,
  },
  textInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    textAlignVertical: "top",
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
});

export default QnACreate;
