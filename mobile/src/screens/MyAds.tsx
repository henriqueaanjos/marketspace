import { AdCard } from "@components/AdCard";
import { AdHeader } from "@components/AdHeader";
import { Loading } from "@components/Loading";
import { Select } from "@components/Select";
import { AdDTO } from "@dtos/AdDTO";
import { useProducts } from "@hooks/useProducts";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRouteProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Center, FlatList, HStack, Heading, Text, VStack, View, useToast } from "native-base";
import { Plus } from "phosphor-react-native";
import { useCallback, useState } from "react";

type filterType = 'all' | 'new' | 'used';

export function MyAds(){
    const [isLoading, setIsLoading] = useState(true);
    const [myAds, setMyAds] = useState<AdDTO[]>();
    const [filteredAds, setFilteredAds] = useState<AdDTO[]>();
    
    const navigation = useNavigation<AppNavigatorRouteProps> ();
    const toast = useToast();

    function handleGoNewAd(){
        navigation.navigate('newAd', {});
    }

    async function filterMyAds(filter: string){
        switch (filter) {
            case 'Todos':
                setFilteredAds(myAds);
                break;
            case 'Novos':
                setFilteredAds(myAds?.filter(item => item.is_new === true));
                break;
            case 'Usados':
                setFilteredAds(myAds?.filter(item => item.is_new === false));
                break;
        }
    }

    async function fetchMyAds(){
        try {   
            const {data} = await api.get('/users/products');
            if(data){
                setMyAds(data);
                setFilteredAds(data);
            }
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possivel carregar os seus anúncios agora. Tente Novamente!';
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.300'
            })
        }finally{
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fetchMyAds();
    }, []))
    return(
       <>{isLoading ? <Loading/> :
        <VStack flex={1}>
                <AdHeader
                    title="Meus anúncios"
                    actionButtonIcon={Plus}
                    onPressActionButton={handleGoNewAd}
                />
                <HStack
                    mt={8}
                    mb={5}
                    mx={6}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    zIndex={999999}
                >
                    <Text
                        fontFamily={"body"}
                        fontSize={"sm"}
                        color={"gray.200"}
                        lineHeight={"md"}
                    >
                        {myAds?.length} anúncios
                    </Text>
                    <Select
                        items={['Todos', 'Novos', 'Usados']}
                        onChangeValue={filterMyAds}
                    />
                </HStack>
                <View
                    flex={1}
                    px={6}
                >
                    <FlatList
                        flex={1}
                        data={filteredAds}
                        keyExtractor={item => item.toString()}
                        renderItem={({item}) =>
                            <AdCard data={item}/>
                        }
                        columnWrapperStyle={{
                            gap: 20
                        }}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            gap: 20,
                            paddingBottom: 80
                        }}
                        ListEmptyComponent={() => 
                            <Center 
                                flex={1}
                                mt={6}
                            >
                                <Heading
                                    textAlign={"center"}
                                    fontFamily={"heading"}
                                    fontSize={"sm"}
                                    color={"gray.400"}
                                    lineHeight={"md"}
                                >
                                    Nenhum anúncio anúncio cadastrado. Crie o seu primeiro agora!
                                </Heading>
                            </Center>
                        }
                    />
                </View>
            </VStack>
        }
        </>
    );
}