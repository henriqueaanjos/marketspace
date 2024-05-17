import { StatusBar, Text, View } from "react-native";

import { NativeBaseProvider } from "native-base";
import { useFonts, Karla_400Regular, Karla_700Bold } from "@expo-google-fonts/karla";

import { Loading } from "@components/Loading";

import { THEME } from "src/theme";
import { Routes } from "@routes/index";
import { AuthContextProvider } from "src/context/AuthContext";
import { MyProductsContextProvider } from "src/context/MyProductsContext";

export default function App() {
  const [fontsLoaded] = useFonts({Karla_400Regular, Karla_700Bold});

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
        <AuthContextProvider>
          <MyProductsContextProvider>
            {fontsLoaded ? <Routes/> : <Loading/>}
          </MyProductsContextProvider>
        </AuthContextProvider>
    </NativeBaseProvider>
  );
}
