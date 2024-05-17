import { FormControl, VStack, Button, HStack, Box, Text, IBoxProps, useTheme } from "native-base";
import { Check } from "phosphor-react-native";
import { useState } from "react";

type ItemProps = {
    name:string,
    key: string
}

type Props = IBoxProps & {
    items: ItemProps[],
    errorMessage?: string,
    value: string[],
    onChange: (value: string[]) => void
}

export function Checkbox({items, errorMessage, value, onChange,...rest}: Props){

    const {colors, sizes} = useTheme();
    
    function handleChangeGroup(item: string){
        const alreadySelected = value.includes(item);
        onChange(alreadySelected ? value.filter(group => group !== item) : [...value, item]);
    }

    const invalid = !!errorMessage
    return(
        <FormControl isInvalid={invalid}>
            <VStack
                space={2}
                {...rest}
            >
            {
                items.map((item, i) => 
                    <HStack
                        key={item.key}
                    >
                        <Button
                            backgroundColor="transparent"
                            alignItems={"flex-start"}
                            justifyContent={"flex-start"}
                            onPress={() => handleChangeGroup(item.key)}
                            m={0}
                            p={0}
                        >
                            <HStack
                                alignItems={"center"}
                                space={2}
                            >
                                <Box
                                    w={18}
                                    h={18}
                                    bgColor={value.includes(item.key) ? "blue.300" : "gray.700"  }
                                    borderWidth={value.includes(item.key) ? 0 : 2}
                                    borderColor={invalid ?'red.300' : "gray.400"}
                                    rounded={"xs"}
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                >
                                    {
                                        value.includes(item.key) &&
                                        <Check
                                            color={colors.gray[600]}
                                            size={sizes[3]}
                                            weight='bold'
                                        />
                                    }
                                </Box>
                                <Text>
                                    {item.name}
                                </Text>
                            </HStack>
                        </Button>
                    </HStack>
                )
            }
                
            </VStack>
            <FormControl.ErrorMessage
                _text={{ color: "red.300" }}
            >
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    );
}