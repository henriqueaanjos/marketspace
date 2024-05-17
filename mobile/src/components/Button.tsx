import {  Button as NativeBaseButton, IButtonProps, Text, Icon as NBIcon, HStack} from "native-base";
import { Icon, WhatsappLogo } from "phosphor-react-native";

type Props = IButtonProps & {
    title: string,
    variant?: 'primary' | 'secondary' | 'neutral',
    icon?: Icon
}

export function Button({title, variant = 'primary', icon, ...rest}: Props){
    return(
        <NativeBaseButton
            flexGrow={1}
            background={variant === 'primary' ? 'blue.300' : 
                variant === 'secondary' ? 'gray.100': 
                "gray.500"
            }
            rounded="md"
            p={3}
            {...rest}
            _pressed={{
                opacity: 0.7
            }}
            {...rest}
        >
            <HStack
                alignItems={"center"}
                space={2}
            >
                {!!icon &&
                    <NBIcon
                        as={icon}
                        color={variant === 'neutral' ? "gray.300" :"gray.700"}
                        fontWeight={icon == WhatsappLogo ? "fill" : 'regular'}
                        size={4}
                    />
                }
                <Text
                    fontFamily={"heading"}
                    fontSize={"sm"}
                    color={variant === 'neutral' ? "gray.200" : "gray.700"}

                >
                    {title}
                </Text>
            </HStack>
        </NativeBaseButton>
    );
}