import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {LinearTransition} from "react-native-reanimated";
import { data } from "../../data/dishes";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { allDishes } from "@/api/dish.api";

export default function Home() {
  const styles = createStyles();
  const [isFocused, setIsFocused] = useState(false);
  const [focusedFood, setFocusedFood] = useState<string | null>(null);
  const [liked, setLiked] = useState<string[]>([]);
  const [query,setQuery] = useState("");  
  const categories= ["Popular","Meals","Fast Food","Drinks & Desserts","Snacks"];
  const [currentCat, setCurrentCat] = useState(""); 
  const router = useRouter();
  const [dishData,setDishData] = useState(null);
  // const [loading,setLoading] = useState(false);

  const goToDish = (id: string) => {
    // navigation logic to go to dish screen with the id
    setFocusedFood(id.toString() === focusedFood ? null : id);
    // navigate to dish screen with id
    router.push(`/dish/${id}`);
  }

  useEffect(()=>{

    const fetchDishes = async () => {
      try {
        const data =  await allDishes();
        console.log(data);
        setDishData(data);   
      } catch (error) {
        console.error(error);
      }
    }

    fetchDishes();
  },[]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:"white" }} edges={['left', 'right', 'bottom']}>

      {/* searchBar */}
      <View style={styles.searchBar}>
        <TextInput
          style={!isFocused ? styles.searchInput : [styles.searchInput, {outline:"none"}]}
          placeholder="Search for desired Dish here.."
          placeholderTextColor={"gray"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={setQuery}
          value={query}
        />
        <Ionicons name="search" size={24} color={"black"} style={styles.searchIcon} onPress={() => alert(`Searched for ${query}`)}/>
      </View>
      
      {/* Categories */}
      <Animated.FlatList
        contentContainerStyle={styles.filter}
        data={categories}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        itemLayoutAnimation={LinearTransition} // ✅ use this instead of layout
        renderItem={({ item }) => (
          <Animated.View>
            <Text
              style={
                currentCat === item
                  ? [
                      styles.filterItem,
                      {
                        backgroundColor: "darkred",
                        color: "white",
                        borderColor: "darkred",
                      },
                    ]
                  : styles.filterItem
              }
              onPress={() => setCurrentCat(item)}
            >
              {item}
            </Text>
          </Animated.View>
        )}
      />

      {/* foodCards */}
      <Animated.FlatList 
        contentContainerStyle={styles.foodCategory}
        data={dishData}
        keyExtractor={(item) => item._id}
        numColumns={2} // 👈 2 cards per row
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 8 }}
        itemLayoutAnimation={LinearTransition}
        renderItem={({ item }) => (
          <View style={styles.foodItem}>

            <Pressable style={{overflow:"hidden",borderTopLeftRadius: 10,borderTopRightRadius: 10}} 
            onPress={() => goToDish(item._id)}>
            {/* image */}
            <Image
              source={{ uri: item.imageUrl }}
              style={focusedFood === item.name ? [styles.foodImg, { transform: [{ scale: 1.2 }] }] : styles.foodImg}
            />
            </Pressable>

              <Ionicons 
                name={liked.includes(item._id) ? "heart":"heart-outline"} 
                size={24} 
                color={liked.includes(item._id) ? "red" : "white"}  
                style={styles.heart} 
                onPress={() => 
                  setLiked(prev => liked.includes(item._id) ? prev.filter(i => i !== item._id) : [...prev, item._id]
                )} 
              />
            <View style={styles.foodText}>

              <Text style={{fontWeight: "bold",fontSize: 16}}>{item.name}</Text>
              <Text>{item.restaurant}</Text>
              <Text>{item.address}</Text>
              <View style={{ flexDirection: "row", gap: 2 }}>
                <Text>N{item.price}</Text>
                <Text>
                  <Ionicons name="star" size={10} /> {item.rating}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
       
    </SafeAreaView>
  );
}


function createStyles() {
  return StyleSheet.create({
    searchBar:{
      paddingVertical:4,
      paddingHorizontal:2,
      flexDirection:"column",
      margin:10
    },
    searchInput:{
      padding:10,
      paddingLeft:50,
      fontSize:15,
      borderRadius:10,
      borderStyle:"solid",
      borderColor:"black",
      borderWidth:1,
      color:"black",
      pointerEvents:"auto",
    },
    searchIcon:{
      position:"absolute",
      left:15,
      top:12
    },
    filter:{
      flexDirection:"row",
      gap:8,
      padding:5,
      height:80
    },
    filterItem:{
      padding:8,
      minWidth:100,
      borderColor:"gray",
      borderStyle:"solid",
      borderWidth:0.5,
      fontWeight:500,
      borderRadius:10,
      textAlign:"center",
      color:"darkred"
    },
    foodCategory: {
      paddingVertical: 20
    },
    foodItem: {
      backgroundColor: "#fff",
      borderColor: "gray",
      borderWidth: 0,
      borderRadius: 10,
      marginBottom: 12,
      flex: 1,          // 👈 let FlatList handle sizing
      marginHorizontal: 4,
      shadowColor: "#000",
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation:5
    },
    foodImg:{
      width: "100%",
      height: 100,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      transitionDuration: "500ms",
      transform:[{scale:1}],
    },
    foodText:{
      padding:10
    },
    heart:{
      position:"absolute",
      top:10,
      right:10,
    }
  })
}