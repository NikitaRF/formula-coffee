import React, {useEffect, useState} from "react";
import {RefreshControl, Text, TouchableOpacity, View, StyleSheet, Dimensions} from "react-native";
import {THEME} from "../theme";
import {LoadIndicator} from "./LoadIndiacator";
import Image from "react-native-image-progress";
import {AntDesign} from "@expo/vector-icons";
import {useDispatch, useSelector} from "react-redux";
import {addToBasket} from "../store/actions/addToBasket";
import {deleteItemFromBasket} from "../store/actions/deleteItemFromBasket";

export const MenuItem = ({Item, State}) => {
    const date = new Date()
    if (State === '/menu/eat/breakfasts' || date.getHours() > 14 && date.getHours() <= 9) {
        console.log('Завтраки', State)
        console.log(date.getHours())
        return (
            <View style={styles.breakfastWrap}>
                <Text style={styles.breakfastText}>Время завтраков с 09:00 до 16:00</Text>
            </View>
        )
    }

    const [count, setCount] = useState(0)

    const basketCount = useSelector(state => state.menu.basket.filter(el => el.name == Item.name))

    useEffect( () => {
        if (basketCount.length !== 0) {
            //console.log('USE EFFECT', basketCount[0].count)
            setCount(basketCount[0].count)
        } else {
            setCount(0)
        }
    })

    useEffect(() => {
        if (Item.avaible == false && count > 0) {
            //console.log('USE EFFECT НАСТАЛ')
            dispatch(deleteItemFromBasket(Item.name))
            setCount(0)
        }
    }, [Item.avaible])

    const dispatch = useDispatch()
    const plusItem = () => {
        setCount(count + 1)
        dispatch(addToBasket(Item, count + 1))
    }
    const minusItem = () => {
        setCount(count - 1)
        dispatch(addToBasket(Item, count - 1))
        if (count == 1) {
            dispatch(deleteItemFromBasket(Item.name))
        }
    }



    return (
        <View style={Item.avaible ? styles.mainWrap : {...styles.mainWrap, opacity: 0.3}}>

            <View style={styles.imgBlock}>
                <Image
                    style={styles.logo}
                    // source={{uri: 'https://firebasestorage.googleapis.com/v0/b/formula-coffee-d6f54.appspot.com/o/img%2Flogo.png?alt=media&token=9ee2f3eb-21ff-4f54-a982-b47a5611973d'}}
                    // onLoadStart={() => dispatch(setLoadIndicator(true))}
                    // onLoadEnd={() => dispatch(setLoadIndicator(false))}
                    source={{uri: Item.photo}}
                    indicator={LoadIndicator}
                    resizeMode='cover'
                />
            </View>

            <View style={styles.textBlock}>
                <Text style={styles.textTitle}>{Item.name}</Text>
                <Text style={styles.textDescription}>{Item.description}</Text>
                <Text style={styles.textPrice}>{Item.weight} гр / {count > 0 ? Item.price * count : Item.price} руб</Text>
                <View style={styles.buttonWrap}>
                    <View>
                        {count > 0 && Item.avaible ? (
                            <View style={styles.buttonCount}>
                                <AntDesign
                                name="minuscircle"
                                size={24}
                                style={styles.allowIcon}
                                color={THEME.COLOR_MAIN_DARK}
                                onPress={() => minusItem()}
                                />
                                    <View style={styles.wrapCount}>
                                        <Text style={styles.textCount}>{count}</Text>
                                    </View>
                                <AntDesign
                                name="pluscircle"
                                size={24}
                                style={styles.allowIcon}
                                color={THEME.COLOR_MAIN_DARK}
                                onPress={() => plusItem()}
                                />
                            </View>
                        ) : (
                            <TouchableOpacity disabled={Item.avaible? false : true} onPress={() => plusItem()}>
                                <Text style={styles.buttonText}>Добавить</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    breakfastWrap:{
        alignItems: 'center',
        justifyContent: "center",
        marginTop: 50
    },
    breakfastText: {
        color: THEME.COLOR_MAIN_DARK,
        fontFamily: THEME.FONT_BOLD,
    },
    mainWrap: {
        width: Dimensions.get('window').width,
        marginVertical: 10,
        flexDirection: 'row',
        maxHeight: 150,
        shadowColor: '#000',
        shadowRadius: 2,
        shadowOpacity: 0.3,
        shadowOffset: { width: 2, height: 2 },
        elevation: 8,
        backgroundColor: '#fff',
        borderRadius: 10,

    },
    imgBlock: {
        width: '30%'

    },
    logo: {
        minHeight: 70,
        width: "100%",
        height: "100%",
    },
    textBlock: {
        flex: 1,
        marginHorizontal: 20,

        // borderStyle: 'solid',
        // borderWidth: 1,
    },
    textTitle: {
        fontFamily: 'open-bold',
        color: THEME.COLOR_MAIN_DARK,
        marginBottom: 10,
        marginTop: 5,
    },
    textDescription: {
        fontFamily: 'open-regular',
        color: THEME.COLOR_MAIN_DARK,
    },
    textPrice: {
        fontFamily: 'open-bold',
        color: THEME.COLOR_MAIN_DARK,
    },
    buttonWrap: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '50%',
        marginTop: 'auto',
        backgroundColor: THEME.COLOR_MAIN_LIGHT,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginBottom: 5,

    },
    buttonText: {
        color: THEME.COLOR_MAIN_DARK,
        fontFamily: 'open-regular',
        fontSize: 16,
    },
    buttonCount: {
        flexDirection: 'row',
    },
    wrapCount: {
        paddingHorizontal: 25,

    },
    textCount: {
        fontFamily: 'open-bold',
        fontSize: 18,
        color: THEME.COLOR_MAIN_DARK,
    },
})