import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";

const BG = require("../../assets/sanri_glass_bg.jpg");

type Lang = "tr" | "en";

type ApiFeed = {
  id?: number | string
  created_at?: string
  kind?: string
  title?: string
  subtitle?: string
  body_tr?: string
  body_en?: string
  source_url?: string
  tags?: string
}

type Feed = {
  signal: string
  symbol: string
  message: string
  action: string
  share: string
}

export default function SystemFeedScreen() {

  const [lang, setLang] = useState<Lang>("tr")
  const [feed, setFeed] = useState<Feed | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadFeed = useCallback(async () => {

    setLoading(true)
    setError("")

    try {

      const url = `https://api.asksanri.com/content/system-feed?lang=${lang}`

      const res = await fetch(url)

      if (!res.ok) {
        throw new Error("HTTP " + res.status)
      }

      const data: ApiFeed = await res.json()

      const body =
        lang === "tr"
          ? data.body_tr || data.body_en || ""
          : data.body_en || data.body_tr || ""

      const tags =
        (data.tags || "")
          .split(",")
          .map(x => x.trim())
          .filter(Boolean)

      setFeed({
        signal: data.title || "",
        symbol: data.subtitle || "",
        message: body || "",
        action: tags[0] || "",
        share: tags.slice(1).join(" • ") || "",
      })

    } catch (e: any) {

      setError(String(e))
      setFeed(null)

    } finally {

      setLoading(false)

    }

  }, [lang])

  useEffect(() => {
    loadFeed()
  }, [loadFeed])


  return (

    <View style={styles.root}>

      <StatusBar barStyle="light-content"/>

      <ImageBackground
        source={BG}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.14}/>
      </View>

      <View style={styles.overlay}/>

      {/* TOP BAR */}

      <View style={styles.topbar}>

        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={{flex:1}}/>

        <View style={styles.langRow}>

          <Pressable
            onPress={() => setLang("tr")}
            style={[styles.langChip, lang==="tr" && styles.langActive]}
          >
            <Text style={styles.langText}>TR</Text>
          </Pressable>

          <Pressable
            onPress={() => setLang("en")}
            style={[styles.langChip, lang==="en" && styles.langActive]}
          >
            <Text style={styles.langText}>EN</Text>
          </Pressable>

        </View>

      </View>


      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.kicker}>SYSTEM TERMINAL</Text>
        <Text style={styles.title}>SYSTEM FEED</Text>

        {loading && (
          <View style={styles.card}>
            <ActivityIndicator/>
            <Text style={styles.text}>Loading system feed...</Text>
          </View>
        )}

        {error !== "" && (
          <View style={styles.card}>
            <Text style={styles.error}>Error</Text>
            <Text style={styles.text}>{error}</Text>
          </View>
        )}

        {feed && (
          <>
            <Card title="SIGNAL" text={feed.signal}/>
            <Card title="SYMBOL" text={feed.symbol}/>
            <Card title="MESSAGE" text={feed.message}/>
            <Card title="ACTION" text={feed.action}/>
            <Card title="SHARE" text={feed.share}/>
          </>
        )}

        <Pressable
          onPress={loadFeed}
          style={styles.refreshBtn}
        >
          <Text style={styles.refreshText}>Refresh Feed</Text>
        </Pressable>

        <View style={{height:120}}/>

      </ScrollView>

    </View>
  )
}



function Card({title, text}:{title:string,text:string}) {

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
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
    paddingHorizontal:14,
    paddingTop:10,
    paddingBottom:8
  },

  backBtn:{
    flexDirection:"row",
    alignItems:"center",
    gap:6
  },

  backArrow:{
    color:"#7cf7d8",
    fontSize:20
  },

  backText:{
    color:"#7cf7d8",
    fontWeight:"700"
  },

  langRow:{
    flexDirection:"row",
    gap:8
  },

  langChip:{
    paddingHorizontal:10,
    paddingVertical:6,
    borderRadius:10,
    backgroundColor:"rgba(255,255,255,0.1)"
  },

  langActive:{
    backgroundColor:"rgba(124,247,216,0.2)"
  },

  langText:{
    color:"#7cf7d8",
    fontWeight:"700"
  },

  container:{
    padding:20
  },

  kicker:{
    color:"rgba(255,255,255,0.6)",
    letterSpacing:2,
    marginBottom:8
  },

  title:{
    color:"white",
    fontSize:34,
    fontWeight:"900",
    marginBottom:20
  },

  card:{
    backgroundColor:"rgba(255,255,255,0.06)",
    padding:18,
    borderRadius:20,
    marginBottom:14,
    borderWidth:1,
    borderColor:"rgba(255,255,255,0.1)"
  },

  cardTitle:{
    color:"#7cf7d8",
    fontWeight:"900",
    marginBottom:8,
    fontSize:18
  },

  text:{
    color:"white",
    lineHeight:22
  },

  error:{
    color:"#ff5c7a",
    fontWeight:"900",
    marginBottom:6
  },

  refreshBtn:{
    marginTop:8,
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
