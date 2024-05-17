import { Button, IButtonProps, Icon as NBIcon} from "native-base";
import { Icon } from "phosphor-react-native";

type Props = IButtonProps & {
    icon: Icon,
    color: string,
    size: number
}

export function ButtonIcon({icon, color, size, ...rest}: Props){
    return(
        <Button
            backgroundColor="transparent"
            p={0}
            _pressed={{
                opacity: 0.7
            }} 
            {...rest}
        >
            <NBIcon
                as={icon}
                color={color}
                size={size}
            />
        </Button>
    );
}