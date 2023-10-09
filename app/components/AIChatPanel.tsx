import React, { useEffect, useRef, useState } from "react"
import {
    ActivityIndicator,
    Animated,
    Easing,
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native"
import { getRH, getRW, units } from "../theme/units"
import { getCompletion } from "../services/api/api"
import fonts from "../theme/fonts"

const AIChatPanel = ({ apiKey }) => {

    const [text, setText] = useState("")
    const [conversation, setConversation] = useState([])
    const [loading, setLoading] = useState(false)
    // after pressing the chat panel button, the icon is removed so that it does not appear on the panel.
    const [showChatPaneImage, setShowChatPaneImage] = useState(true)
    // to show the first message of artificial intelligence when the chat panel is opened for the first time
    const [chatOpenedFirstTime, setChatOpenedFirstTime] = useState(false)

    const flatListRef = useRef<any>()
    const inputRef = useRef<any>()

    // for artificial intelligence to send the first message
    useEffect(() => {
        if (chatOpenedFirstTime) {
            //loading is activated after 500 ms after pressing the panel open button. In this way, it looks as if artificial intelligence is writing
            setTimeout(() => {
                setLoading(true)
            }, 500);

            // the first message of artificial intelligence is displayed after 1000 ms after pressing the panel opening button
            setTimeout(() => {
                setConversation(["Hello!\nI am the artificial intelligence assistant developed by Diet Doctor. How can I help you?"])
                setLoading(false)
            }, 1000);
        }
    }, [chatOpenedFirstTime])

    const chatPanelHight = useRef(new Animated.Value(getRH(80))).current;
    const chatPanelWidth = useRef(new Animated.Value(getRH(80))).current;
    const chatPanelBottom = useRef(new Animated.Value(getRH(30))).current
    const chatPanelRight = useRef(new Animated.Value(getRW(20))).current
    const chatPanelOpacity = useRef(new Animated.Value(0)).current
    const chatPanelTopRadius = useRef(new Animated.Value(200)).current
    const chatPanelBottomRadius = useRef(new Animated.Value(200)).current

    const onPressChatPanel = () => {
        setShowChatPaneImage(false)
        setChatOpenedFirstTime(true)

        Animated.parallel([
            Animated.timing(chatPanelHight, {
                toValue: getRH(370),
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(chatPanelWidth, {
                toValue: units.width,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(chatPanelBottom, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(chatPanelRight, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(chatPanelTopRadius, {
                toValue: 20,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(chatPanelBottomRadius, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(chatPanelOpacity, {
                toValue: 1,
                duration: 500,
                easing: Easing.cubic,
                useNativeDriver: true,
            })
        ]).start();
    }

    const onCloseChatPanel = () => {
        Keyboard.dismiss()

        Animated.parallel([
            Animated.timing(chatPanelHight, {
                toValue: getRH(80),
                duration: 400,
                useNativeDriver: false,
            }),
            Animated.timing(chatPanelWidth, {
                toValue: getRH(80),
                duration: 400,
                useNativeDriver: false,
            }),
            Animated.timing(chatPanelBottom, {
                toValue: getRH(30),
                duration: 400,
                useNativeDriver: false
            }),
            Animated.timing(chatPanelRight, {
                toValue: getRW(20),
                duration: 400,
                useNativeDriver: false
            }),
            Animated.timing(chatPanelTopRadius, {
                toValue: 200,
                duration: 400,
                useNativeDriver: false
            }),
            Animated.timing(chatPanelBottomRadius, {
                toValue: 200,
                duration: 400,
                useNativeDriver: false
            }),
            Animated.timing(chatPanelOpacity, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            })
        ]).start(() => {
            setShowChatPaneImage(true)
        })
    }

    const onPressSend = async () => {
        if (text) {
            setLoading(true)
            setConversation(prev => [...prev, text])
            setText("")

            // past messages are also sent throughout the chat, ensuring consistent responses.
            let message = []
            const length = conversation.length
            for (let i = 0; i < length; i++) {
                if (i % 2 == 0) {
                    message.push({ "role": "assistant", "content": conversation[i] })
                } else {
                    message.push({ "role": "user", "content": conversation[i] })
                }
            }
            message.push({ "role": "user", "content": text })

            if (message.length == 2) {
                message.unshift({ "role": "system", "content": "Act like a doctor who doesn't answer any questions except diet, nutrition and health" })
            }
            const response = await getCompletion(apiKey, message)

            setConversation(prev => [...prev, response])
            setLoading(false)
        }
    }

    const renderChat = ({ item, index }) => {
        return (
            index % 2 == 1 ?
                // kullanıcı mesajı
                <View key={index} style={styles.userMessageContainer}>
                    <View style={styles.userTextWrapper}>
                        <Text style={{ ...styles.text, color: "#294430" }}>
                            {item}
                        </Text>
                    </View>
                    <Image
                        style={styles.userImage}
                        source={require("../assets/image/user.png")}
                    />
                </View>
                :
                // yapay zeka mesajı
                <View style={styles.aiMessageContainer} key={index}>
                    <View style={styles.aiImage}>
                        <Image
                            style={{ height: "65%", width: "65%" }}
                            source={require("../assets/image/ai-icon.png")}

                        />
                    </View>
                    <View style={styles.aiTextWrapper}>
                        <Text style={{ ...styles.text, color: "#F8FFF8" }}>
                            {item}
                        </Text>
                    </View>
                </View>
        )
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
            <Animated.View style={{
                ...styles.chatPanelContainer,
                height: chatPanelHight,
                width: chatPanelWidth,
                bottom: chatPanelBottom,
                right: chatPanelRight,
                borderTopLeftRadius: chatPanelTopRadius,
                borderTopRightRadius: chatPanelTopRadius,
                borderBottomLeftRadius: chatPanelBottomRadius,
                borderBottomRightRadius: chatPanelBottomRadius,
            }}
            >
                {
                    showChatPaneImage ?
                        <TouchableOpacity style={styles.openChatPanelButton} onPressIn={onPressChatPanel}>
                            <Image style={styles.openChatPanelButtonImage} source={require("../assets/image/ai-icon.png")} />
                        </TouchableOpacity>
                        :
                        null
                }
                <Animated.View style={{ opacity: chatPanelOpacity }}>
                    <View style={styles.headerWrapper}>
                        <Text style={styles.headerText}>AI Assistant</Text>
                        <TouchableOpacity
                            onPress={onCloseChatPanel}
                            style={styles.closeButton}
                        >
                            <Image
                                style={{ height: "40%", width: "40%" }}
                                source={require("../assets/image/close.png")}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.chatWrapper}>
                        <FlatList
                            data={conversation}
                            renderItem={renderChat}
                            ref={flatListRef}
                            showsVerticalScrollIndicator={false}
                            onContentSizeChange={() => {
                                if (conversation && conversation.length > 0) {
                                    flatListRef.current.scrollToEnd()
                                }
                            }}
                            ListFooterComponent={() => {
                                return (
                                    loading ?
                                        <ActivityIndicator size="large" color="#294430" />
                                        :
                                        null
                                )
                            }}
                        />
                    </View>
                    <View style={styles.bottomWrapper}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                value={text}
                                onChangeText={setText}
                                placeholder={"Write here"}
                                placeholderTextColor={"#AAAAAA"}
                                ref={inputRef}
                                style={styles.input}
                                multiline
                                numberOfLines={2}
                            />
                            <TouchableOpacity
                                onPress={onPressSend}
                                disabled={loading}
                                style={styles.sendButton}
                            >
                                <Image
                                    source={require("../assets/image/send.png")}
                                    style={styles.sendButtonImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </Animated.View>
        </KeyboardAvoidingView>
    )
}

export default AIChatPanel

const styles = StyleSheet.create({

    chatPanelContainer: {
        position: "absolute",
        backgroundColor: "#F3F2EF",
        borderColor: "#25A762",
        alignItems: "center",
        borderWidth: 2
    },
    openChatPanelButton: {
        position: "absolute",
        height: getRH(75),
        width: getRH(75),
        backgroundColor: "#F3F2EF",
        borderRadius: 99,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    openChatPanelButtonImage: {
        height: getRH(50),
        width: getRH(50),
    },
    headerWrapper: {
        height: getRH(53),
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        fontSize: fonts.size(25),
        color: "#38393A"
    },
    closeButton: {
        position: "absolute",
        height: getRH(40),
        width: getRH(40),
        right: getRH(10),
        top: getRH(10),
        borderRadius: 99,
        backgroundColor: "#CAE3D5",
        justifyContent: "center",
        alignItems: "center",
    },
    chatWrapper: {
        height: getRH(228),
        width: getRW(335),
        marginTop: getRH(5),
        alignSelf: "center",
    },
    userMessageContainer: {
        flexDirection: "row",
        marginBottom: getRH(15),
        alignSelf: "flex-end",
    },
    userTextWrapper: {
        maxWidth: getRW(250),
        minWidth: getRW(60),
        borderRadius: 10,
        borderTopRightRadius: 0,
        backgroundColor: "#E2EBE6",
        padding: getRH(4),
    },
    userImage: {
        width: getRW(38),
        height: getRW(38),
        borderRadius: 99,
        borderWidth: 1,
        borderColor: "grey",
        marginLeft: getRW(8)
    },
    aiMessageContainer: {
        flexDirection: "row",
        marginBottom: getRH(15),
    },
    aiTextWrapper: {
        maxWidth: getRW(250),
        minWidth: getRW(60),
        borderRadius: 10,
        borderTopLeftRadius: 0,
        backgroundColor: "#426550",
        padding: getRH(4),
    },
    aiImage: {
        width: getRW(38),
        height: getRW(38),
        borderRadius: 99,
        borderWidth: 1,
        borderColor: "grey",
        marginRight: getRW(8),
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontSize: fonts.size(17),
        padding: getRH(5)
    },
    bottomWrapper: {
        paddingVertical: getRH(16),
        backgroundColor: "#E2EBE6",
        width: getRW(356),
        alignItems: "center"
    },
    inputWrapper: {
        height: getRH(50),
        width: getRW(350),
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#CCD0CD",
        justifyContent: "space-between"
    },
    input: {
        height: getRH(48),
        width: getRW(290),
        fontSize: fonts.size(17),
        color: "#000",
        alignSelf: "center",
        paddingHorizontal: getRW(15),
        paddingTop: getRH(15),
    },
    sendButton: {
        width: getRH(40),
        height: getRH(40),
        borderRadius: 99,
        marginHorizontal: getRW(10),
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#5D9671",
        paddingLeft: getRH(3),
    },
    sendButtonImage: {
        width: "65%",
        height: "60%",
    },

})