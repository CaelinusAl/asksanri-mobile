import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import MatrixRain from "../../lib/MatrixRain";
import { API, apiGetJson } from "@/lib/apiClient";

const BG = require("../../assets/sanri_glass_bg.jpg");

type Insight = {
  theme: string
  focus: string
  symbol: string
  ritual_direction: string
  next_area: string
}

export default function MyAreaScreen() {

  const [loading,setLoading]=useState(true)
  const [name,setName]=useState("")
  const [insight,setInsight]=useState<Insight | null>(null)

  useEffect(()=>{
    load()
  },[])

  async function load(){

    try{

      const me:any = await apiGetJson(`${API.base}/me`,20000)

      if(me?.name){
        setName(me.name)
      }

      const ins:any = await apiGetJson(`${API.base}/insight`,20000)

      if(ins){
        setInsight(ins)
      }

    }catch(e){
      console.log("my_area load error",e)
    }

    setLoading(false)

  }

  return (

    <View style={styles.root}>

      <StatusBar barStyle="light-content"/>

      <ImageBackground
        source={BG}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.08}/>
      </View>

      <View pointerEvents="none" style={styles.overlay}/>

      {/* TOP BAR */}

      <View style={styles.topbar}>

        <Pressable
          style={styles.backBtn}
          onPress={()=>router.back()}
        >
          <Text style={styles.backTxt}>←</Text>
        </Pressable>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        <Text style={styles.kicker}>
          MY AREA
        </Text>

        <Text style={styles.title}>
          Benim Alanım
        </Text>

        <Text style={styles.subtitle}>
          Sanrı burada seni hatırlamaya başlar
        </Text>

        {/* USER CARD */}

        <BlurView intensity={30} tint="dark" style={styles.userCard}>

          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>
              {name ? name.charAt(0).toUpperCase() : "S"}
            </Text>
          </View>

          <View style={{flex:1}}>
            <Text style={styles.userName}>
              {name || "Sanrı Kullanıcısı"}
            </Text>

            <Text style={styles.userSub}>
              kişisel bilinç alanı
            </Text>
          </View>

        </BlurView>

        {/* INSIGHT */}

        <BlurView intensity={28} tint="dark" style={styles.insightCard}>

          <Text style={styles.sectionTitle}>
            Sanrı Insight
          </Text>

          {loading && (
            <ActivityIndicator/>
          )}

          {!loading && insight && (

            <>
              <Text style={styles.insightText}>
                Tema: {insight.theme}
              </Text>

              <Text style={styles.insightText}>
                Odak: {insight.focus}
              </Text>

              <Text style={styles.insightText}>
                Sembol: {insight.symbol}
              </Text>

              <Text style={styles.insightText}>
                Ritüel: {insight.ritual_direction}
              </Text>

              <Text style={styles.insightText}>
                Sonraki Alan: {insight.next_area}
              </Text>
            </>
          )}

        </BlurView>

        {/* CARDS */}

        <Card
          title="Profil"
          subtitle="kimlik bilgilerin"
          onPress={()=>router.push("/(tabs)/profile")}
        />

        <Card
          title="Hafızam"
          subtitle="kaydedilen temalar"
          onPress={()=>router.push("/(tabs)/memory")}
        />

        <Card
          title="Ritüel Geçmişim"
          subtitle="Sanrı'nın önerileri"
          onPress={()=>router.push("/(tabs)/ritual_history")}
        />

        <Card
          title="Okumalarım"
          subtitle="system feed ve analizler"
          onPress={()=>router.push("/(tabs)/readings")}
        />

        <View style={{height:120}}/>

      </ScrollView>

    </View>
  )
}

function Card({title,subtitle,onPress}:any){

  return(

    <Pressable onPress={onPress} style={styles.card}>

      <BlurView intensity={25} tint="dark" style={styles.cardInner}>

        <View style={{flex:1}}>

          <Text style={styles.cardTitle}>
            {title}
          </Text>

          <Text style={styles.cardSub}>
            {subtitle}
          </Text>

        </View>

        <Text style={styles.arrow}>
          ›
        </Text>

      </BlurView>

    </Pressable>

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
    paddingTop:55,
    paddingHorizontal:16,
    flexDirection:"row"
  },

  backBtn:{
    width:44,
    height:44,
    borderRadius:14,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"rgba(255,255,255,0.06)"
  },

  backTxt:{
    color:"#7cf7d8",
    fontSize:18,
    fontWeight:"900"
  },

  container:{
    padding:18
  },

  kicker:{
    color:"rgba(255,255,255,0.5)",
    letterSpacing:2,
    fontWeight:"800"
  },

  title:{
    color:"white",
    fontSize:40,
    fontWeight:"900"
  },

  subtitle:{
    color:"rgba(255,255,255,0.7)",
    marginTop:6,
    marginBottom:18
  },

  userCard:{
    borderRadius:24,
    padding:16,
    flexDirection:"row",
    alignItems:"center",
    marginBottom:16
  },

  avatar:{
    width:52,
    height:52,
    borderRadius:999,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"rgba(94,59,255,0.35)",
    marginRight:12
  },

  avatarTxt:{
    color:"white",
    fontSize:20,
    fontWeight:"900"
  },

  userName:{
    color:"white",
    fontSize:18,
    fontWeight:"900"
  },

  userSub:{
    color:"rgba(255,255,255,0.6)",
    fontSize:12
  },

  insightCard:{
    borderRadius:24,
    padding:16,
    marginBottom:16
  },

  sectionTitle:{
    color:"#7cf7d8",
    fontWeight:"900",
    marginBottom:8
  },

  insightText:{
    color:"white",
    marginBottom:4
  },

  card:{
    borderRadius:22,
    overflow:"hidden",
    marginTop:12
  },

  cardInner:{
    padding:18,
    flexDirection:"row",
    alignItems:"center"
  },

  cardTitle:{
    color:"white",
    fontSize:20,
    fontWeight:"900"
  },

  cardSub:{
    color:"rgba(255,255,255,0.6)",
    marginTop:4
  },

  arrow:{
    color:"white",
    fontSize:26
  }

})