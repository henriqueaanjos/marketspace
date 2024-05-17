import { useEffect, useState } from "react";
import { AdHeader } from "@components/AdHeader";
import { Button } from "@components/Button";
import { ButtonNewImage } from "@components/ButtonNewImage";
import { Checkbox } from "@components/Checkbox";
import { Input } from "@components/Input";
import { Radio } from "@components/Radio";
import { Select } from "@components/Select";
import { Switch } from "@components/Switch";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRouteProps } from "@routes/app.routes";
import { Center, HStack, Heading, Image, ScrollView, Text, VStack, View, useToast } from "native-base";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

import * as ImagePicker from 'expo-image-picker';
import { ButtonIcon } from "@components/ButtonIcon";
import { XCircle } from "phosphor-react-native";
import { paymentMethods } from "@utils/PaymentMethods";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { AdDTO } from "@dtos/AdDTO";

type FormDataProps = {
    name: string, 
    description: string,
    is_new: string,
    price: number,
    accept_trade: boolean,
    payment_methods: string[],
    images: string[]
}

type RouteParams = {
    data?: AdDTO
}



const newAdSchema = yup.object({
    name: yup.string().required('Informe o Título do Anúncio'),
    description: yup.string().required('Informe a Descrição do Produto'),
    is_new: yup.string().required('Selecione o estado do produto.'),
    price: yup.number().required('Informe o valor'),
    accept_trade: yup.boolean().required(),
    payment_methods: yup.array().of(yup.string().required()).required('Selecione pelo menos uma forma de pagamento').test({
        message: 'Selecione pelo menos uma forma de pagamento',
        test: arr => arr.length > 0
    }),
    images: yup.array().of(yup.string().required()).required().test({
        test: arr => arr.length > 0
    })
});


