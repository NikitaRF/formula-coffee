import React, {useEffect, useState} from "react";
import {
    ActivityIndicator, Alert,
    FlatList, Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {BasketItem} from "../components/BasketItem";
import {THEME} from "../theme";
import {AntDesign} from "@expo/vector-icons";
import {getUserInfo} from "../store/actions/getUserInfo";
import firebase from "firebase";
import {clearBasket} from "../store/actions/clearBasket";
import DateTimePicker from "@react-native-community/datetimepicker";

export const BasketScreen = ({navigation}) => {
    const deliveryPrice = 200

    const userData = useSelector(state => state.user.userInfo)
    const itemsBasket = useSelector(state => state.menu.basket)
    const [modal, setModal] = useState(false)
    const [modalLuckWindow, setModalLuckWindow] = useState(false)
    const [isChosenTime, setChosenTime] = useState(false)
    const [state, setState] = useState({
        phone: userData.phone,
        isLoading: false,
        comment: '',
    })

    // Начало Время доставки
    const curDate = new Date()
    const maxTimeToOrder = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 23, 0, 0, 0)
    const minTimeToOrder = curDate.setMinutes(curDate.getMinutes() + 90);

    const [date, setDate] = useState(new Date);
    const [show, setShow] = useState(false);


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(true);
        setDate(currentDate);
    };

    const acceptChoiceTime = () => {
        setShow(false)
        setChosenTime(true)
        console.log(date.toLocaleString('ru-RU'))
    }

    const showTimepicker = () => {
        setShow(true);
    };
    // Конец Время доставки


    // Начало Счетчик товаров в Корзине
    const [totalCount, setTotalCount] = useState()

    const getBasketItemCount = () => {
        let result = 0
        itemsBasket.forEach((el) => {
            result += el.count
        })
        setTotalCount(result)
        console.log("totalCount", totalCount)
    }

    // Начало Считаем итоговую стоимость
    const [totalPrice, setTotalPrice] = useState()
    const getBasketTotalPrice = () => {
        let result = 0
        itemsBasket.forEach((el) => {
            result += el.count * el.price
        })
        setTotalPrice(result)
        console.log("totalPrice", totalPrice)
    }
    // Конец Считаем итоговую стоимость

    useEffect(() => {
        getBasketItemCount()
        getBasketTotalPrice()
    }, [itemsBasket])
    // Конец Счетчик товаров в Корзине

    const getOrder = () => {
        setModal(true)
    }

    const checkOrder = async () => {
        const nowDate = new Date()
        const formatter = new Intl.DateTimeFormat("ru", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            weekday: "long",
        });

        const currentDate = formatter.format(nowDate)

        if (userData.phone === '' || userData.phone == null || userData.phone == undefined || userData.phone.length != 11) {
            Alert.alert('Введите свой номер телефона')
            return
        }
        if (state.address === '' || state.address == null || state.address == undefined) {
            Alert.alert('Введите адрес')
            return
        }

        const data = {
            userId: firebase.auth().currentUser.uid,
            date: currentDate,
            timestamp: nowDate.getTime(),
            status: 'В обработке',
            timeToDelivery: !isChosenTime? 'Как можно скорее' : date.toLocaleString('ru-Ru'),
            address: state.address,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
            email: userData.email,
            order: itemsBasket,
            totalPrice,
            deliveryPrice,
            totalResult: totalPrice + deliveryPrice,
            countOfPerson,
            comment: state.comment === '' ? 'Комментарий отсутствует' : state.comment,
        }


        if (firebase.auth().currentUser) {
            const userUid = firebase.auth().currentUser.uid
            const db = firebase.firestore();
            const ordersList = db.collection('orders')
            setState({
                ...state,
                isLoading: true,
            })

            await ordersList.add(data)

            setState({
                ...state,
                isLoading: false,
            })
            setModal(false)
            dispatch(clearBasket())
            setChosenTime(false)
            setShow(false)
            setModalLuckWindow(true)
            setState({
                ...state,
                comment: ''
            })
        }
    }

    // Фокус для реакции на галочку в инпуте
    const [focusInput, setFocusInput] = useState(false)
    const onFocus = () => {
        setFocusInput(true)
    }
    const onBlur = () => {
        setFocusInput(false)
    }


    useEffect(() => {
        asyncGetUserInfo()
    }, [])

    const dispatch = useDispatch()
    const asyncGetUserInfo = async () => {
        setState({
            ...state,
            isLoading: true
        })
        const result = await dispatch(getUserInfo())
        setState({
            ...state,
            isLoading: false
        })
        return result
    }

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

    if(state.isLoading){
        return(
            <View style={styles.preloader}>
                <ActivityIndicator size="large" color={THEME.COLOR_MAIN_DARK}/>
            </View>
        )
    }

    const saveChanges = async (key, data) => {
        if (firebase.auth().currentUser) {
            const db = firebase.firestore();
            const userInfo = db.collection("users").doc(firebase.auth().currentUser.uid);

            setState({
                isLoading: true,
            })

            await userInfo.set({
                [key]: data
            }, {merge: true});

            setState({
                isLoading: false,
            })
            asyncGetUserInfo()
        }
    }

    // Модалка оформление заказа

    if (modal) {
        return (
        <Modal visible={modal} animationType='slide' transparent={false}>
            <ScrollView contentContainerStyle={styles.modalWrap}>
                <View>
                    <Text style={styles.itemTitle}>Адрес</Text>
                    <TextInput
                        style={styles.modalInputAddress}
                        color={THEME.COLOR_MAIN_DARK}
                        autoCorrect={false}
                        placeholder='Ваш адрес'
                        maxLength={255}
                        onChangeText={(text) => setState({...state, address: text})}
                        value={state.address}
                        placeholderTextColor={THEME.COLOR_MAIN_PLACEHOLDER}
                    />
                </View>
                <View>
                    <Text style={styles.itemTitle}>Комментарий</Text>
                    <TextInput
                        color={THEME.COLOR_MAIN_DARK}
                        multiline = {true}
                        autoCorrect={false}
                        placeholder='Ваши пожелания'
                        maxLength={255}
                        numberOfLines = {4}
                        style={styles.modalInputComment}
                        onChangeText={(text) => setState({...state, comment: text})}
                        value={state.comment}
                        placeholderTextColor={THEME.COLOR_MAIN_PLACEHOLDER}
                    />
                </View>
                <View><Text style={styles.itemTitle}>Телефон</Text></View>
                <View style={styles.inputWrap}>
                    <TextInput
                        color={THEME.COLOR_MAIN_DARK}
                        autoCorrect={false}
                        value={state.phone}
                        onFocus={() => onFocus()}
                        onBlur={() => onBlur()}
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
                        style={focusInput ? {...styles.allowIcon, opacity: 1} : styles.allowIcon}
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
                <View style={styles.timeToDeliveryWrap}>
                    <Text style={styles.timeToDeliveryText}>Время доставки</Text>
                    <Text style={{...styles.timeToDeliveryText, marginLeft: 'auto'}}>{!isChosenTime ? 'Как можно скорее': date.toLocaleString('ru-RU')}</Text>
                </View>
                <TouchableOpacity
                    style={styles.buttonWrapTime}
                    onPress={() => showTimepicker()}
                >
                    <Text style={styles.buttonTextTime}>Выбрать время</Text>
                </TouchableOpacity>
                    <View style={{width: '100%'}}>
                    {show && (<>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode='time'
                            locale='ru-RU'
                            is24Hour={true}
                            display="spinner"
                            textColor={THEME.COLOR_MAIN_DARK}
                            onChange={onChange}
                            minimumDate={minTimeToOrder}
                            maximumDate={maxTimeToOrder}
                        />
                            <TouchableOpacity
                                style={styles.buttonWrapTime}
                                onPress={() => acceptChoiceTime()}
                            >
                                <Text style={styles.buttonTextTime}>Выбрать</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    </View>


                <Text style={{...styles.itemTitle, marginTop: 10}}>Сумма {totalPrice} руб</Text>
                <Text style={styles.itemTitle}>Доставка {deliveryPrice} руб</Text>
                <View style={styles.total}><Text style={{...styles.itemTitle, marginTop: 50, fontSize: 20}}>Итого {totalPrice + deliveryPrice} руб</Text></View>
                {totalPrice < 500 ? <Text style={styles.itemMinimal}>Минимальная сумма заказа, без учета доставки 500 руб</Text> : <></>}

                <View style={styles.modalButtons}>

                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => {
                            setModal(false)
                            setChosenTime(false)
                            setShow(false)
                        }}
                    >
                        <View style={styles.textWrap}>
                            <Text style={styles.buttonText}>
                                Отменить
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={totalPrice < 500 ? styles.modalButtonDisabled : styles.modalButton}
                        onPress={() => checkOrder()}
                        disabled={totalPrice < 500 ? true : false}
                    >
                        <View style={styles.textWrap}>
                            <Text style={styles.buttonText}>
                                Заказать
                            </Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </Modal>
    )}

    // Модалка успех заказа
    const luckModalClose = () => {
        setModalLuckWindow(false)
        navigation.navigate('Главная')
    }

    if (modalLuckWindow) {
        const date = new Date()
        return (
            <Modal visible={modalLuckWindow} animationType='slide' transparent={false}>
                <ScrollView contentContainerStyle={styles.modalWrap}>
                    <View style={styles.containerLuck}>
                        <Image
                            style={styles.logo}
                            source={require('../../assets/logo2.png')}
                        />
                        <Text style={styles.textLuckBold}>Ваш заказ успешно принят</Text>
                        <Text style={styles.textLuckRegular}>{date.toLocaleString('ru-Ru')}</Text>
                            <TouchableOpacity
                                style={{...styles.buttonWrap, marginTop: 20}}
                                onPress={() => luckModalClose()}>
                                <Text style={{...styles.buttonText, paddingVertical: 5, fontSize: 15}}>Готово</Text>
                            </TouchableOpacity>
                        <Text></Text>
                    </View>
                </ScrollView>
            </Modal>
        )
    }

    // Баскет Скрин

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
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    buttonWrap: {
        width: '70%',
        marginBottom: 40,
        paddingHorizontal: 25,
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
    buttonWrapTime:{
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: THEME.COLOR_MAIN_LIGHT,
    },
    buttonTextTime: {
        fontFamily: THEME.FONT_BOLD,
        color: THEME.COLOR_MAIN_DARK,
        textAlign: 'center',
        paddingVertical: 5,
        fontSize: 15,
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
        marginTop: 20,
        marginBottom: 10,
    },
    modalPersonTitle: {
        color: THEME.COLOR_MAIN_DARK,
        fontFamily: 'open-regular',
        marginRight: 'auto',
        fontSize: 18,
    },
    modalButtons: {
        width: '100%',
        marginTop: 20,
        marginBottom: 100,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalButton: {
        paddingHorizontal: 25,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: THEME.COLOR_MAIN_LIGHT,
    },
    modalButtonDisabled: {
        paddingHorizontal: 25,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: THEME.COLOR_MAIN_LIGHT,
        opacity: 0.2,
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
    },
    allowIcon: {
        position: 'absolute',
        right: 5,
        opacity: 0.7,
    },
    itemTitle: {
        color: THEME.COLOR_MAIN_DARK,
        fontFamily: 'open-bold',
        fontSize: 15,
        marginBottom: 10,
    },
    itemMinimal: {
        color: THEME.COLOR_STATUS_DENY,
        fontFamily: 'open-bold',
        fontSize: 15,
        marginBottom: 10,
        textAlign: 'center',
    },
    total: {
        alignItems: 'center'
    },
    modalInputComment: {
        borderWidth: 1,
        borderColor: THEME.COLOR_MAIN_DARK,
        marginBottom: 10,
        paddingVertical: 10,
        paddingLeft: 10,
        height: 50,
    },
    modalInputAddress: {
        borderWidth: 1,
        borderColor: THEME.COLOR_MAIN_DARK,
        paddingVertical: 10,
        marginBottom: 10,
        paddingLeft: 10,
    },
    timeToDeliveryText: {
        color: THEME.COLOR_MAIN_DARK,
        fontFamily: 'open-regular',
        fontSize: 18,
    },
    timeToDeliveryWrap: {
        marginBottom: 10,
        flexDirection: 'row',
    },
    containerLuck: {
        //flex: 1,
        alignItems: 'center',
        marginTop: '35%',
    },
    logo: {
        width: 95,
        height: 120,
    },
    textLuckRegular: {
        marginTop: 10,
        fontFamily: THEME.FONT_MAIN,
        color: THEME.COLOR_MAIN_DARK,
    },
    textLuckBold: {
        marginTop: 10,
        fontFamily: THEME.FONT_BOLD,
        color: THEME.COLOR_MAIN_DARK,
    },
})
