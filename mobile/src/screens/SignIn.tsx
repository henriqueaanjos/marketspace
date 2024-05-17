import { HStack, Text, VStack, View, useToast } from "native-base";

import LogoSvg from '@assets/logo.svg';

import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRouteProps } from "@routes/auth.routes";

import {useForm, Controller} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";

type FormData = {
    email: string,
    password: string
}


const signInSchema = yup.object({
    email: yup.string().email('Digite um e-mail válido').required('Informe o e-mail'),
    password: yup.string().required('Informe a senha')
})

export function SignIn(){
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<AuthNavigatorRouteProps>();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signInSchema)
    });

    const { signIn } = useAuth();
    const toast = useToast();

    function handleGoSignUp(){
        navigation.navigate('signUp');
    }
    async function handleSignIn({email, password}: FormData){
        try {
            setIsLoading(true);
            await signIn(email, password);
        } catch (error) {
            const isAppError = error instanceof AppError;
            console.log(error);
            const title = isAppError ? error.message : 'Não foi possível fazer Login no momento, tente novamente!';
            toast.show({
                title,
                placement: "top",
                bgColor: 'red.300'
            })
        }finally{
            setIsLoading(false);
        }
    }

    return(
        <VStack 
            flex={1}
            backgroundColor={"gray.700"}
        >
            <VStack
                flex={1}
                backgroundColor={"gray.600"}
                alignItems={"center"}
                justifyContent={"space-around"}
                roundedBottom={24}
                px={12}
                pb={17}
                pt={27}
            >
                <LogoSvg/>
                <VStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    space={"md"}
                    mt={20}
                >
                    <Text
                        fontFamily={"body"}
                        fontSize={"sm"}
                        color={"gray.200"} 
                        lineHeight={"md"}
                    >
                        Acesse sua conta
                    </Text>
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
                </VStack>
                <HStack>
                    <Button
                        title="Entrar"
                        mt={8}
                        onPress={handleSubmit(handleSignIn)}
                        isLoading={isLoading}
                    />
                </HStack>
            </VStack>
            <VStack 
                px={12} 
                mb={20}
                mt={14}
                alignItems={"center"}
                justifyContent={"flex-end"}
            >
                <Text
                    fontFamily={"body"}
                    fontSize={"sm"}
                    color={"gray.200"} 
                    lineHeight={"md"}
                > 
                    Ainda não tem acesso ?
                </Text>
                <HStack>
                    <Button
                        mt={4}
                        title="Criar uma conta"
                        variant={'neutral'}
                        onPress={handleGoSignUp}
                    />
                </HStack>
            </VStack>
        </VStack>
    );
}