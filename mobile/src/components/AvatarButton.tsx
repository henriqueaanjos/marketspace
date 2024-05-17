import { useState } from "react";
import { Button, HStack, Image, useTheme } from "native-base";
import { PencilSimple } from "phosphor-react-native";

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import avatarPng from '@assets/avatar.png';

type PhotoInfo = {
    uri: string,
    type: string | undefined
}

type Props = {
    onChange: (photoInfo : PhotoInfo) => void
}

export function AvatarButton({onChange}: Props){
    const theme = useTheme();
    const [imageSelected, setImageSelected] = useState('');

    async function handleUserPhotoSelect(){
        const photoSelected = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            aspect:  [4,4],
            allowsEditing: true,
            selectionLimit: 1,
        });
        
        if(photoSelected.canceled){
            return;
        }if(photoSelected.assets[0].uri){
            setImageSelected(photoSelected.assets[0].uri);
            onChange({
                uri: photoSelected.assets[0].uri,
                type: photoSelected.assets[0].type
            });
        }
    }

    return(
        <HStack
            alignItems={"flex-end"}
        >
            <Image
                source={!! imageSelected ? {uri: imageSelected} : avatarPng}
                alt="Selecione a Imagem de Perfil"
                w={88}
                h={88}
                rounded={"full"}
            />
            <Button
                backgroundColor={"blue.300"}
                rounded={"full"}
                w={10}
                h={10}
                ml={-8}
                _pressed={{
                    backgroundColor: 'blue.500'
                }}
                onPress={handleUserPhotoSelect}
            >
                <PencilSimple
                    size={16}
                    color={theme.colors.gray[600]}
                />
            </Button>
        </HStack>
    );
}