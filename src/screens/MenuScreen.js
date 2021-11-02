import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { THEME } from "../theme";
import { useDispatch, useSelector } from "react-redux";
import { getMenu } from "../store/actions/getMenu";
import { MenuItem } from "../components/MenuItem";

export const MenuScreen = () => {
  const [state, setState] = useState({
    currentState: "/menu/drinks/coffee",
    drinks: "/menu/drinks/coffee",
    salads: "/menu/eat/salads",
    soups: "/menu/eat/soups",
    main_dishes: "/menu/eat/main_dishes",
    breakfasts: "/menu/eat/breakfasts",
    snacks: "/menu/eat/snacks",
    paste: "/menu/eat/paste",
    side_dishes: "/menu/eat/side_dishes",
    desserts: "/menu/eat/desserts",
    bakery: "/menu/eat/bakery",
  });

  // Наше меню !

  const [menuSelected, setMenuSelected] = useState({
    currentMenuSelected: "drinks",
  });

  const menuToggle = (item) => {
    setState({
      ...state,
      currentState: state[item],
    });
    setMenuSelected({
      currentMenuSelected: item,
    });
  };

  console.log(state.currentState);
  console.log(menuSelected.currentMenuSelected);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMenu(state.currentState));
  }, [state.currentState]);

  const menuData = useSelector((state) => state.menu.menu);

  //console.log("Меню скрин", menuData)

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    //dispatch(getMenu('/menu/drinks/coffee')).then(() => setRefreshing(false));
    dispatch(getMenu(state.currentState)).then(() => setRefreshing(false));
  }, [state.currentState]);

  return (
    <View style={styles.center}>
      <ScrollView
        style={styles.scrollMenu}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => menuToggle("drinks")}
          style={
            menuSelected.currentMenuSelected == "drinks"
              ? styles.menuItemBlockSelected
              : styles.menuItemBlock
          }
        >
          <Text style={styles.menuItemText}>Напитки</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => menuToggle("salads")}
          style={
            menuSelected.currentMenuSelected == "salads"
              ? styles.menuItemBlockSelected
              : styles.menuItemBlock
          }
        >
          <Text style={styles.menuItemText}>Салаты</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => menuToggle("soups")}
          style={
            menuSelected.currentMenuSelected == "soups"
              ? styles.menuItemBlockSelected
              : styles.menuItemBlock
          }
        >
          <Text style={styles.menuItemText}>Супы</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => menuToggle("main_dishes")}
          style={
            menuSelected.currentMenuSelected == "main_dishes"
              ? styles.menuItemBlockSelected
              : styles.menuItemBlock
          }
        >
          <Text style={styles.menuItemText}>Основные блюда</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => menuToggle("breakfasts")}
          style={
            menuSelected.currentMenuSelected == "breakfasts"
              ? styles.menuItemBlockSelected
              : styles.menuItemBlock
          }
        >
          <Text style={styles.menuItemText}>Завтраки</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => menuToggle("snacks")}
          style={
            menuSelected.currentMenuSelected == "snacks"
              ? styles.menuItemBlockSelected
              : styles.menuItemBlock
          }
        >
          <Text style={styles.menuItemText}>Закуски</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => menuToggle("paste")}
          style={
            menuSelected.currentMenuSelected == "paste"
              ? styles.menuItemBlockSelected
              : styles.menuItemBlock
          }
        >
          <Text style={styles.menuItemText}>Паста</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => menuToggle("side_dishes")}
          style={
            menuSelected.currentMenuSelected == "side_dishes"
              ? styles.menuItemBlockSelected
              : styles.menuItemBlock
          }
        >
          <Text style={styles.menuItemText}>Гарниры</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => menuToggle("desserts")}
          style={
            menuSelected.currentMenuSelected == "desserts"
              ? styles.menuItemBlockSelected
              : styles.menuItemBlock
          }
        >
          <Text style={styles.menuItemText}>Десерты</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => menuToggle("bakery")}
          style={
            menuSelected.currentMenuSelected == "bakery"
              ? styles.menuItemBlockSelected
              : styles.menuItemBlock
          }
        >
          <Text style={styles.menuItemText}>Выпечка</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.flatList}>
        <FlatList
          data={menuData}
          keyExtractor={(menu) => menu.name}
          refreshing={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <MenuItem Item={item} State={state.currentState} />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollMenu: {
    height: "5%",
    width: "100%",
    borderWidth: 1,
    borderColor: THEME.COLOR_MAIN_LIGHT,
  },
  menuItemBlock: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  menuItemBlockSelected: {
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: THEME.COLOR_MAIN_LIGHT,
  },
  menuItemText: {
    fontFamily: THEME.FONT_MAIN,
    color: THEME.COLOR_MAIN_DARK,
  },
  flatList: {
    height: "95%",
    alignItems: "center",
    justifyContent: "center",
  },
});
