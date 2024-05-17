import { Box, Text, View } from "native-base";

type Props = {
    type: 'new' | 'used'
}

export function Badge({type}: Props){
    return(
        <View
            backgroundColor={type === 'used' ? "gray.200" : 'blue.500'}
            rounded={"full"}
            px={2}
            py={0.5}
        >
            <Text
                fontFamily={"heading"}
                fontSize={10}
                color={"gray.700"}
                textTransform={"uppercase"}
            >
                {type === 'used' ? 'Usado' : 'Novo'}
            </Text>
        </View>
    );
}