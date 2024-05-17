import { ButtonIcon } from "@components/ButtonIcon";
import { LogoutButton } from "@components/LogoutButton";
import { AdDTO } from "@dtos/AdDTO";
import { useAuth } from "@hooks/useAuth";
import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdDetails } from "@screens/AdDetails";
import { Home } from "@screens/Home";
import { MyAds } from "@screens/MyAds";
import { NewAd } from "@screens/NewAd";
import { Text, useTheme } from "native-base";
import { House, SignOut, Tag } from "phosphor-react-native";
import { Platform, TouchableOpacity } from "react-native";

type ImageProps = {
    uri: string,
    type: string | undefined
}

type HomeRouteProps = {
    products: undefined, 
    myAds: undefined,
    signOut: undefined
}

type AppRouteProps = {
    home: undefined,
    adDetails: {
        product_id?: string,
        preview?: AdDTO
    },
    newAd: {
        data?: AdDTO
    },
}
export type HomeNavigatorRouteProps = BottomTabNavigationProp<HomeRouteProps>;

const { Navigator, Screen } = createBottomTabNavigator<HomeRouteProps>();

export type AppNavigatorRouteProps = NativeStackNavigationProp<AppRouteProps>;

const  Stack = createNativeStackNavigator<AppRouteProps>();



export function HomeRoutes(){
    const {colors, sizes} = useTheme();
    const iconSize = sizes[6];

    const { signOut } = useAuth();
    return(
        <Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,

                tabBarActiveTintColor: colors.gray[200],
                tabBarInactiveTintColor: colors.gray[400],
                tabBarStyle:{
                    backgroundColor: colors.gray[700],
                    borderTopWidth: 0,
                    height: Platform.OS === 'android' ? 'auto' : 72,
                    paddingTop: sizes[5],
                    paddingBottom: sizes[7]
                }
            }}
        >
            <Screen
                name="products"
                component={Home}
                options={{
                    tabBarIcon: ({color}) => 
                        <House
                            color={color}
                            size={iconSize}
                            weight={color === colors.gray[200] ? "bold" : "regular"}
                        />
                }}
            />
            <Screen
                name="myAds"
                component={MyAds}
                options={{
                    tabBarIcon: ({color}) => 
                        <Tag
                            color={color}
                            size={iconSize}
                            weight={color === colors.gray[200] ? "bold" : "regular"}
                        />
                }}
            />
            <Screen 
                name="signOut"
                component={LogoutButton}
                options={{ 
                    tabBarIcon: () =>
                        <ButtonIcon
                            icon={SignOut}
                            color={"red.300"}
                            size={iconSize}
                            onPress={signOut}
                        />
                         
                }}
            />
        </Navigator>
    );
}

export function AppRoutes(){
    return(
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name='home'
                component={HomeRoutes}
            />
            <Stack.Screen
                name="adDetails"
                component={AdDetails}
            />
            <Stack.Screen
                name="newAd"
                component={NewAd}
            />
        </Stack.Navigator>
    );
}