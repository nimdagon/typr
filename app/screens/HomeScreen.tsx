import React from "react"
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, } from "react-native"
import fonts from "../theme/fonts"
import AIChatPanel from "../components/AIChatPanel"

const HomeScreen = () => {

   const apiKey = "s**k-jRT9aFJqciz019fluST1T3BlbkFJ7AHPosLfAit5yqb3YNEi"


   return (
      <SafeAreaView style={{ flex: 1 }}>
         <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : undefined} style={{ flex: 1 }}>
            <Text style={styles.mockText} >Home Screen</Text>
            {/* artificial intelligence assistant */}
            <AIChatPanel apiKey={apiKey} />
         </KeyboardAvoidingView>
      </SafeAreaView>
   )
}

export default HomeScreen

const styles = StyleSheet.create({
   mockText: {
      fontSize: fonts.size(50),
      textAlign: "center",
   },
})