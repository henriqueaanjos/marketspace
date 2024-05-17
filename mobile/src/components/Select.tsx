import { Text, HStack, useTheme, VStack, Button } from 'native-base';
import { CaretDown, CaretUp } from 'phosphor-react-native';
import { useState } from 'react';

type Props = {
    items: string[],
    onChangeValue?: (item: string) => void
}

export function Select({items, onChangeValue}: Props){
    const [isDropDownVisible, setIsDropDownVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState('Todos');
    const {sizes, colors} = useTheme();


    function handleChangeDropDownVisibility(){
        setIsDropDownVisible(old => !old);
    }

    function handleChangeItemSelected(item: string){
        setSelectedItem(item);
        setIsDropDownVisible(false);
        if(onChangeValue)
            onChangeValue(item);
    }

    return(
        <VStack 
            position={'fixed'}
        >
            <Button 
                p={0}
                backgroundColor="transparent"
                onPress={handleChangeDropDownVisibility}
            >
                <HStack
                    alignItems={'center'}
                    space={8}
                    borderWidth={1}
                    borderColor={isDropDownVisible ? 'gray.400' :'gray.500'}
                    px={3}
                    py={2}
                    rounded={'md'}
                >
                    <Text
                        fontFamily={'body'}
                        fontSize={'sm'}
                        color={'gray.100'}
                        lineHeight={'md'}
                    >
                        {selectedItem}
                    </Text>
                    {isDropDownVisible ?
                        <CaretUp 
                            size={sizes[4]}
                            color={colors.gray[300]}
                        />
                    :
                        <CaretDown 
                            size={sizes[4]}
                            color={colors.gray[300]}
                        />
                    }
                </HStack>
            </Button>
            {isDropDownVisible &&
                <VStack
                    backgroundColor={'white'}
                    rounded={'md'}
                    mt={10}
                    position={'absolute'}
                    zIndex={999}
                    shadow={1}
                    alignItems={'flex-start'}
                    p={3}
                    space={3}
                    w="full"
                >
                    { items.map( (item, i) => 
                        <Button 
                            key={i}
                            p={0}
                            backgroundColor="transparent"
                            onPress={() => handleChangeItemSelected(item)}
                        >
                            <Text
                                fontFamily={item === selectedItem ? 'heading' : 'body'}
                                fontSize={'sm'}
                                color={'gray.100'}
                                lineHeight={'md'}
                            >
                                {item}
                            </Text>
                        </Button>
                    )}
                </VStack>
            }

        </VStack>
    );
}