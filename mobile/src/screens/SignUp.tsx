import { Text, VStack, Center, Image, HStack, ScrollView, useToast } from "native-base";

import { AvatarButton } from "@components/AvatarButton";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRouteProps } from "@routes/auth.routes";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'

import LogoIconSvg from '@assets/logo_icon.svg';
import { useState } from "react";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
    name: string,
    email: string,
    phone: string,
    password: string,
}

type PhotoInfo = {
    uri: string,
    type: string | undefined
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    email: yup.string().email('E-mail inválido').required('Informe o e-mail'),
    phone: yup.string()
        .matches(/^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)(?:((?:9\s?\d|[2-9])\d{3})\-?(\d{4}))$/,
            'Telefone inválido')
        .required('Informe o telefone'),
    password: yup.string()
        .min(6, 'A senha deve ter pelo menos 6 digítos')
        .required('Informe a senha'),
    password_confirm: yup.string()
        .oneOf([yup.ref('password')], 'As senhas não conferem')
        .required('Confirme a senha')
});

export function SignUp(){
    const [isLoading, setIsLoading] = useState(false);
    const [imageInfo, setImageInfo] = useState<PhotoInfo>({} as PhotoInfo);

    const navigation = useNavigation<AuthNavigatorRouteProps>();
    const { signIn } = useAuth();
    const toast = useToast();

    const { control, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(signUpSchema)
    })

    function handleGoSignIn(){
        navigation.navigate('signIn');
    }

    async function handleCreateNewAccount({name, email, phone, password}: FormDataProps){
        try {
            setIsLoading(true);
            if(!!imageInfo.uri){
                const fileExtension = imageInfo.uri.split('.').pop();

                const photoFile = {
                    name: `${name}.${fileExtension}`.toLowerCase(),
                    uri: imageInfo.uri,
                    type: `${imageInfo.type}/${fileExtension}`
                } as any;
                const formData = new FormData();
                formData.append('avatar', photoFile);
                formData.append('name', name);
                formData.append('email', email);
                formData.append('tel', phone);
                formData.append('password', password);

                await api.post('/users', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                } );
                await signIn(email, password);
            }
        } catch (error) {
            const isAppError = error instanceof AppError;
            console.log(error);
            const title = isAppError ? error.message : 'Não foi possível criar a conta agora. Tente novamente!';
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.300'
            });
        }finally{
            setIsLoading(false);
        }
    }

    return(
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <VStack
                flex={1}
                pt={16}
                px={12}
                backgroundColor={"gray.600"}
                justifyContent={"space-between"}
            >
            
            <Center
                mb={8}
            >
                <LogoIconSvg/>
                <Text
                    fontFamily={"heading"}
                    fontSize={"lg"}
                    color={"gray.100"}
                    lineHeight={"md"}
                    mt={3}
                >
                    Boas vindas!
                </Text>
                <Text
                    mt={2}
                    textAlign={"center"}
                    fontFamily={"body"}
                    fontSize={"sm"}
                    color={"gray.200"}
                    lineHeight={"md"}
                >
                    Crie sua conta e use o espaço para comprar {'\n'}
                    itens variados e vender seus produtos
                </Text>
            </Center>

            <VStack
                alignItems={"center"}
                space={4}
            >
                <AvatarButton onChange={setImageInfo}/>
                <Controller
                    name='name'
                    control={control}
                    render={({field: {value, onChange}}) => 
                        <Input
                            placeholder="Nome"
                            autoCorrect={false}
                            value={value}
                            onChangeText={onChange}
                            errorMessage={errors.name?.message}
                        />
                    }
                />
                <Controller
                    name="email"
                    control={control}
                    render={({field: {value, onChange}}) => 
                        <Input
                            placeholder="E-mail"
                            keyboardType="email-address"
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={value}
                            onChangeText={onChange}
                            errorMessage={errors.email?.message}
                        />
                    }
                />
                <Controller
                    name="phone"
                    control={control}
                    render={({field: {value, onChange}}) => 
                        <Input
                            placeholder="Telefone"
                            keyboardType="phone-pad"
                            value={value}
                            onChangeText={onChange}
                            errorMessage={errors.phone?.message}
                        />
                    }
                />
                <Controller
                    name="password"
                    control={control}
                    render={({field: {value, onChange}}) => 
                        <Input
                            placeholder="Senha"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                            errorMessage={errors.password?.message}
                        />
                    }
                />
                <Controller
                    name="password_confirm"
                    control={control}
                    render={({field: {value, onChange}}) => 
                        <Input
                            placeholder="Confirmar senha"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                            errorMessage={errors.password_confirm?.message}
                        />
                    }
                />
                <HStack>
                    <Button
                        title="Criar"
                        variant={'secondary'}
                        mt={2}
                        onPress={handleSubmit(handleCreateNewAccount)}
                        isLoading={isLoading}
                    />
                </HStack>
            </VStack>
            
            
            <Center
                mb={14}
            >
                <Text
                    mb={4}
                >
                    Já tem uma conta?
                </Text>
                <HStack>
                    <Button
                        title="Ir para o login"
                        variant={'neutral'}
                        onPress={handleGoSignIn}
                    />
                </HStack>
            </Center>
        </VStack>
        </ScrollView>
    );
}