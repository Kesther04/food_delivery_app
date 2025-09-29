import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text , View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { data } from "@/data/dishes"; 
import { useEffect, useState } from "react";

interface dishProp{
    id:number;
    name:string;
    image:string;
    restaurant:string;
    price:number;
    rating:number;
    location:string;
    desc:string;
} 

export default function DishScreen () {
    const { id } = useLocalSearchParams(); 
    const router = useRouter();
    const styles = createStyles();
    const [liked, setLiked] = useState<string[]>([]);
    const [dish, setDish] = useState<dishProp>({
        id:0,
        name:"",
        image:"",
        restaurant:"",
        price:0,
        rating:0,
        location:"",
        desc:""
    });
    const [cartCount, setCartCount] = useState(0);

    useEffect(()=>{
        let dishData = data.filter(item => item.id.toString() == id);
        setDish(dishData[0]);
    },[id]);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.foodHeader}>{dish.name}</Text>

                <View>
                    <Image source={{ uri: dish.image }} style={styles.foodImg} />

                    <Ionicons
                        name={liked.includes(dish.id.toString()) ? "heart" : "heart-outline"}
                        size={30} 
                        color={liked.includes(dish.id.toString()) ? "red" : "white"}  
                        style={styles.heart} 
                        onPress={() => 
                        setLiked(prev => liked.includes(dish.id.toString()) ? prev.filter(i => i !== dish.id.toString()) : [...prev, dish.id.toString()]
                        )} 
                    />
                </View>

                <View style={{flexDirection:"row",justifyContent:"space-between",paddingVertical:10}}>
                    <View style={{flexDirection:"column", gap:5}}>
                        <View style={{flexDirection:"row", gap:8}}>
                            <Text>N{dish.price}</Text>
                            <Text> <Ionicons name="star" size={10} /> {dish.rating}</Text>
                        </View>

                        <Text><Ionicons name="restaurant" size={12} /> {dish.restaurant}</Text>
                        <Text><Ionicons name="location" size={12} /> {dish.location}</Text>
                    </View>
                    <View>
                        <View style={styles.addToCart}>
                            <Text style={{color:"white",fontSize:20}} 
                            onPress={() => setCartCount(prev => prev == 0 ? 0 : prev - 1)}>-</Text>
                            <Text style={{color:"white",fontSize:20}}>{cartCount}</Text>
                            <Text style={{color:"white",fontSize:20}} onPress={() => setCartCount(prev => prev + 1)}>+</Text>
                        </View>
                    </View>
                </View>

                <View style={{paddingVertical:10}}>
                    <Text style={{fontSize:16, fontWeight:"bold"}}>Description</Text>
                    <Text style={styles.foodDesc}>{dish.desc}</Text>
                </View>

                
            </View>

            <View style={styles.cartCalc}>
                <Text>Total:</Text>
                <Pressable style={styles.addToCart} onPress={() => router.back()}>
                <Text style={{color:"white"}}>Add to Cart</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}


function createStyles() {
    return StyleSheet.create({
        container:{
            padding:20,
            flex:1,
            backgroundColor:"white"
        },
        foodHeader:{
            fontSize:20,
            fontWeight:"bold",
            marginBottom:20
        },
        foodImg:{
            width: "100%",
            height: 200,
            borderRadius:10
        },
        foodDesc:{
            padding:3
        },
        heart:{
            position:"absolute",
            top:10,
            right:10,
        },
        addToCart:{
            paddingHorizontal:20,
            paddingVertical:10,
            backgroundColor:"darkred",
            color:"white",
            borderRadius:5,
            flexDirection:"row",
            gap:20,
            alignItems:"center",
            justifyContent:"center"
        },
        cartCalc:{
            position:"absolute",
            bottom:0,
            left:0,
            padding:20,
            minWidth:360,
            width:"100%",
            backgroundColor:"white",
            flexDirection:"row",
            justifyContent:"space-between",
            alignItems:"center",
            borderTopLeftRadius:20,
            borderTopRightRadius:20,
            shadowColor: "#000",
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation:5,
            borderWidth:0.25,
            borderColor:"lightgray"
        }
    });
}