import { Button, IButtonProps, Icon } from "native-base";
import { Plus } from "phosphor-react-native";

type ButtonProps = IButtonProps & {
    isInvalid: boolean
}

export function ButtonNewImage({isInvalid, ...rest}: ButtonProps){
    return(
        <Button
            borderWidth={isInvalid ? 1 : 0}
            borderColor={'red.300'}
            w={100}
            h={100}
            backgroundColor={"gray.500"}
            rounded={"md"}
            _pressed={{
                opacity: .7
            }}
            {...rest}
        >
            <Icon
                as={Plus}
                size={6}
                color={isInvalid ? "red.300" : "gray.400"}
            />
        </Button>
    );
}