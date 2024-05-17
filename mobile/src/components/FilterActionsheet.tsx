import { Actionsheet, Box, HStack, Heading, IActionsheetProps, Text, VStack, View, useTheme } from "native-base";
import { X } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";
import { Badge } from "./Badge";
import { Switch } from "./Switch";
import { Checkbox } from "./Checkbox";
import { Button } from "./Button";
import { ButtonIcon } from "./ButtonIcon";
import { Tag } from "./Tag";
import { paymentMethods as PMItems } from "@utils/PaymentMethods";
import { useState } from "react";
import { FilterProps } from "@screens/Home";

type OptionsProps = 'is_new' | 'accept_trade' | 'payment_methods';

type Props = IActionsheetProps & {
    isNew: number, 
    onChangeIsNew: (value: number) => void,
    acceptTrade: boolean, 
    onChangeAcceptTrade: (value: boolean) => void,
    paymentMethods: string[], 
    onChangePaymentMethods: (value: string[]) => void,
    onReset: (valid: boolean) => void,
    onFilter: () => void
}

export function FilterActionsheet({
    onClose,
    isNew,
    acceptTrade,
    paymentMethods,
    onChangeAcceptTrade,
    onChangeIsNew,
    onChangePaymentMethods,
    onReset,
    onFilter,
    ...rest
}: Props){
    
    const {colors, sizes} = useTheme();

    function resetFilters(){
        onChangeAcceptTrade(false);
        onChangeIsNew(0);
        onChangePaymentMethods([]);
        onReset(false);
    }
    return(
        <Actionsheet
            onClose={onClose}
            {...rest}
        >
            <Actionsheet.Content
                _dragIndicator={{
                    w: "56px",
                    backgroundColor: colors.gray[400],
                }}
            >
                <Box
                    w="full"
                    px={6}
                    py={8}
                >
                    <HStack
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Heading
                            fontFamily={"heading"}
                            fontSize={"lg"}
                            color={"gray.100"}
                            lineHeight={"md"}
                        >
                            Filtrar anúncios
                        </Heading>
                        <ButtonIcon
                            onPress={onClose}
                            icon={X}
                            size={6}
                            color={"gray.400"}
                        />
                    </HStack> 
                    <Text
                        fontFamily={"heading"}
                        fontSize={"sm"}
                        color={"gray.200"}
                        lineHeight={"md"}
                        mt={6}
                        mb={3}
                    >
                        Condição
                    </Text>
                    
                        <Tag 
                            items={[{
                                name: 'Novo',
                                key: 1
                            },{
                                name: 'Usado',
                                key: 2
                            }]}
                            value={isNew}
                            onChange={onChangeIsNew}
                        />
                    
                    <Text
                        fontFamily={"heading"}
                        fontSize={"sm"}
                        color={"gray.200"}
                        lineHeight={"md"}
                        mt={6}
                        mb={3}
                    >
                        Aceita troca?
                    </Text>
                    <HStack>
                        <Switch 
                            value={acceptTrade}
                            onChange={onChangeAcceptTrade}
                        />
                    </HStack>
                    <Text
                        fontFamily={"heading"}
                        fontSize={"sm"}
                        color={"gray.200"}
                        lineHeight={"md"}
                        mt={6}
                        mb={3}
                    >
                        Meios de pagamento aceitos
                    </Text>
                    <Checkbox
                        mb={16}
                        items={PMItems}
                        value={paymentMethods}
                        onChange={onChangePaymentMethods}
                    />
                    <HStack
                        flexGrow={1}
                        space={3}
                    >
                        <Button 
                            title="Resetar filtros" 
                            variant="neutral"
                            onPress={resetFilters}
                        />
                        <Button 
                            title="Aplicar filtros" 
                            variant="secondary"
                            onPress={onFilter}
                        />
                    </HStack>
                </Box>
            </Actionsheet.Content>
        </Actionsheet>
    );
}