import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import debounce from "lodash.debounce";
import Icon from "react-native-vector-icons/AntDesign";

const SearchStocks = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const ex_stocks = [
    "삼성전자",
    "SK하이닉스",
    "네이버",
    "카카오",
    "LG화학",
    "삼성바이오로직스",
    "현대차",
    "셀트리온",
    "LG전자",
    "삼성SDI",
    "포스코홀딩스",
    "현대모비스",
    "기아",
    "신한지주",
    "KB금융",
    "카카오뱅크",
    "한국전력",
    "LG이노텍",
    "삼성물산",
    "SK이노베이션",
    "SK텔레콤",
    "하나금융지주",
    "HMM",
    "두산중공업",
    "삼성에스디에스",
    "S-Oil",
    "한국가스공사",
    "KT&G",
    "한화솔루션",
    "CJ제일제당",
  ];

  // 서버로부터 데이터를 가져오는 함수
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      //   const response = await fetch(`https://example.com/api/search?q=${query}`);
      //   const data = await response.json();
      setSuggestions(ex_stocks);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedStocks = (stock) => {
    setSelectedStocks((prevSelectedStocks) => {
      const isSelected = prevSelectedStocks.some((s) => s === stock);
      if (isSelected) {
        // 이미 선택된 종목이면 제거
        return prevSelectedStocks.filter((s) => s !== stock);
      } else {
        // 선택되지 않은 종목이면 추가
        return [...prevSelectedStocks, stock];
      }
    });
  };
  // 디바운스된 fetchSuggestions 함수
  const debouncedFetchSuggestions = useRef(
    debounce(fetchSuggestions, 500)
  ).current;

  // 검색어가 변경될 때마다 디바운스된 fetchSuggestions 호출
  useEffect(() => {
    debouncedFetchSuggestions(query);
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="종목 이름으로 검색"
        value={query}
        onChangeText={setQuery}
      />
      <View style={styles.selectedContainer}>
        {selectedStocks.map((item, index) => (
          <TouchableOpacity key={index} style={styles.selectedItem}>
            <Text>{item} </Text>
            <Icon name="close" size={12} color="#222" />
          </TouchableOpacity>
        ))}
      </View>
      {loading && <ActivityIndicator size="small" color="#0000ff" />}
      <ScrollView>
        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelectedStocks(item)}
            style={styles.suggestion}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  searchBox: {
    height: 55,
    backgroundColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 18,
  },
  selectedContainer: {
    paddingVertical: 5,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 15,
    padding: 7,
    margin: 5,
  },
  suggestion: {
    paddingVertical: 18,
    marginHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default SearchStocks;
