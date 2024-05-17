import { HStack, Heading, View, useTheme } from "native-base";
import { ButtonIcon } from "./ButtonIcon";
import { ArrowLeft, Icon } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRouteProps } from "@routes/app.routes";

type Props = {
    title?: string, 
    backButton?: boolean,
    actionButtonIcon?: Icon | null,
    onPressActionButton?: () => void
}

export function AdHeader({title, backButton, actionButtonIcon, onPressActionButton}: Props){
    const {colors, sizes} = useTheme();
    const navigation = useNavigation<AppNavigatorRouteProps> ();

    function handleGoBack(){
        navigation.goBack();
    }
    return(
        <HStack
            mt={16}
            alignItems={"center"}
            justifyContent={"space-between"}
            mx={6}
            pr={!!actionButtonIcon ? 0: 6}
            pl={backButton ? 0 : 6}
            mb={3}
        >
            <View>
            {
                backButton && 
                <ButtonIcon
                    onPress={handleGoBack}
                    icon={ArrowLeft}
                    color={colors.gray[100]}
                    size={sizes[6]}
                />
            }
            </View>
            <View flexGrow={1}>
            {
                !!title && 
                <Heading
                    alignSelf={"center"}
                    fontFamily={"heading"}
                    fontSize={"lg"}
                    color={"gray.100"}
                    lineHeight={"md"}
                >
                    {title}
                </Heading>
            } 
            </View>
            <View>
            {
                !!actionButtonIcon && 
                <ButtonIcon
                    onPress={onPressActionButton}
                    icon={actionButtonIcon}
                    color={colors.gray[100]}
                    size={sizes[6]}
                />
            } 
            </View>
        </HStack>
    );
}