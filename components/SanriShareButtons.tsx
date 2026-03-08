import React from "react";
import { View, TouchableOpacity, Text, Linking, Share, StyleSheet } from "react-native";

export default function SanriShareButtons({ answer }: { answer: string }) {

const text =
`Sanrı bana bunu söyledi:

"${answer}"

Sanrıya sor
https://asksanri.com`;

const shareGeneral = async () => {
await Share.share({ message: text });
};

const shareWhatsApp = () => {
Linking.openURL(`whatsapp://send?text=${encodeURIComponent(text)}`)
.catch(() => shareGeneral());
};

const shareTwitter = () => {
Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`)
.catch(() => shareGeneral());
};

const shareFacebook = () => {
Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=https://asksanri.com&quote=${encodeURIComponent(text)}`)
.catch(() => shareGeneral());
};

const shareInstagram = () => {
shareGeneral();
};

const shareTikTok = () => {
shareGeneral();
};

return (

<View style={styles.container}>

<TouchableOpacity onPress={shareInstagram} style={styles.btn}>
<Text style={styles.txt}>📸 Instagram</Text>
</TouchableOpacity>

<TouchableOpacity onPress={shareTikTok} style={styles.btn}>
<Text style={styles.txt}>🎵 TikTok</Text>
</TouchableOpacity>

<TouchableOpacity onPress={shareTwitter} style={styles.btn}>
<Text style={styles.txt}>𝕏</Text>
</TouchableOpacity>

<TouchableOpacity onPress={shareFacebook} style={styles.btn}>
<Text style={styles.txt}>📘 Facebook</Text>
</TouchableOpacity>

<TouchableOpacity onPress={shareWhatsApp} style={styles.btn}>
<Text style={styles.txt}>💬 WhatsApp</Text>
</TouchableOpacity>

</View>
);
}

const styles = StyleSheet.create({
container:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"center",
marginTop:20
},

btn:{
backgroundColor:"#0f172a",
paddingVertical:10,
paddingHorizontal:14,
borderRadius:10,
margin:5
},

txt:{
color:"#fff",
fontSize:14
}
});