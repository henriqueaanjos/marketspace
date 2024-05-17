import { Input as NativeBaseInput, IInputProps, FormControl, HStack, Icon, Button, Heading } from "native-base";
import { TouchableOpacity } from "react-native";
import { Eye, EyeClosed } from 'phosphor-react-native'
import { useState } from "react";


type Props = IInputProps & {
    errorMessage?: string,
    label?: string
}


export function Input({errorMessage, isInvalid, label, secureTextEntry, ...rest}:Props){
    const [showPassword, setShowPassword] = useState(!secureTextEntry);
    const [isFocused, setFocused] = useState(false);
    const invalid = !!errorMessage || isInvalid; 

    function handleChangePasswordVisibility(){
        setShowPassword(old => !old);
    }
    return(
        <FormControl isInvalid={invalid}>
            <HStack 
                w="full"
                backgroundColor={"gray.700"}
                rounded="md"
                borderWidth={isFocused || invalid ? 1 : 0}
                borderColor={invalid ? "red.300": "gray.300"}
                alignItems={"center"}
                justifyContent={"center"}
                px={4}
                py={3}
            >
                {
                    !!label &&
                    <Heading
                        mr={2}
                        backgroundColor={"red.500"}
                        color={"gray.100"}
                        fontSize={"md"}
                        lineHeight={"md"}
                        fontFamily={"body"}
                    >
                        {label}
                    </Heading>
                }
                <NativeBaseInput
                    flex={1}
                    color={"gray.200"}
                    p={0}
                    fontSize={"md"}
                    lineHeight={"md"}
                    fontFamily={"body"}
                    borderWidth={0}
                    _focus={{
                        backgroundColor: 'gray.700'
                    }}
                    placeholderTextColor={"gray.400"}
                    onFocus={ () => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    {...rest}
                    secureTextEntry={!showPassword}
                />
                {secureTextEntry &&
                    <Button
                        backgroundColor="transparent"
                        onPress={handleChangePasswordVisibility}
                        p={0}
                    >{showPassword ?
                        <EyeClosed
                            size={20}
                            color="#000"
                        />
                        :
                        <Eye
                            size={20}
                            color="#000"
                        />
                    }
                    </Button>
                }
            </HStack>
            <FormControl.ErrorMessage
                _text={{ color: "red.300" }}
            >
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    );
}