import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-web";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "903386984344-8u1q6bq3m76jmgqdf6uoclono4idhuft.apps.googleusercontent.com",
    iosClientId:
      "903386984344-5cknp3t0d096733lvd74gm3csldhhrfk.apps.googleusercontent.com",
    webClientId:
      "903386984344-6p5qeuegiaio1sogkmt8he1uetf874vl.apps.googleusercontent.com",
  });

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  async function handleSignInWithGoogle() {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        await getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return; // return null
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(userInfo, null, 2)}</Text>
      <Text>Code with Basile!</Text>
      {/* <Button title="Sign in with Google" onPress={() => promptAsync()} />
      <Button
        title="Delete local storage"
        onPress={() => AsyncStorage.removeItem("@user")}
      /> */}

      <TouchableOpacity onPress={() => promptAsync()} style={styles.buttontext}>
        <Text style={{ color: "#fff" }}>Sign in with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => AsyncStorage.removeItem("@user")}
        style={styles.buttontext}
      >
        <Text style={{ color: "#fff" }}>Delete local storage</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttontext: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#4285F4",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
});
