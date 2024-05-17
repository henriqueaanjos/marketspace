import { Image, VStack, View, Text, Heading, HStack, Box, Button, Skeleton } from "native-base";

import ProductPng from '@assets/Product.png'
import { Badge } from "./Badge";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRouteProps } from "@routes/app.routes";
import { Avatar } from "./Avatar";
import { AdDTO } from "@dtos/AdDTO";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { useState } from "react";

type Props = {
    data: AdDTO
}


export function AdCard({data}: Props){
    const [isImageLoading, setImageLoading] = useState(false);
    let image;
    const navigation = useNavigation<AppNavigatorRouteProps>();

    const { user } = useAuth();

    function handleGoAdDetail(){
        navigation.navigate('adDetails', {product_id: data.id});
    }
    return(
            <TouchableOpacity 
                style={{
                    flexGrow: 1,
                    maxWidth: '48%',
                    minWidth: '45%'
                }}
                onPress={handleGoAdDetail}
            >
                <View>

                    <Image
                        source={!!data.product_images ? 
                            {uri: `${api.defaults.baseURL}/images/${data.product_images[0].path}`} : 
                            ProductPng
                        }
                        alt="Produto"
                        resizeMode="cover"
                        position={"absolute"}
                        backgroundColor={"transparent"}
                        w="full"
                        h={100}
                        rounded={"md"}
                        onLoadStart={() => setImageLoading(true)}
                        onLoadEnd={() => setImageLoading(false)}
                    />
                    <HStack 
                        p={1}
                        alignItems={"flex-start"}
                        justifyContent={"space-between"}
                        h={100}
                    >
                        
                        <Avatar
                            image={user.id === data.user_id ? user.avatar : data.user!.avatar}
                            size={6}
                            borderColor="gray.700"
                        />
                        <Badge type={data.is_new ? "new" : "used"}/>
                    </HStack>
                </View>
                {data.is_active === false &&
                    <HStack
                        w="full"
                        h={100}
                        position={"absolute"}
                        backgroundColor={"gray.100:alpha.60"}
                        rounded={"md"}
                        justifyItems={"flex-end"}
                        alignItems={"flex-end"}
                        p={2}
                    >
                        <Text
                            fontFamily={"heading"}
                            fontSize={"xs"}
                            color={"gray.700"}
                            lineHeight={"md"}
                            textTransform={"uppercase"}
                        >
                            Anúncio Desativado
                        </Text>
                    </HStack>
                }
                <VStack
                    px={.5}
                >
                    <Text
                        mt={1}
                        fontFamily={"body"}
                        fontSize={"sm"}
                        color={data.is_active === false ? "gray.400" : "gray.200"}
                        lineHeight={"md"}
                    >
                        {data.name}
                    </Text>
                    <Heading
                        fontFamily={"heading"}
                        fontSize={"xs"}
                        color={data.is_active === false ? "gray.400" : "gray.100"}
                        lineHeight={"md"}
                    >
                        R${' '} 
                        <Heading 
                            fontSize={"md"}
                            color={data.is_active === false ? "gray.400": "gray.100"}
                        >
                            {data.price}
                        </Heading>
                    </Heading> 
                </VStack>
            </TouchableOpacity>
    );
}