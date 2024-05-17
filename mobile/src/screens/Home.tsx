import { AdCard } from "@components/AdCard";
import { FilterActionsheet } from "@components/FilterActionsheet";
import { HomeHeader } from "@components/HomeHeader";
import { Loading } from "@components/Loading";
import { MyAdsStatisticsCard } from "@components/MyAdsStatisticsCard";
import { SearchInput } from "@components/SearchInput";
import { AdDTO } from "@dtos/AdDTO";
import { useProducts } from "@hooks/useProducts";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Center, FlatList, HStack, Heading, ScrollView, Text, VStack, useToast } from "native-base";
import { useCallback, useState } from "react";
import { Keyboard } from "react-native";

export type FilterProps = {
    valid: boolean,
    is_new: number,
    accept_trade: boolean,
    payment_methods: string[]
}

export function Home(){
    const [isLoading, setIsLoading] = useState(true);
    const [ads, setAds] = useState<AdDTO[]>();
    const [isNew, setIsNew] = useState(0);
    const [acceptTrade, setAcceptTrade] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
    const [query, setQuery] = useState('');
    const [isOpenFilterActionSheet, setIsOpenFilterActionSheet] = useState(false);

    const toast = useToast();
    const {setTotals} = useProducts();

    async function filteredAds(){
        try {
            setIsOpenFilterActionSheet(false);
            Keyboard.dismiss();
            const routePersonal = `/products/?${isNew === 0 ? '' : 
            isNew === 1 ? 'is_new=true&' : 'is_new=false&'}${!acceptTrade ? '' :`accept_trade=${acceptTrade}&`}${
            paymentMethods.map(item => `&payment_methods=${item}`)
            }${query != '' ? `query=${query}` : ''}`;
            console.log(routePersonal);
            const {data} = await api.get(routePersonal);
            if(data){
                setAds(data);
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

    async function fetchAds(){
        try {
            setQuery('');
            setIsOpenFilterActionSheet(false);
            const {data} = await api.get('/products/');
            if(data){
                setAds(data);
            }
            const totals = await api.get('/users/products');
            setTotals(totals.data.length);
            
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
        fetchAds();
    }, []))
    return(
        <>{isLoading ? <Loading/> :
            <VStack
                flex={1}
                px={6}
                pt={16}
                bgColor={"gray.600"}
            >
                <HomeHeader/>
                <Text
                    fontFamily={"body"}
                    fontSize={"sm"}
                    color={"gray.300"}
                    lineHeight={"md"}
                    mt={8}
                    mb={3}
                >
                    Seus produtos anunciados para venda
                </Text>
                <MyAdsStatisticsCard/>
                <Text
                    fontFamily={"body"}
                    fontSize={"sm"}
                    color={"gray.300"}
                    lineHeight={"md"}
                    mt={8}
                    mb={3}
                >
                    Compre produtos variados
                </Text>
                <SearchInput
                    onPressSearch={filteredAds}
                    onPressFilterButton={() => setIsOpenFilterActionSheet(true)}
                    value={query}
                    onChangeText={setQuery}
                />
                <FilterActionsheet 
                    onFilter={filteredAds}
                    isOpen={isOpenFilterActionSheet} 
                    onClose={() => setIsOpenFilterActionSheet(false)}
                    onReset={fetchAds}
                    onChangeAcceptTrade={setAcceptTrade}
                    onChangeIsNew={setIsNew}
                    onChangePaymentMethods={setPaymentMethods}
                    isNew={isNew}
                    acceptTrade={acceptTrade}
                    paymentMethods={paymentMethods}
                />
                <FlatList
                    flex={1}
                    mt={6}
                    data={ads}
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
                                fontFamily={"heading"}
                                fontSize={"sm"}
                                color={"gray.400"}
                                lineHeight={"md"}
                            >
                                Nenhum anúncio por enquanto!
                            </Heading>
                        </Center>
                    }
                />
            </VStack>
        }</>
    );
}