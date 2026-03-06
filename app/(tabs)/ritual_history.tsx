import React,{useEffect,useState} from "react"
import {View,Text,ScrollView,StyleSheet} from "react-native"
import {API,apiGetJson} from "@/lib/apiClient"

export default function RitualHistory(){

const [rituals,setRituals]=useState<any[]>([])

useEffect(()=>{
load()
},[])

async function load(){

const data:any = await apiGetJson(`${API.base}/ritual-history`,20000)

setRituals(data || [])

}

return(

<ScrollView style={styles.container}>

<Text style={styles.title}>
Ritüel Geçmişim
</Text>

{rituals.map((r,i)=>(

<View key={i} style={styles.card}>

<Text style={styles.name}>
{r.title}
</Text>

<Text style={styles.desc}>
{r.text}
</Text>

</View>

))}

</ScrollView>

)

}

const styles = StyleSheet.create({

container:{flex:1,padding:20,backgroundColor:"#07080d"},

title:{color:"white",fontSize:30,fontWeight:"900",marginBottom:20},

card:{
backgroundColor:"rgba(255,255,255,0.06)",
padding:18,
borderRadius:18,
marginBottom:12
},

name:{color:"#7cf7d8",fontWeight:"900",marginBottom:6},

desc:{color:"white"}

})