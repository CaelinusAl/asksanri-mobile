import React from "react";
import {
View,
Text,
Pressable,
StyleSheet,
ScrollView,
ImageBackground,
StatusBar,
Platform
} from "react-native";
import { router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);

const BG = require("../../assets/sanri_glass_bg.jpg");

export default function ReadingsScreen() {

return (
<View style={styles.root}>
<StatusBar barStyle="light-content" />

<ImageBackground
source={BG}
style={StyleSheet.absoluteFillObject}
resizeMode="cover"
/>

<View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
<MatrixRain opacity={0.12} />
</View>

<View pointerEvents="none" style={styles.overlay} />

<View style={styles.topbar}>
<Pressable onPress={() => router.back()}>
<Text style={styles.back}>←</Text>
</Pressable>
<Text style={styles.title}>Okumalarım</Text>
</View>

<ScrollView contentContainerStyle={styles.container}>

<View style={styles.card}>
<Text style={styles.cardTitle}>System Feed</Text>
<Text style={styles.cardText}>
Sanrı'nın günlük bilinç akışları burada görünecek.
</Text>
</View>

<View style={styles.card}>
<Text style={styles.cardTitle}>Dünya Olayları</Text>
<Text style={styles.cardText}>
Yorumlanan dünya olayları burada kaydedilecek.
</Text>
</View>

<View style={styles.card}>
<Text style={styles.cardTitle}>Üst Bilinç</Text>
<Text style={styles.cardText}>
Sembol ve bilinç okumaları burada saklanacak.
</Text>
</View>

</ScrollView>
</View>
);
}

const styles = StyleSheet.create({

root:{
flex:1,
backgroundColor:"#07080d"
},

overlay:{
...StyleSheet.absoluteFillObject,
backgroundColor:"rgba(0,0,0,0.35)"
},

topbar:{
flexDirection:"row",
alignItems:"center",
gap:12,
paddingTop: SAFE_TOP,
paddingHorizontal:20
},

back:{
color:"#7cf7d8",
fontSize:22,
fontWeight:"900"
},

title:{
color:"white",
fontSize:26,
fontWeight:"900"
},

container:{
padding:20,
gap:16
},

card:{
backgroundColor:"rgba(255,255,255,0.06)",
borderWidth:1,
borderColor:"rgba(255,255,255,0.1)",
borderRadius:20,
padding:18
},

cardTitle:{
color:"#7cf7d8",
fontSize:18,
fontWeight:"900"
},

cardText:{
color:"white",
marginTop:6,
opacity:0.8
}

});