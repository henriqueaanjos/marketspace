import { HStack, Image, VStack, Text, Heading, View } from "native-base";
import { useState } from "react";
import { Button } from "./Button";
import { Plus } from "phosphor-react-native";
import { Avatar } from "./Avatar";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRouteProps } from "@routes/app.routes";
import { useAuth } from "@hooks/useAuth";

export function HomeHeader(){
    const [image, setImage] = useState('');
    const { user } = useAuth();
    const navigation = useNavigation<AppNavigatorRouteProps>();

    function handleGoNewAd(){
        navigation.navigate('newAd', {});
    }

    return(
        <HStack
            alignItems={"center"}
            justifyContent={"space-between"}
        >
            <HStack>
                <Avatar
                    image={user.avatar}
                    size={45}
                />
                <VStack 
                    ml={2}
                >
                    <Text
                        fontFamily={"body"}
                        fontSize={"md"}
                        color={"gray.100"}
                        lineHeight={"md"}
                    >
                        Boas Vindas,
                    </Text>
                    <Heading
                        fontFamily={"heading"}
                        fontSize={"md"}
                        color={"gray.100"}
                        lineHeight={"md"}
                    >
                        {user.name}!
                    </Heading>
                </VStack>
            </HStack>
            <View>
                <Button
                    title="Criar anúncio"
                    variant={'secondary'}
                    icon={Plus}
                    w={'auto'}
                    onPress={handleGoNewAd}
                />
            </View>
        </HStack>
    );
}