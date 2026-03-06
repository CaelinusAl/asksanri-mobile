import React, {useEffect, useState} from "react"
import {View,Text,TextInput,Pressable,StyleSheet} from "react-native"
import {API, apiGetJson, apiPostJson} from "@/lib/apiClient"

export default function Profile(){

const [profile,setProfile] = useState<any>({})

useEffect(()=>{
 load()
},[])

async function load(){
 const data = await apiGetJson(API.base + "/profile")
 setProfile(data)
}

async function save(){

 await apiPostJson(API.base + "/profile/update",profile)

 alert("Kaydedildi")
}

return(

<View style={styles.root}>

<Text style={styles.title}>Profil</Text>

<TextInput
placeholder="İsim"
value={profile.name}
onChangeText={v=>setProfile({...profile,name:v})}
/>

<TextInput
placeholder="Email"
value={profile.email}
onChangeText={v=>setProfile({...profile,email:v})}
/>

<TextInput
placeholder="Bio"
value={profile.bio}
onChangeText={v=>setProfile({...profile,bio:v})}
/>

<TextInput
placeholder="Niyet"
value={profile.intention}
onChangeText={v=>setProfile({...profile,intention:v})}
/>

<Pressable onPress={save}>
<Text>Kaydet</Text>
</Pressable>

</View>
)

}

const styles = StyleSheet.create({
root:{flex:1,padding:20},
title:{fontSize:32,fontWeight:"bold"}
})