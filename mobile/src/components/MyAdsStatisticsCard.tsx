import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRouteProps, HomeNavigatorRouteProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { HStack, Heading, Text, VStack, useTheme, useToast } from "native-base";
import { ArrowRight, Tag } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Loading } from "./Loading";
import { useProducts } from "@hooks/useProducts";

export function MyAdsStatisticsCard(){

    const {colors} = useTheme();
    const navigation = useNavigation<HomeNavigatorRouteProps>();

    const { totals } = useProducts();

    function handleGoMyAds(){
        navigation.navigate('myAds');
    }
    
    return(
            <HStack
                px={4}
                py={3}
                alignItems={"center"}
                justifyContent={"space-between"}
                backgroundColor="blue.300:alpha.10"
                rounded={"md"}
            >
                <HStack
                    alignItems={"center"}
                    space={4}
                >
                    <Tag
                        color={colors.blue[500]}
                        size={22}
                    />
                    <VStack>
                        <Heading
                            fontFamily={"heading"}
                            fontSize={"lg"}
                            color={"gray.200"}
                            lineHeight={"md"}
                        >
                            {totals}
                        </Heading>
                        <Text
                            fontFamily={"body"}
                            fontSize={"xs"}
                            color={"gray.200"}
                            lineHeight={"md"}
                        >
                            anúncios ativos
                        </Text>
                    </VStack>
                </HStack>
                <TouchableOpacity
                    onPress={handleGoMyAds}
                >
                    <HStack
                        alignItems={"center"}
                        space={2}
                    >
                        <Heading
                            fontFamily={"heading"}
                            fontSize={"xs"}
                            color={"blue.500"}
                            lineHeight={"md"}
                        >
                            Meus anúncios
                        </Heading>
                        <ArrowRight
                            color={colors.blue[500]}
                            size={16}
                        />
                    </HStack>
                </TouchableOpacity>
            </HStack>
    );
}