export function NewAd(){
    const [isLoading, setIsLoading] = useState(false);
    const route = useRoute();
    const { data } = route.params as RouteParams;

    const navigation = useNavigation<AppNavigatorRouteProps>();
    const toast = useToast();
    const { user } = useAuth();
    

    const { control, handleSubmit, formState: {errors} } = useForm({
        resolver: yupResolver(newAdSchema),
        defaultValues: {
            name: data ? data.name : '',
            description: data ? data.description : '',
            is_new: data ? data.is_new ? 'new' : 'used' : '',
            price: data ? data.price : 0 ,
            accept_trade:  data ? data.accept_trade : false,
            payment_methods: data ? data.payment_methods.map(item => item.key) : [],
            images: data ? data.product_images.map(item => item.path) : []
        }
    });

    async function handleRegister({name, description, is_new, price, accept_trade, payment_methods, images}: FormDataProps){
        if(!data){
            const preview: AdDTO = {
                id: '',
                name, 
                description,
                is_new: is_new === 'new',
                price,
                accept_trade,
                payment_methods: paymentMethods.filter(item => payment_methods.includes(item.key)),
                product_images: images.map(item => ({
                    id: '',
                    path: item,
                })),
                is_active: true,
                user_id: user.id,
                user: {
                    name: user.name,
                    avatar: user.avatar,
                    tel: user.tel
                }
            };
            console.log('images:', images);
            navigation.navigate('adDetails', { preview });
        }else{
            try {
                setIsLoading(true);
                await api.put(`/products/${data.id}`, {
                    name,
                    description,
                    is_new: is_new === 'new',
                    price,
                    accept_trade,
                    payment_methods: payment_methods
                });
                const deletedImages = data.product_images.filter(item => !images.includes(item.path));
                const newImages = images.filter(item => item.indexOf('file:') !== -1);
                
                await api.delete('/products/images/', {
                    data:{
                        productImagesIds: deletedImages.map(item => item.id)
                    }
                });

                const productsImagesUploadForm = new FormData();
                newImages.forEach((item, i) => {
                    const fileExtension = item.split('.').pop();
                    const imageFile = {
                        name: `${data.id}.${fileExtension}`.toLowerCase(),
                        uri: item,
                        type: `image/${fileExtension}`
                    } as any;
                    productsImagesUploadForm.append('images', imageFile);
                });
                productsImagesUploadForm.append('product_id', data.id);
                await api.post('/products/images/', productsImagesUploadForm, {
                    headers:{
                        'Content-Type': 'multipart/form-data'
                    }
                })
                ///-----------------------------------------------------
                /// VERIFICAR SE TEVE ALTERAÇÕES NAS IMAGES E ALTERA-LAS
                ///-----------------------------------------------------

                navigation.navigate('adDetails', {product_id : data.id});
                toast.show({
                    title: 'Anúncio Editado com sucesso', 
                    placement: 'top',
                    bgColor: 'green.300'
                });
            } catch (error) {
                const isAppError = error instanceof AppError;
                const title = isAppError ? error.message : '';
                toast.show({
                    title, 
                    placement: 'top',
                    bgColor: 'red.300'
                })
            }finally{
                setIsLoading(false);
            }
        }
    }

    function handleRemoveImage(imageRemoved: string, value: string[], onChange: (value: string[]) => void){
        onChange(value.filter(image => image !== imageRemoved));
    }

    async function handleUserPhotoSelect(onChange: (value: string[]) => void,value : string[]){
        const photoSelected = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            aspect:  [4,4],
            allowsEditing: true,
            selectionLimit: 3,
        });
        
        if(photoSelected.canceled){
            return;
        }if(photoSelected.assets[0].uri){
            photoSelected.assets.forEach(item => 
                onChange([...value, item.uri])
            );
        }
    }
    return(
        <VStack
            backgroundColor={"gray.600"}
            flex={1}
        >
            <AdHeader
                backButton
                title={!!data ? "Editar anúncio":"Criar anúncio"}
            />
            <ScrollView
                mt={3}
                px={6}
                _contentContainerStyle={{
                    pb: 7
                }}
            >
                <Heading
                    fontFamily={"heading"}
                    fontSize={"md"}
                    color={"gray.200"}
                    lineHeight={"md"}
                >
                    Imagens
                </Heading>
                <Text
                    fontFamily={"body"}
                    fontSize={"sm"}
                    color={"gray.300"}
                    lineHeight={"md"}
                    mb={4}
                >
                    Escolha até 3 imagens para mostrar o quanto o seu produto é incrível!
                </Text>
                <Controller
                    name='images'
                    control={control}
                    render={({field: {value = [], onChange}}) => 
                        <HStack space={2}>
                            {   
                                value.map((item, i) =>{
                                    const isLocaleItem = item.indexOf('file:') !== -1;
                                    return(
                                        <View
                                            key={i}
                                            w={100}
                                            h={100}
                                            alignItems={"flex-end"}
                                            justifyContent={"flex-start"}
                                        >
                                            <Image
                                                source={{uri: isLocaleItem ? item : `${api.defaults.baseURL}/images/${item}`}}
                                                alt="Imagem do produto"
                                                w={100}
                                                h={100}
                                                rounded={"md"}
                                            />
                                            <ButtonIcon
                                                icon={XCircle}
                                                color={"gray.200"}
                                                size={4}
                                                position={"absolute"}
                                                mx={1}
                                                my={1}
                                                onPress={() => handleRemoveImage(item, value, onChange)}
                                            />
                                        </View> 
                                    )
                                })
                            }
                            {value.length < 3 &&
                                <ButtonNewImage
                                    isInvalid={!!errors.images}
                                    onPress={() => handleUserPhotoSelect(onChange, value)}
                                />
                                    
                            }
                        </HStack>
                    }
                />
                <VStack
                    mt={8}
                    space={4}
                >
                    <Heading
                        fontFamily={"heading"}
                        fontSize={"md"}
                        color={"gray.200"}
                        lineHeight={"md"}
                    >
                        Sobre o produto
                    </Heading>
                    <Controller
                        name="name"
                        control={control}
                        render={({field: {value, onChange}}) =>
                            <Input
                                placeholder="Título do anúncio"
                                value={value}
                                onChangeText={onChange}
                                errorMessage={errors.name?.message}
                            />
                        }
                    />
                    <Controller
                        name="description"
                        control={control}
                        render={({field: {value, onChange}}) =>
                            <Input
                                placeholder="Descrição do produto"
                                multiline
                                numberOfLines={7}
                                h={160}
                                value={value}
                                onChangeText={onChange}
                                errorMessage={errors.description?.message}
                            />
                        }
                    />
                    <Controller
                        name="is_new"
                        control={control}
                        render={({field: {value = '', onChange}}) =>
                            <Radio
                                items={[{
                                    name: 'Produto Novo',
                                    key: 'new'
                                }, {
                                    name: 'Produto Usado',
                                    key: 'used'
                                }]}
                                name="radio"
                                direction="row"
                                value={value}
                                onChange={onChange}
                                errorMessage={errors.is_new?.message}
                            />
                        }
                    />
                    
                </VStack>
                <VStack
                    mt={8}
                    space={4}
                >
                    <Heading
                        fontFamily={"heading"}
                        fontSize={"md"}
                        color={"gray.200"}
                        lineHeight={"md"}
                    >
                        Venda
                    </Heading>
                    <Controller
                        name="price"
                        control={control}
                        render={({field: {value, onChange}}) =>
                            <Input
                                placeholder="Valor do produto"
                                label="R$"
                                keyboardType="decimal-pad"
                                value={ !!value ? String(value) : ''}
                                onChangeText={onChange}
                                errorMessage={errors.price?.message}
                            />
                        }
                    />
                    
                    <VStack
                        space={3}
                    >
                        <Heading
                            fontFamily={"heading"}
                            fontSize={"sm"}
                            color={"gray.200"}
                            lineHeight={"md"}
                        >
                            Aceita troca?
                        </Heading>
                        <HStack> 
                            <Controller
                                name="accept_trade"
                                control={control}
                                render={({field: {value, onChange}}) => 
                                    <Switch
                                        value={value}
                                        onChange={onChange}
                                    />
                                }
                            />
                            
                        </HStack>
                    </VStack>
                    <VStack
                        space={3}
                    >
                        <Heading
                            fontFamily={"heading"}
                            fontSize={"sm"}
                            color={"gray.200"}
                            lineHeight={"md"}
                        >
                            Meios de pagamento aceitos
                        </Heading>
                        <Controller
                            name="payment_methods"
                            control={control}
                            render={({field: {value = [], onChange}}) =>
                                <Checkbox
                                    items={paymentMethods}
                                    value={value}
                                    onChange={onChange}
                                    errorMessage={errors.payment_methods?.message}
                                />
                            }
                        />
                    </VStack>
                </VStack>
            </ScrollView>
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
                    title="Cancelar"
                    variant="neutral"
                />
                <Button
                    title="Avançar"
                    variant="secondary"
                    onPress={handleSubmit(handleRegister)}
                    isLoading={isLoading}
                />
            </HStack>
        </VStack>
    );
}