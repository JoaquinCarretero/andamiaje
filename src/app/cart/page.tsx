"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Eye } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { MainLayout } from "@/components/layouts/main-layout";
import { DishModal } from "@/components/dish-modal";
import { SiMercadopago } from "react-icons/si";

 export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  dietary: {
    isVegan: boolean;
    isVegetarian: boolean;
    isGlutenFree: boolean;
  };
  mealTime: string[];
}

const CustomButton: React.FC<ButtonProps & { variant?: string }> = ({
  children,
  ...props
}) => {
  return <Button {...props}>{children}</Button>;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Ensalada César",
      price: 10.99,
      quantity: 2,
      image: "/ensaladacesar.jpg",
      description:
        "Ensalada fresca con pollo a la parrilla, crutones y aderezo César",
      ingredients: [
        "Lechuga romana",
        "Pollo a la parrilla",
        "Crutones",
        "Queso parmesano",
        "Aderezo César",
      ],
      nutritionalInfo: { calories: 350, protein: 25, carbs: 10, fat: 20 },
      dietary: { isVegan: false, isVegetarian: false, isGlutenFree: true },
      mealTime: ["Almuerzo", "Cena"],
    },
    {
      id: "2",
      name: "Pasta Alfredo",
      price: 12.99,
      quantity: 1,
      image: "/pastaalfredo.jpg",
      description: "Pasta cremosa con salsa Alfredo y queso parmesano",
      ingredients: ["Fettuccine", "Crema", "Mantequilla", "Queso parmesano"],
      nutritionalInfo: { calories: 600, protein: 20, carbs: 70, fat: 35 },
      dietary: { isVegan: false, isVegetarian: true, isGlutenFree: false },
      mealTime: ["Almuerzo", "Cena"],
    },
    {
      id: "3",
      name: "Pollo a la Parrilla",
      price: 14.99,
      quantity: 1,
      image: "/polloparrilla.jpg",
      description: "Pechuga de pollo a la parrilla con hierbas",
      ingredients: ["Pechuga de pollo", "Hierbas", "Limón", "Aceite de oliva"],
      nutritionalInfo: { calories: 300, protein: 35, carbs: 0, fat: 15 },
      dietary: { isVegan: false, isVegetarian: false, isGlutenFree: true },
      mealTime: ["Almuerzo", "Cena"],
    },
  ]);
  const [couponCode, setCouponCode] = useState("");
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<CartItem | null>(null);
  const { toast } = useToast();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = subtotal;

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setItemToRemove(id);
    } else {
      setCartItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    setItemToRemove(null);
    toast("El artículo ha sido eliminado de tu carrito.");
  };

  const applyCoupon = () => {
    // Aquí iría la lógica para aplicar el cupón
    toast("El descuento ha sido aplicado a tu pedido.");
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Tu Carrito</h1>
          <Link href="/menu" passHref>
            <CustomButton variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={20} />
              Seguir comprando
            </CustomButton>
          </Link>
        </div>

        <AnimatePresence>
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="text-center py-16">
                <CardContent>
                  <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">
                    Tu carrito está vacío
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    ¿Por qué no agregas algunos deliciosos platos?
                  </p>
                  <Link href="/menu" passHref>
                    <CustomButton>Ver Menú</CustomButton>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Artículos en tu carrito</CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y">
                    <AnimatePresence>
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center py-4 gap-4"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                            style={{ width: "80px", height: "80px" }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CustomButton
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </CustomButton>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <CustomButton
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </CustomButton>
                          </div>
                          <CustomButton
                            variant="ghost"
                            size="icon"
                            onClick={() => setItemToRemove(item.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-5 w-5" />
                          </CustomButton>
                          <CustomButton
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedDish(item)}
                            className="text-primary"
                          >
                            <Eye className="h-5 w-5" />
                          </CustomButton>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen del Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Código de cupón"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <CustomButton onClick={applyCoupon}>Aplicar</CustomButton>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <CustomButton className="w-full" size="lg">
                      Proceder al pago
                    </CustomButton>
                    <CustomButton
                      className="w-full flex items-center justify-center"
                      variant="outline"
                      style={{
                        backgroundColor: "#009ee3",
                        color: "white",
                        border: "none",
                      }}
                    >
                      <SiMercadopago className="mr-2 h-5 w-5 fill-current text-white" />
                      Pagar con Mercado Pago
                    </CustomButton>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      <AlertDialog
        open={!!itemToRemove}
        onOpenChange={() => setItemToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el producto de tu carrito.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToRemove && removeItem(itemToRemove)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedDish && (
        <DishModal
          isOpen={!!selectedDish}
          onClose={() => setSelectedDish(null)}
          dish={selectedDish}
          isCartView={true}
        />
      )}
    </MainLayout>
  );
}
