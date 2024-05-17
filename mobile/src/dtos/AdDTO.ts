export type AdDTO = {
    id: string,
    name: string,
    description: string, // Não é utilizado na Rota /products
    is_new: boolean,
    price: number,
    accept_trade: boolean,
    user_id: string,    // Não é utilizado na Rota /products
    is_active: boolean, // Não é utilizado na Rota /products
    product_images: {
        id: string,
        path: string,
    }[],
    payment_methods: {
        key: string,
        name: string
    }[],
    user: {   // Não é utilizado na Rota /products
        name: string  // Não é utilizado na Rota /products
        avatar: string,
        tel: string  // Não é utilizado na Rota /products
    }
}