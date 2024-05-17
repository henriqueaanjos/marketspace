import { FormControl, HStack, IRadioGroupProps, Radio as NBRadio } from "native-base";

type ItemProps = {
    name:string,
    key: string
}

type Props = IRadioGroupProps & {
    items: ItemProps[],
    errorMessage?: string,
    value: string,
    onChange: (value: string) => void
}

export function Radio({items, errorMessage, value, onChange, isInvalid, ...rest}: Props){
    const invalid = !!errorMessage || isInvalid; 
    return(
        <FormControl isInvalid={invalid}>
            <NBRadio.Group
                value={value}
                onChange={onChange}
                {...rest}
            >
                <HStack space={5}>
                {
                    items.map((item, i) => 
                        <NBRadio 
                            value={item.key}
                            key={item.key}
                            _checked={{
                                borderColor: invalid ? "red.300" : "blue.300"
                            }}
                            _icon={{
                                color: invalid ?  "red.300" : "blue.300"
                            }}
                        >
                            {item.name}
                        </NBRadio>
                    )
                }
                </HStack>
            </NBRadio.Group>
            <FormControl.ErrorMessage
                _text={{ color: "red.300" }}
            >
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    );
}