import {createStackNavigator} from '@react-navigation/stack';
import {MenuScreen} from "../screens/MenuScreen";
import React from "react";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {AppHeaderIcon} from "../components/AppHeaderIcon";


const Stack = createStackNavigator();

export const MenuNavigation = () =>  {

    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
                headerLeft: () => (
                    <HeaderButtons HeaderButtonComponent={AppHeaderIcon} >
                        <Item title='Menu'
                              iconName='ios-menu'
                              onPress={() => navigation.toggleDrawer()}/>
                    </HeaderButtons>
                ),
            })}
        >
            <Stack.Screen name="Меню" component={MenuScreen} />
        </Stack.Navigator>
    );
}

