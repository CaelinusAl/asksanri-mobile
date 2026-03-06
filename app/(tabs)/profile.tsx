import React, {useState} from "react"
import {View,Text,TextInput,Pressable,StyleSheet} from "react-native"
import {apiPostJson,API} from "@/lib/apiClient"

export default function ProfileScreen(){

const [name,setName]=useState("")
const [bio,setBio]=useState("")
const [intention,setIntention]=useState("")

const save=async()=>{
 await apiPostJson(API.base+"/profile/update",{
   name,
   bio,
   intention,
   language:"tr"
 })
}

return(
<View style={styles.root}>

<Text style={styles.title}>Profil</Text>

<TextInput
placeholder="Adın"
value={name}
onChangeText={setName}
style={styles.input}
/>

<TextInput
placeholder="Kendini tanıt"
value={bio}
onChangeText={setBio}
style={styles.input}
/>

<TextInput
placeholder="Niyetin"
value={intention}
onChangeText={setIntention}
style={styles.input}
/>

<Pressable style={styles.btn} onPress={save}>
<Text>Kaydet</Text>
</Pressable>

</View>
)
}

const styles=StyleSheet.create({
root:{flex:1,padding:20},
title:{fontSize:28,fontWeight:"bold"},
input:{borderWidth:1,padding:10,marginTop:10},
btn:{marginTop:20,padding:15,backgroundColor:"#7cf7d8"}
})