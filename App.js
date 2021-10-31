import React, { useState } from 'react';
import AppLoading from "expo-app-loading";
import {Provider} from "react-redux";

import { bootstrap } from "./src/bootstrap";
import store from './src/store';
import {Root} from "./src/components/Root";

// Ошибка на Android, не мог найти переменную Intl
// Устанавливаем npm i intl expo-localization
// и добавляем:
import "intl";
import "intl/locale-data/jsonp/en";

export default function App() {
    const [isReady, setIsReady] = useState(false)

    if(!isReady){
        return (
            <AppLoading
            startAsync={bootstrap}
            onFinish={() => setIsReady(true)}
            onError={(e) => console.log(e)}
            />
        )
    }

        return (
            <Provider store={store}>
               <Root/>
            </Provider>
        )
}




