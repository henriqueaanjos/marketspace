import { useContext } from "react";
import { MyProductContext } from "src/context/MyProductsContext";

export function useProducts(){
    const context = useContext(MyProductContext);
    return context;
}