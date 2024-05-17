import { Input as NativeBaseInput, IInputProps, FormControl, HStack, Icon, Button, useTheme, Divider } from "native-base";
import { TouchableOpacity } from "react-native";
import { Eye, EyeClosed, MagnifyingGlass, Sliders } from 'phosphor-react-native'
import { useState } from "react";
import { ButtonIcon } from "./ButtonIcon";

type Props = IInputProps & {
    onPressFilterButton: () => void,
    onPressSearch: () => void
}


export function SearchInput({onPressFilterButton, onPressSearch, ...rest}: Props){
    const {colors, sizes} = useTheme();
    return(
        <FormControl>
            <HStack 
                w="full"
                backgroundColor={"gray.700"}
                rounded="md"
                alignItems={"center"}
            >
                <NativeBaseInput
                    flex={1}
                    px={4}
                    py={3}
                    color={"gray.200"}
                    fontSize={"md"}
                    lineHeight={"md"}
                    fontFamily={"body"}
                    borderWidth={0}
                    _focus={{
                        backgroundColor: 'gray.700'
                    }}
                    placeholderTextColor={"gray.400"}
                    placeholder="Buscar anúncio"
                    onSubmitEditing={onPressSearch}
                    {...rest}
                />
                <ButtonIcon
                    icon={MagnifyingGlass}
                    size={5}
                    color={"gray.200"}
                    p={3}
                    onPress={onPressSearch}
                />
                <Divider
                    orientation="vertical"
                    backgroundColor="gray.400"
                    h={5}
                />
                <ButtonIcon
                    icon={Sliders}
                    size={5}
                    color={"gray.200"}
                    p={3}
                    onPress={onPressFilterButton}
                />
            </HStack>
        </FormControl>
    );
}