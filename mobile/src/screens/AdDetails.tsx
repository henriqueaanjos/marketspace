import { Dimensions, Linking } from "react-native";
import { Center, HStack, Heading, Icon, Image, ScrollView, Text, VStack, View, useTheme, useToast } from "native-base";
import { ArrowLeft, ArrowRight, Bank, Barcode, CreditCard, Money, PencilSimple, PencilSimpleLine, Power, QrCode, RedditLogo, Tag, TrashSimple, WhatsappLogo } from "phosphor-react-native";

import { AdHeader } from "@components/AdHeader";
import { Carrousel } from "@components/Carrousel";
import { Avatar } from "@components/Avatar";
import { Badge } from "@components/Badge";
import { Button } from "@components/Button";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRouteProps, HomeNavigatorRouteProps } from "@routes/app.routes";
import { AdDTO } from "@dtos/AdDTO";
import { useAuth } from "@hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";

import { Loading } from "@components/Loading";


type RouteParams = {
    product_id?: string,
    preview?: AdDTO
}

export function AdDetails(){
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [isActivateLoading, setIsActivateLoading] = useState(false);
    const [isDeletingLoading, setIsDeletingLoading] = useState(false);
    const [adInfo, setAdInfo] = useState<AdDTO>({} as AdDTO);

    const navigation = useNavigation<AppNavigatorRouteProps>();
    const navigation2 = useNavigation<HomeNavigatorRouteProps>();
    const route = useRoute();
    const { preview, product_id } = route.params as RouteParams;

    const { user } = useAuth();
    const { colors } = useTheme();
    const toast = useToast();

    function handleEditAd(){
        navigation.navigate('newAd', {data: adInfo});
    }

    function handleGoBack(){
        navigation.goBack();
    }
    async function handleOpenWhatsApp(){
        const url = `https://wa.me/55${adInfo.user.tel}`
        const supported = await Linking.canOpenURL(url);
        if(supported)
            await Linking.openURL(url);
    }

    async function handleDelete(){
        try {
            setIsDeletingLoading(true);
            await api.delete(`/products/${adInfo.id}`);
            navigation2.navigate('myAds');
            toast.show({
                title: 'Anúncio Excluído com sucesso!',
                placement: 'top',
                bgColor: 'green.300'
            });
        } catch (error) {
            const isAppError = error instanceof AppError;
            console.log(error);
            const title = isAppError ? error.message : 'Não foi possível excluir o anúncio nesse momento. Tente novamente!'
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.300'
            })
        }finally{
            setIsDeletingLoading(false);
        }
    }

    async function handleChangeAdActivate(active: boolean){
        try {
            setIsActivateLoading(true);
            await api.patch(`/products/${adInfo.id}`, {
                is_active: active
            })
            const adInfoChanged = adInfo;
            adInfoChanged.is_active = active;
            setAdInfo(adInfoChanged)
        } catch (error) {
            const isAppError = error instanceof AppError;
            console.log(error);
            const title = isAppError ? error.message : `Não foi possível ${active ? 'Ativar' : 'Desativar'} o anúncio nesse momento. Tente novamente!`
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.300'
            })
        }finally{
            setIsActivateLoading(false);
        }
    }
    
    async function handleRegisterAd(){
        try {
            setIsRegisterLoading(true);
            if(preview){
                await api.post('/products/', {
                    name: preview.name,
                    description: preview.description,
                    is_new: preview.is_new,
                    price: preview.price,
                    accept_trade: preview.accept_trade,
                    payment_methods: preview.payment_methods.map(item => item.key)
                }).then(response => {
                    const productsImagesUploadForm = new FormData();
                    preview.product_images.forEach((item, i) => {
                        const fileExtension = item.path.split('.').pop();
                        const imageFile = {
                            name: `${preview.id}.${fileExtension}`.toLowerCase(),
                            uri: item.path,
                            type: `image/${fileExtension}`
                        } as any;
                        productsImagesUploadForm.append('images', imageFile);
                    });
                    productsImagesUploadForm.append('product_id', response.data.id);
                    return productsImagesUploadForm;
                }).then(async(productsImagesUploadForm) =>{
                    
                    await api.post('/products/images/', productsImagesUploadForm, {
                        headers:{
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                }).then(() =>{
                        toast.show({
                            title: 'Novo Anúncio publicado!',
                            placement: 'top',
                            bgColor: 'green.300'
                        });
                        navigation.navigate('home');
                    }               
                );
            }
        } catch (error) {
            const isAppError = error instanceof AppError;
            console.log(error);
            const title = isAppError ? error.message : 'Não foi possível criar o anúncio nesse momento. Tente novamente!'
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.300'
            })
        }finally{
            setIsRegisterLoading(false);
        }
    }

    async function fetchData(){
        try {
            const {data} = await api.get(`/products/${product_id}`);
            if(data)
                setAdInfo(data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível buscar as informações desse anúncio.';
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.300'
            });
        }finally{
            setIsDataLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        if(!!product_id){
            fetchData();
        }else{
            if(preview)
                setAdInfo(preview);
            setIsDataLoading(false);
        }

    }, []));


    return(
        <>{isDataLoading ? <Loading/> :
            <VStack
                backgroundColor={"gray.600"}
                flex={1}
            >   
                {!!preview  ?
                    <Center
                        px={6}
                        pt={16}
                        pb={4}
                        backgroundColor={"blue.300"}
                    >
                        <Heading
                            fontFamily={"heading"}
                            fontSize={"md"}
                            color={"gray.700"}
                            lineHeight={"md"}
                        >
                            Pré visualização do anúncio
                        </Heading>
                        <Text
                            fontFamily={"body"}
                            fontSize={"sm"}
                            color={"gray.700"}
                            lineHeight={"md"}
                        >
                            É assim que seu produto vai aparecer!
                        </Text>
                    </Center>    
                :
                    <AdHeader
                        backButton
                        actionButtonIcon={user.id === adInfo.user_id ? PencilSimpleLine : null}
                        onPressActionButton={user.id === adInfo.user_id ? handleEditAd : () => {}}
                    />
                }
                <ScrollView>
                    <Carrousel
                        images={adInfo.product_images.map(item => preview ? 
                            item.path
                            :`${api.defaults.baseURL}/images/${item.path}`)}
                        isActive={!!preview ? true : adInfo.is_active}
                    />
                    <VStack
                        px={6}
                        py={5}
                        flex={1}
                    >
                        <HStack
                            mb={6}
                            space={2}
                            alignItems={"center"}
                        >
                            <Avatar
                                image={adInfo.user.avatar}
                                size={6}
                            />
                            <Text
                                fontFamily={"body"}
                                fontSize={"sm"}
                                color={"gray.100"}
                                lineHeight={"md"}
                            >
                                {adInfo.user.name}
                            </Text>
                        </HStack>
                        <HStack
                            mb={2}
                        >
                            <Badge type={adInfo.is_new ? "new" : "used"}/>
                        </HStack>
                        <HStack
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            mb={2}
                        >
                            <Heading
                                fontFamily={"heading"}
                                fontSize={"lg"}
                                color={"gray.100"}
                                lineHeight={"md"}
                            >
                                {adInfo.name}
                            </Heading>
                            <Heading
                                fontFamily={"heading"}
                                fontSize={"sm"}
                                color={"blue.300"}
                                lineHeight={"md"}
                            >
                                R$ {' '}
                                <Heading
                                    fontFamily={"heading"}
                                    fontSize={"lg"}
                                    color={"blue.300"}
                                    lineHeight={"md"}
                                >
                                    {adInfo.price}
                                </Heading>
                            </Heading>
                        </HStack>
                        <HStack mb={6}>
                            <Text
                                fontFamily={"body"}
                                fontSize={"sm"}
                                color={"gray.200"}
                                lineHeight={"md"}
                            >
                                {adInfo.description}
                            </Text>
                        </HStack>
                        <HStack
                            space={2}
                            mb={4}
                        >
                            <Heading
                                fontFamily={"heading"}
                                fontSize={"sm"}
                                color={"gray.200"}
                                lineHeight={"md"}
                            >
                            Aceita troca? 
                            </Heading>
                            <Text
                                fontFamily={"body"}
                                fontSize={"sm"}
                                color={"gray.200"}
                                lineHeight={"md"}
                            >
                                {adInfo.accept_trade ? 'Sim' : 'Não'}
                            </Text>
                        </HStack>
                        <VStack
                            space={1}
                        >
                            <Heading
                                fontFamily={"heading"}
                                fontSize={"sm"}
                                color={"gray.200"}
                                lineHeight={"md"}
                                mb={1}
                            >
                                Meios de pagamento
                            </Heading>
                            {adInfo.payment_methods.map(item => 
                                <HStack
                                    key={item.key}
                                    space={2}
                                    alignItems={"center"}
                                >
                                    <Icon
                                        as={
                                            item.key === 'boleto' ? Barcode :
                                            item.key === 'pix' ? QrCode :
                                            item.key === 'cash' ? Money :
                                            item.key === 'card' ? CreditCard :
                                            Bank
                                        }
                                        size={18}
                                        color={colors.gray[100]}
                                    />
                                    <Text
                                        fontFamily={"body"}
                                        fontSize={"sm"}
                                        color={"gray.200"}
                                        lineHeight={"md"}
                                    >
                                        {item.name}
                                    </Text>
                                </HStack>
                            )}
                        </VStack>
                    </VStack>
                </ScrollView>
                {!!preview ?
                    <HStack
                        backgroundColor={"gray.700"}
                        px={6}
                        pt={5}
                        pb={7}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        space={3}
                    >
                        <Button
                            icon={ArrowLeft}
                            title="Voltar e editar"
                            variant="neutral"
                            onPress={handleGoBack}
                        />
                        <Button
                            icon={Tag}
                            title="Publicar"
                            variant="primary"
                            onPress={handleRegisterAd}
                            isLoading={isRegisterLoading}
                        />
                    </HStack>
                : adInfo.user_id === user.id ?
                    <VStack
                        px={6}
                        my={8}
                        space={2}
                    >
                        <Button
                            title={adInfo.is_active ? "Desativar anúncio" : "Reativar anúncio"}
                            variant={adInfo.is_active ? 'secondary' : 'primary'}
                            icon={Power}
                            onPress={() => handleChangeAdActivate(!adInfo.is_active)}
                            isLoading={isActivateLoading}
                        />
                        <Button
                            title="Excluir anúncio"
                            variant='neutral'
                            icon={TrashSimple}
                            isLoading={isDeletingLoading}
                            onPress={handleDelete}
                        />
                    </VStack>
                : 
                    <HStack
                        backgroundColor={"gray.700"}
                        px={6}
                        pt={5}
                        pb={7}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <HStack
                            alignItems={"center"}
                        >
                            <Heading
                                    fontFamily={"heading"}
                                    fontSize={"sm"}
                                    color={"blue.500"}
                                    lineHeight={"md"}
                                >
                                    R$ {' '}
                            </Heading>
                            <Heading
                                fontFamily={"heading"}
                                fontSize={"xl"}
                                color={"blue.500"} 
                                lineHeight={"md"}
                            >
                                {adInfo.price}
                            </Heading>
                        </HStack>
                        <VStack>
                            <Button
                                icon={WhatsappLogo}
                                title="Entrar em contato"
                                onPress={handleOpenWhatsApp}
                            />
                        </VStack>
                    </HStack>
                }
            </VStack>
        }</>
    );
}