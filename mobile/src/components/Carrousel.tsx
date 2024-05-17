import { ScrollView, Image, View, HStack, Button, Text, Center } from "native-base";
import { Dimensions, ScrollView as RNScrollView} from "react-native";

import productPng from '@assets/Product.png';
import { useEffect, useRef, useState } from "react";
import { api } from "@services/api";

type ScrollProps = {
    layoutMeasurement:{
        width: number,
    },
    contentOffset: {
        x: number
    },
    contentSize: {
        width: number
    }
}

type Props = {
    images: string[],
    isActive: boolean
}

export function Carrousel({images, isActive}: Props){
    const [activeImage, setActiveImage] = useState(0); 

    const width = Dimensions.get('window').width;

    const scrollRef = useRef<RNScrollView>(null);

    function scrollPercentage({layoutMeasurement, contentOffset, contentSize}: ScrollProps){
        setActiveImage(contentOffset.x/width);
    }
    
    function handleChangeActiveImage(index: number){
        setActiveImage(index);
        scrollRef.current?.scrollTo({
            x: index * width
        });
    }

    return(
        <View>
            <ScrollView
                ref={scrollRef}
                backgroundColor={"gray.400"}
                
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(event) => scrollPercentage(event.nativeEvent)}
            >
                {
                    images.map((item, i) => 
                        <Image
                            key={i}
                            w={width}
                            h={72}
                            source={!!item ? {uri: item} : productPng}
                            alt='Produto'
                            resizeMode="cover"
                        />
                    )
                }
                
                
            </ScrollView>
            <HStack
                space={1}
                position={"relative"}
                top={-7}
            >
                {/* <Button
                    flexGrow={1}
                    h={1}
                    p={0}
                />
                <Button
                    flexGrow={1}
                    h={1}
                    p={0}
                />
                 */}
                {
                    images.map((item, i) => 
                        <Button
                            key={i}
                            flexGrow={1}
                            h={1}
                            p={0}
                            
                            backgroundColor={
                                i === activeImage ? 
                                    "gray.700:alpha.75" 
                                : "gray.700:alpha.50"
                            }
                            onPress={() => handleChangeActiveImage(i)}
                        />
                    )
                }
            </HStack>
            {!isActive &&
                    <Center
                        w="full"
                        h="full"
                        position={"absolute"}
                        backgroundColor={"gray.100:alpha.60"}
                        p={2}
                    >
                        <Text
                            fontFamily={"heading"}
                            fontSize={"sm"}
                            color={"gray.700"}
                            lineHeight={"md"}
                            textTransform={"uppercase"}
                        >
                            Anúncio Desativado
                        </Text>
                    </Center>
                }
        </View>
    );
}