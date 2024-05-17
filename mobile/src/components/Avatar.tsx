import { Image } from "native-base";

import avatarPng from '@assets/avatar.png';
import { api } from "@services/api";

type Props = {
    image: string,
    size: number,
    borderColor?: string
}

export function Avatar({image, size, borderColor}: Props){
    return(
        <Image
            source={!!image ? {uri: `${api.defaults.baseURL}/images/${image}`} : avatarPng}
            alt="Imagem do Usuário"
            width={size}
            height={size}
            rounded={"full"}
            borderColor={!!borderColor ? borderColor : "blue.300"}
            borderWidth={2}
        />
    );
}