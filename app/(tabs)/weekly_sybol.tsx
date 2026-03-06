import { View, Text, ScrollView, StyleSheet } from "react-native"
import { useLocalSearchParams } from "expo-router"

export default function WeeklySymbolScreen(){

const { title, subtitle, body } = useLocalSearchParams()

return(

<ScrollView style={styles.container}>

<Text style={styles.title}>{title}</Text>

<Text style={styles.subtitle}>{subtitle}</Text>

<Text style={styles.body}>{body}</Text>

</ScrollView>

)

}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#07080d",
padding:20
},

title:{
color:"#7cf7d8",
fontSize:28,
fontWeight:"800",
marginBottom:10
},

subtitle:{
color:"white",
fontSize:18,
marginBottom:20
},

body:{
color:"white",
lineHeight:24,
fontSize:16
}

})