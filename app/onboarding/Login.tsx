import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View>
      <View>
        <Text>Login</Text>
      </View>
      <TextInput
        placeholder="Email "
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete="password"
      />
      <View>
        <Text>
          Don't have an account, <Link href="/onboarding/SignUp">sign up</Link>{" "}
          now
        </Text>
        <Link href="/onboarding/ForgotPassword">Forgot my passowrd</Link>
      </View>
    </View>
  );
};

export default Login;
