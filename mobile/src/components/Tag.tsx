import { Button, Center, HStack, Heading, useTheme } from "native-base";
import { ButtonIcon } from "./ButtonIcon";
import { XCircle } from "phosphor-react-native";
import { useState } from "react";

type ItemProps = {
    name: string,
    key: number
}

type Props  = {
    items: ItemProps[]
    value: number,
    onChange: (value: number) => void
}

export function Tag({items, value, onChange}: Props){
    const {sizes, colors} = useTheme();

    function handleChangeState(key: number){
        onChange(key);
    }
    return(
        <HStack
            space={2}
        >
        { items.map(item => 
            <Button
                key={item.key}
                backgroundColor={item.key === value ? 'blue.300' : 'gray.500'}
                rounded={"full"}
                px={4}
                py={1.5}
                pr={item.key === value ? 1.5 : 4}
                alignItems={"center"}
                justifyContent={"center"}
                _pressed={{
                    opacity: .7
                }}
                onPress={() => handleChangeState(item.key)}
            >
                <HStack
                    space={1.5}
                    alignItems={"center"}
                >
                    <Heading
                        fontFamily={"heading"}
                        fontSize={"xs"}
                        color={item.key === value ? 'gray.700' : 'gray.300'}
                        lineHeight={"md"}
                        textTransform={"uppercase"}
                    >
                        {item.name}
                    </Heading>
                    {item.key === value &&
                        <ButtonIcon
                            icon={XCircle}
                            color='gray.700'
                            size={4}
                            onPress={() => handleChangeState(0)}
                        />
                    }
                </HStack>
            </Button>
        )}
        </HStack>
    );
}