import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ImageBackground,
  ActivityIndicator,
} from "react-native";

import MatrixRain from "../../lib/MatrixRain";
import { API, apiPostJson } from "@/lib/apiClient";

const BG = require("../../assets/sanri_glass_bg.jpg");

type Feed = {
  signal: string;
  symbol: string;
  message: string;
  action: string;
  share: string;
};

export default function SystemFeedScreen() {

  const [feed,setFeed] = useState<Feed | null>(null)
  const [busy,setBusy] = useState(true)
  const [error,setError] = useState("")

  const loadFeed = useCallback(async ()=>{

    setBusy(true)
    setError("")

    try{

      const instruction = `SYSTEM FEED

Create a short system consciousness feed.

Structure:

SIGNAL
SYMBOL
MESSAGE
ACTION
SHARE

Tone:
short
clear
systemic
consciousness oriented
`

      const payload = {
        message: instruction,
        session_id:"system-feed-mobile",
        domain:"system_feed",
        gate_mode:"mirror",
        persona:"user",
        lang:"tr"
      }

      const data:any = await apiPostJson(API.ask,payload,60000)

      const txt = String(data?.answer || "").trim()

      const blocks = txt.split("\n\n")

      setFeed({
        signal: blocks[0] || "",
        symbol: blocks[1] || "",
        message: blocks[2] || "",
        action: blocks[3] || "",
        share: blocks[4] || ""
      })

    }catch(e:any){

      setError(String(e))

    }finally{

      setBusy(false)

    }

  },[])

  useEffect(()=>{

    loadFeed()

  },[loadFeed])

  return(

    <View style={styles.root}>

      <ImageBackground
        source={BG}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <MatrixRain opacity={0.14}/>
      </View>

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>SYSTEM FEED</Text>

        {busy && (
          <View style={styles.center}>
            <ActivityIndicator/>
            <Text style={styles.loading}>Sanrı sistem akışı açıyor...</Text>
          </View>
        )}

        {error !== "" && (
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}

        {feed && (

          <>

            <Card title="🧠 Signal" text={feed.signal}/>
            <Card title="🔑 Symbol" text={feed.symbol}/>
            <Card title="📡 Message" text={feed.message}/>
            <Card title="⚡ Action" text={feed.action}/>
            <Card title="🌍 Share" text={feed.share}/>

          </>

        )}

        <Pressable style={styles.refresh} onPress={loadFeed}>
          <Text style={styles.refreshText}>Refresh Feed</Text>
        </Pressable>

      </ScrollView>

    </View>
  )
}

function Card({title,text}:{title:string,text:string}){

  return(

    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
    </View>

  )
}

const styles = StyleSheet.create({

root:{
flex:1,
backgroundColor:"#06070c"
},

container:{
padding:20
},

title:{
color:"white",
fontSize:34,
fontWeight:"900",
marginBottom:20
},

center:{
alignItems:"center",
marginTop:40
},

loading:{
color:"white",
marginTop:10
},

error:{
color:"#ff9aa5"
},

card:{
backgroundColor:"rgba(255,255,255,0.07)",
borderRadius:20,
padding:18,
marginBottom:14,
borderWidth:1,
borderColor:"rgba(255,255,255,0.1)"
},

cardTitle:{
color:"#7cf7d8",
fontSize:18,
fontWeight:"900",
marginBottom:8
},

cardText:{
color:"white",
lineHeight:22
},

refresh:{
marginTop:20,
padding:14,
borderRadius:16,
backgroundColor:"rgba(94,59,255,0.7)",
alignItems:"center"
},

refreshText:{
color:"white",
fontWeight:"900"
}

})