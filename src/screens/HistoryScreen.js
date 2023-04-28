import React, {useCallback, useEffect, useState} from "react";
import {useIsFocused} from '@react-navigation/native'
import {
    ActivityIndicator,
    FlatList, RefreshControl,
    StyleSheet, Text, View
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {getOrder} from "../store/actions/getOrder";
import {HistoryOfBasketItem} from "../components/HistoryOfBasketItem";
import {THEME} from "../theme";

export const HistoryScreen = () => {
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const [state, setState] = useState({
        isLoading: false
    })
    const historyData = useSelector(state => state.user.userHistoryOfOrder)

    const asyncGetOrderInfo = async () => {
        setState({
            ...state,
            isLoading: true
        })
        const result = await dispatch(getOrder())
        setState({
            ...state,
            isLoading: false
        })
        return result
    }

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(getOrder()).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        asyncGetOrderInfo()
    }, [isFocused])


    if (historyData == undefined || historyData.length == 0) {
        return (
            <View style={styles.historyIsEmptyBlock}>
                <Text style={styles.historyIsEmptyText}>Заказов пока не было</Text>
            </View>
        )
    }

    const filteredHistoryData = historyData.sort(function (el1, el2){
        return el1.timestamp < el2.timestamp
    })



    if(state.isLoading){
        return(
            <View style={styles.preloader}>
                <ActivityIndicator size="large" color={THEME.COLOR_MAIN_DARK}/>
            </View>
        )
    }

        return (
            <FlatList
                data={filteredHistoryData}
                keyExtractor={(basket) => basket.name}
                refreshing={true}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({item}) => <HistoryOfBasketItem Item={item}/>}
            />
        )
}


const styles = StyleSheet.create({
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
    historyIsEmptyText: {
        color: THEME.COLOR_MAIN_DARK,
        fontFamily: THEME.FONT_BOLD,
    },
    historyIsEmptyBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    }
})