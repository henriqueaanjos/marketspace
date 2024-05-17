import { ReactNode, createContext, useState } from "react"

export type MyProductsContext = {
    totals: number,
    setTotals: (totals: number) => void
}

export type MyProductsContextProvider = {
    children: ReactNode
}
export const MyProductContext = createContext<MyProductsContext>({} as MyProductsContext);

export function MyProductsContextProvider({children}: MyProductsContextProvider){
    const [totals, setTotals] = useState(0);
    return(
        <MyProductContext.Provider value={{
            totals,
            setTotals
        }}>
            {children}
        </MyProductContext.Provider>
    );
}