import { NavigationContainer } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useAuth } from "@hooks/useAuth";
import { Loading } from "@components/Loading";

export function Routes(){

    const { user, isLoadingUserStorageData} = useAuth();
    if(isLoadingUserStorageData){
        <Loading/>
    }
    return(
        <NavigationContainer>
            {user.id ? <AppRoutes/> : <AuthRoutes/>}
        </NavigationContainer>
    );
}