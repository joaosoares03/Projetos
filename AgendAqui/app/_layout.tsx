import { Stack } from "expo-router";
import { TemaProvider } from "../contexts/ThemeContext";

export default function RootLayout() {
  return (
    <TemaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </TemaProvider>
  );
}