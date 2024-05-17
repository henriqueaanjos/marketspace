import { Box, Center, VStack, Button, PresenceTransition, useTheme} from "native-base";
import { useState } from "react";

type Props = {
    value?: boolean,
    onChange?: (value: boolean) => void
}

export function Switch({value = false , onChange}: Props){
    const {sizes} = useTheme();

    function handleChangeState(){
        if(onChange)
            onChange(!value);
    }

    return(
        <Button
            backgroundColor={"transparent" }
            p={0}
            m={0}
            onPress={handleChangeState}
        >
            <Box
                backgroundColor={value ? "blue.500" :"gray.500"}
                rounded={"full"}
                p={0.5}
                w="50"
            >
                <PresenceTransition
                    visible={value}
                    initial={{
                        translateX: 0
                    }}
                    animate={{
                        translateX: 22
                    }}
                >
                    <Box
                        rounded={"full"}
                        backgroundColor={"gray.700"}
                        w={6}
                        h={6}
                    />
                </PresenceTransition>
            </Box>
        </Button>
    );
}