'use client'

import { CartContext } from "@/app/providers"
import formatPrice from "@/utils/formatPrice"
import { Button, Card, CardFooter, CardHeader, Chip, Image, Input, Skeleton } from "@nextui-org/react"
import { Suspense, useContext, useEffect, useState } from "react"


export default function ProductCard({product}){
    const {cart, addToCart, removeFromCart} = useContext(CartContext)
    const [prod , setProd] = useState({
        ...product,
        quantity: 0,
        unitPrice:product.attributes.promo !== null ? product.attributes.promo : product.attributes.price
     })

    function setQuantity(value){
        let updateProd = {...prod, quantity: value}
        setProd(updateProd)

        updateProd = {...prod, quantity: Number(value)}
        
        if(value === 0 || value ===''){
            removeFromCart(updateProd)
        }

        if(value > 0) {
            console.log('test', updateProd)
            addToCart(updateProd)
        }
    }

    useEffect(()=>{

        let isItemInCart = cart.products.find(product => prod.id === product.id)

        if(isItemInCart){
            setProd({
                ...prod,
                quantity: isItemInCart.quantity
            })
        }
    }, [cart])




    return (
        <Card key={prod.id} radius="sm" isFooterBlurred className="overflow-visible border-none items-center" >
        <Image 
            alt={prod.attributes.name} 
            className="object-cover mt-8 mb-20"  
            isZoomed 
            src={prod.attributes.image}
        />
        <CardHeader className=" flex justify-between absolute z-10">
            {
                prod.attributes.stock > 0 ? 
                <Suspense fallback={<Skeleton/>}>
                <Chip
                    size="md"
                    variant="dot"
                    color="success"
                    classNames={{
                        base: "border-none bg-success/30",
                        content: "font-semibold text-success-800"
                    }}
                >
                    stock
                </Chip>
                </Suspense>
                 : 
                 <Suspense fallback={<Skeleton/>}>
                <Chip
                    size="md"
                    variant="dot"
                    color="danger"
                    classNames={{
                        base: "border-none bg-danger/30",
                        content: "font-semibold text-danger-800"
                    }}
                >
                    Rupture
                </Chip>
                </Suspense>
            }
            {
                prod.attributes.promo !== null && 
                <Suspense fallback={<Skeleton/>}>
                <Chip
                    color="primary" 
                    variant="shadow"
                    classNames={{
                        base: "border-none bg-primary/80",
                        content: "font-semibold"
                    }}
                    size="md"
                >
                    Promo
                </Chip>
                </Suspense>
            }
        </CardHeader>
        <Suspense fallback={<Skeleton/>}>
        <CardFooter className="overflow-hidden bg-primary/40 shadow-md absolute z-10 bottom-1 rounded-md w-[calc(100%_-_10px)] px-unit-4 mb-unit-2 flex flex-col items-start">
            <div className="flex justify-between w-full">
                    <Chip 
                        color="primary" 
                        variant="shadow"
                        classNames={{
                            base: "border-none bg-primary/50",
                            content: "font-semibold"
                        }}
                    >
                        <span className="font-bold">KMF </span> 
                        {
                            prod.attributes.promo !== null ? 
                            formatPrice(prod.attributes.promo) : formatPrice(prod.attributes.price)
                        }
                    </Chip> 
            </div>
            <p className="font-normal tracking-wide text-white my-2.5 lg:my-2 text-xl lg:text-medium">{prod.attributes.name}</p>
            {
                prod.quantity > 0 || prod.quantity === '' ?
                <Input
                    name='quantity'
                    type="number"
                    value={prod.quantity}
                    onValueChange={(value)=>{setQuantity(value)}}
                    variant="underlined"
                    size="sm"
                    color="primary"
                    classNames={{
                        input: "w-[50%] m-auto text-center text-white text-xl font-medium"
                    }}
                /> : 
                <Button 
                isDisabled={prod.attributes.stock > 0 ? false : true } 
                color="primary" 
                variant="flat" 
                className="font-medium m-auto text-white bg-primary/50 text-medium "
                onPress={()=>setQuantity(1)}
                >
                    Ajouter au panier
                </Button>

            }
            
        </CardFooter>
        </Suspense>
    </Card>
    )
}