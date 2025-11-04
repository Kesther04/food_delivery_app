import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {LinearTransition} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { allDishes } from "@/api/dish.api";
import { userProfile } from "@/api/user.api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/states/store";
import { toggleFavorite } from "@/states/actions/favoritesAction";
import { setFavorites } from "@/states/slices/favoritesSlice";

export default function Home() {
  const styles = createStyles();
  const [isFocused, setIsFocused] = useState(false);
  const [focusedFood, setFocusedFood] = useState<string | null>(null);
  const [query,setQuery] = useState("");  
  const categories= ["Popular","Meals","Fast Food","Drinks & Desserts","Snacks"];
  const [currentCat, setCurrentCat] = useState(""); 
  const router = useRouter();
  const [dishData,setDishData] = useState<any[]>([]);
  const [loading,setLoading] = useState(false);

  const favorites = useSelector((state:RootState) => state.favorites);
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Fetch dishes and favorites
  const fetchData = async () => {
    try {
      setLoading(true);
      const dishes = await allDishes();
      const user = await userProfile();
      setDishData(dishes);
      dispatch(setFavorites(user.favorites || []));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Refresh favorites when screen regains focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // ✅ Navigate to dish details
  const goToDish = (id: string) => {
    setFocusedFood(id === focusedFood ? null : id);
    router.push(`/dish/${id}`);
  };

  // ✅ Toggle category filter
  const toggleCategory = (cat: string) => {
    setCurrentCat(cat === currentCat ? "" : cat);
  };
  
  // ✅ Filter dishes by query or category
  const filteredDishes = dishData.filter((dish) => {
    const matchesQuery = dish.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = currentCat ? dish.category === currentCat : true;
    return matchesQuery && matchesCategory;
  });

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="darkred" />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.homeContainer} edges={['left', 'right', 'bottom']}>

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
              onPress={() => toggleCategory(item)}
            >
              {item}
            </Text>
          </Animated.View>
        )}
      />

      {/* foodCards */}
      <Animated.FlatList 
        contentContainerStyle={styles.foodCategory}
        data={filteredDishes}
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
              name={favorites.includes(item._id) ? "heart":"heart-outline"} 
              size={24} 
              color={favorites.includes(item._id) ? "red" : "white"}  
              style={styles.heart} 
              onPress={() => dispatch(toggleFavorite(item._id))} 
            />

            <View style={styles.foodText}>

              <Text style={{fontWeight: "bold",fontSize: 16}}>{item.name}</Text>
              <Text>{item.restaurantName}</Text>
              <Text>{item.address}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.foodPrice}>₦{item.price}</Text>
              
                <Text> <Ionicons name="star" size={10} color="gold" /> {item.rating}  </Text>
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
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
    },
    homeContainer:{
      flex: 1, backgroundColor:"white", fontFamily: "Inter_400Regular"
    },
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
      maxWidth: "50%",
      flex: 1,          // 👈 let FlatList handle sizing
      marginHorizontal: 4,
      shadowColor: "#000",
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation:1,
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
     priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 6,
      alignItems: "center",
    },
    foodPrice: {
      fontWeight: "600",
    },
    heart:{
      position:"absolute",
      top:10,
      right:10,
    }
  })
}
