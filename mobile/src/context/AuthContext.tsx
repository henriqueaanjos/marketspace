import { UserDTO } from "@dtos/UserDTO"
import { api } from "@services/api"
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken"
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser"
import { ReactNode, createContext, useEffect, useState } from "react"

type AuthContextProps = {
    user: UserDTO,
    signIn: (email: string, password: string) => Promise<void>,
    signOut: () => Promise<void>,
    isLoadingUserStorageData: boolean
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthContextProvider({children}: AuthContextProviderProps){
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(false);

    function updateUserAndToken(userData: UserDTO, token: string){
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    }

    async function storageUserAndToken(userData: UserDTO, token: string, refresh_token: string){
        try {
            setIsLoadingUserStorageData(true);
            await storageAuthTokenSave({token, refresh_token});
            await storageUserSave(userData);
        } catch (error) {
            throw error;
        }
        finally{
            setIsLoadingUserStorageData(false);
        }
    }

    async function signIn(email: string, password: string){
        try {
            const { data }  = await api.post('/sessions', {email, password});
            if(data.user && data.token && data.refresh_token){
                storageUserAndToken(data.user, data.token, data.refresh_token);
                updateUserAndToken(data.user, data.token);
            }
        } catch (error) {
            throw error;
        }
    }

    async function signOut(){
        try {
            setIsLoadingUserStorageData(true);
            setUser({} as UserDTO);
            await storageUserRemove();
            await storageAuthTokenRemove();
        } catch (error) {
            throw error
        }finally{
            setIsLoadingUserStorageData(false);
        }
    }
    async function loadUserData(){
        try {
            setIsLoadingUserStorageData(true);
            const userLogged = await storageUserGet();
            const { token } = await storageAuthTokenGet();
            if(userLogged && token){
                updateUserAndToken(userLogged, token)
            }
        } catch (error) {
            throw error;
        }finally{
            setIsLoadingUserStorageData(false);
        }
    }

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        const subscribe = api.registerInterceptTokenManager(signOut);
        return () => {
            subscribe();
        }
    }, [signOut])

    return (
        <AuthContext.Provider
            value={{
                user, 
                signIn,
                signOut,
                isLoadingUserStorageData
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}