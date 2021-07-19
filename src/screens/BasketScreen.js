import React, {useEffect, useState} from "react";
import {Button, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useSelector} from "react-redux";
import {BasketItem} from "../components/BasketItem";
import {THEME} from "../theme";
import {AntDesign} from "@expo/vector-icons";
import {addToBasket} from "../store/actions/addToBasket";
import {deleteItemFromBasket} from "../store/actions/deleteItemFromBasket";

export const BasketScreen = ({navigation}) => {
    const itemsBasket = useSelector(state => state.menu.basket)
    const [modal, setModal] = useState(false)

    // Начало Счетчик товаров в Корзине
    const [totalCount, setTotalCount] = useState()

    const basketItems = useSelector(state => state.menu.basket)

    const getBasketItemCount = () => {
        let result = 0
        basketItems.forEach((el) => {
            result += el.count
        })
        setTotalCount(result)
        console.log("totalCount", totalCount)
    }

    // Начало Считаем итоговую стоимость
    const [totalPrice, setTotalPrice] = useState()
    const getBasketTotalPrice = () => {
        let result = 0
        basketItems.forEach((el) => {
            result += el.count * el.price
        })
        setTotalPrice(result)
        console.log("totalPrice", totalPrice)
    }
    // Конец Считаем итоговую стоимость

    useEffect(() => {
        getBasketItemCount()
        getBasketTotalPrice()
    }, [basketItems])
    // Конец Счетчик товаров в Корзине

    const getOrder = () => {
        setModal(true)
    }


    console.log('Баскет скрин:', itemsBasket)

    const [state, setState] = useState({
        isLoading: false
    })
    const userData = useSelector(state => state.user.userInfo)

    const updateInputVal = (val, prop) => {
        setState({
            ...state,
            [prop]: val
        });
    }

    const [countOfPerson, setCountOfPerson] = useState(1)
    const plusPerson = () => {
        setCountOfPerson(countOfPerson + 1)
        if (countOfPerson == 12) {
            setCountOfPerson(12)
        }
    }
    const minusPerson = () => {
        setCountOfPerson(countOfPerson - 1)
        if (countOfPerson == 1) {
            setCountOfPerson(1)
        }
    }

    if (modal) {
        return (
        <Modal visible={modal} animationType='slide' transparent={false}>
            <ScrollView contentContainerStyle={styles.modalWrap}>
                <View><Text>Адрес</Text></View>
                <TextInput />
                <View><Text>Комментарий</Text></View>
                <View><Text>Телефон</Text></View>
                <View style={styles.inputWrap}>
                    <TextInput
                        color={THEME.COLOR_MAIN_DARK}
                        autoCorrect={false}
                        value={state.phone}
                        placeholder='Телефон'
                        style={styles.input}
                        maxLength={11}
                        defaultValue={userData.phone}
                        keyboardType='phone-pad'
                        onChangeText={(val) => updateInputVal(val, 'phone')}
                    />
                    <AntDesign
                        name="checksquare"
                        size={24}
                        style={styles.allowIcon}
                        color={THEME.COLOR_MAIN_DARK}
                        onPress={() => saveChanges('phone', state.phone)}
                    />
                </View>


                <View style={styles.modalPersonWrap}>
                    <Text style={styles.modalPersonTitle}>Количество персон</Text>
                    <View>
                        <View style={styles.buttonCount}>
                            <AntDesign
                                name="minuscircle"
                                size={24}
                                color={THEME.COLOR_MAIN_DARK}
                                onPress={() => minusPerson()}
                            />
                            <View style={styles.wrapCount}>
                                <Text style={styles.textCount}>{countOfPerson}</Text>
                            </View>
                            <AntDesign
                                name="pluscircle"
                                size={24}
                                color={THEME.COLOR_MAIN_DARK}
                                onPress={() => plusPerson()}
                            />
                        </View>
                    </View>
                </View>
                <View><Text>Итого {totalPrice} руб</Text></View>
                <View style={styles.modalButtons}>
                    <Button title='Отменить' onPress={() => setModal(false)} color='red' />
                    <Button title='Заказать' color={THEME.COLOR_MAIN_DARK}/>
                </View>
            </ScrollView>
        </Modal>
    )}

    return (
        <View style={styles.center}>
            <FlatList
                data={itemsBasket}
                keyExtractor={(basket) => basket.name}
                renderItem={({item}) => <BasketItem Item={item}/>}
            />
            {
                <TouchableOpacity
                    style={totalCount > 0 ? (styles.buttonWrap) : ({display: 'none'})}
                    onPress={() => getOrder()}
                >
                    <View style={styles.textWrap}>
                        <View style={{marginRight: 'auto'}}>
                            <Text style={styles.buttonText}>
                                Заказать
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.buttonText}>
                                {totalPrice} руб
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            }

        </View>
    )
}



const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonWrap: {
        width: '70%',
        marginBottom: 40,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: THEME.COLOR_MAIN_LIGHT,
    },
    textWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    buttonText: {
        textAlign: 'center',
        color: THEME.COLOR_MAIN_DARK,
        fontFamily: 'open-bold',
    },
    modalWrap: {
        marginTop: 50,
        marginHorizontal: 25,
    },
    modalPersonWrap: {
        flexDirection: 'row',
    },
    modalPersonTitle: {
        color: THEME.COLOR_MAIN_DARK,
        fontFamily: 'open-regular',
        marginRight: 15,
        fontSize: 18,
    },
    modalButtons: {
        width: '100%',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    buttonCount: {
        flexDirection: 'row',
    },
    wrapCount: {
        paddingHorizontal: 15,
    },
    textCount: {
        fontFamily: 'open-bold',
        fontSize: 18,
        color: THEME.COLOR_MAIN_DARK,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        borderStyle: 'solid',
        borderColor: THEME.COLOR_MAIN_DARK,
        borderBottomWidth: 1,
        width: '100%',
        height: 45,
        marginTop: 20,
    },
})
