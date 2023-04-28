import {GET_ORDER} from "../types";
import firebase from "firebase";

export const getOrder = () => {

    const getOrderInfoOnDB = async () => {
        const userUid = firebase.auth().currentUser.uid
        const db = firebase.firestore();
        const ordersInfo = db.collection(`orders`).where('userId', '==', `${userUid}`);

        const result = await ordersInfo.get().then((doc) => {
            let arrayOfOrders = []
            doc.forEach((dat) => {
                arrayOfOrders.push(dat.data())
            });
            if (arrayOfOrders.length !== 0) {
                return arrayOfOrders
            } else {
                console.log("No such document!");
            }
        })

        return result
    }

    return async dispatch => {
        const dataOrder = await getOrderInfoOnDB()
        dispatch({
            type: GET_ORDER,
            payload: dataOrder
        })
    }
}