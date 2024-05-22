import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import debounce from "lodash.debounce";
import Icon from "react-native-vector-icons/AntDesign";
import AppText from "../../utils/AppText";
import urls from "../../utils/urls";
import { getUsertoken } from "../../utils/localStorageUtils";

const SearchStocks = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/ticker/search?text=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.searchedList);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
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

  const debouncedFetchSuggestions = useRef(
    debounce((query) => fetchSuggestions(query), 500)
  ).current;

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
          <TouchableOpacity
            key={index}
            style={styles.selectedItem}
            onPress={() => handleSelectedStocks(item)}
          >
            <AppText>{item.name} </AppText>
            <Icon name="close" size={12} color="#222" />
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView>
        {suggestions &&
          suggestions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectedStocks(item)}
              style={styles.suggestion}
            >
              <View style={{ flexDirection: "row" }}>
                <AppText>
                  {item.name}
                  {"  "}
                </AppText>
                <AppText style={{ fontSize: 13, color: "#bbb" }}>
                  {item.exchange}
                </AppText>
              </View>
              <AppText>{item.ticker}</AppText>
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
    margin: 10,
  },
  searchBox: {
    height: 55,
    backgroundColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    marginHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default SearchStocks;
