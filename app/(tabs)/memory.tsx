import React, { useEffect, useState } from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
Pressable,
ImageBackground
} from "react-native";
import { router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";
import { API, apiGetJson } from "@/lib/apiClient";

const BG = require("../../assets/sanri_glass_bg.jpg");

export default function MemoryScreen(){

const [items,setItems]=useState<any[]>([])

useEffect(()=>{
load()
},[])

async function load(){

try{

const data:any = await apiGetJson(`${API.base}/memory`,20000)

setItems(data || [])

}catch(e){
if (__DEV__) console.log(e)
}

}

return(

<View style={styles.root}>

<ImageBackground source={BG} style={StyleSheet.absoluteFillObject} />

<View style={StyleSheet.absoluteFillObject}>
<MatrixRain opacity={0.1}/>
</View>

<ScrollView style={styles.container}>

<Text style={styles.title}>
Hafızam
</Text>

{items.map((m,i)=>(
<View key={i} style={styles.card}>

<Text style={styles.message}>
{m.message}
</Text>

<Text style={styles.answer}>
{m.response}
</Text>

</View>
))}

</ScrollView>

</View>

)

}

const styles = StyleSheet.create({

root:{flex:1,backgroundColor:"#07080d"},

container:{padding:20},

title:{
color:"white",
fontSize:32,
fontWeight:"900",
marginBottom:20
},

card:{
backgroundColor:"rgba(255,255,255,0.06)",
padding:16,
borderRadius:18,
marginBottom:12
},

message:{
color:"#7cf7d8",
marginBottom:6
},

answer:{
color:"white"
}

})