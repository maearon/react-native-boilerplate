import { useAuthStore } from "@/stores/authStore"
import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { useEffect } from "react"

// Screens
import AboutScreen from "@/app/(tabs)/About"
import AccountActivationsScreen from "@/app/(tabs)/AccountActivations"
import AccountActivationsNewScreen from "@/app/(tabs)/AccountActivationsNew"
import ContactScreen from "@/app/(tabs)/Contact"
import HomeScreen from "@/app/(tabs)/index"
import LoginScreen from "@/app/(tabs)/Login"
import NotFoundScreen from "@/app/(tabs)/NotFound"
import PasswordResetsScreen from "@/app/(tabs)/PasswordResets"
import PasswordResetsNewScreen from "@/app/(tabs)/PasswordResetsNew"
import ShowFollowScreen from "@/app/(tabs)/ShowFollow"
import SignupScreen from "@/app/(tabs)/Signup"
import UserProfileScreen from "@/app/(tabs)/UserProfile"
import UsersScreen from "@/app/(tabs)/users"
import UserEditScreen from "@/app/(tabs)/UserSettings"

// Stack navigators
const MainStack = createStackNavigator()
const AuthStack = createStackNavigator()
const UserStack = createStackNavigator()
const Tab = createBottomTabNavigator()

// Auth navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: true }}>
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: "Log in" }} />
    <AuthStack.Screen name="Signup" component={SignupScreen} options={{ title: "Sign up" }} />
    <AuthStack.Screen
      name="PasswordResetsNew"
      component={PasswordResetsNewScreen}
      options={{ title: "Forgot password" }}
    />
    <AuthStack.Screen name="PasswordResets" component={PasswordResetsScreen} options={{ title: "Reset password" }} />
    <AuthStack.Screen
      name="AccountActivationsNew"
      component={AccountActivationsNewScreen}
      options={{ title: "Resend activation" }}
    />
    <AuthStack.Screen
      name="AccountActivations"
      component={AccountActivationsScreen}
      options={{ title: "Account activation" }}
    />
  </AuthStack.Navigator>
)

// User stack navigator
const UserStackNavigator = () => (
  <UserStack.Navigator screenOptions={{ headerShown: true }}>
    <UserStack.Screen name="Users" component={UsersScreen} options={{ title: "All users" }} />
    <UserStack.Screen
      name="UserProfile"
      component={UserProfileScreen}
      options={({ route }: any) => ({ title: route.params?.name || "User Profile" })}
    />
    <UserStack.Screen name="UserEdit" component={UserEditScreen} options={{ title: "Edit profile" }} />
    <UserStack.Screen
      name="ShowFollow"
      component={ShowFollowScreen}
      options={({ route }: any) => ({
        title: route.params?.type === "following" ? "Following" : "Followers",
      })}
    />
  </UserStack.Navigator>
)

// Tab navigator for authenticated users
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline"
        } else if (route.name === "UserStack") {
          iconName = focused ? "people" : "people-outline"
        } else if (route.name === "About") {
          iconName = focused ? "information-circle" : "information-circle-outline"
        } else if (route.name === "Contact") {
          iconName = focused ? "mail" : "mail-outline"
        }

        return <Ionicons name={iconName as any} size={size} color={color} />
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="UserStack" component={UserStackNavigator} options={{ headerShown: false, title: "Users" }} />
    <Tab.Screen name="About" component={AboutScreen} />
    <Tab.Screen name="Contact" component={ContactScreen} />
  </Tab.Navigator>
)

// Main navigator
export const AppNavigator = () => {
  const { loggedIn, initialized, checkAuthStatus } = useAuthStore()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  if (!initialized) {
    // You could show a loading screen here
    return null
  }

  return (
    <NavigationContainer>
      <MainStack.Navigator screenOptions={{ headerShown: false }}>
        {loggedIn ? (
          <MainStack.Screen name="Main" component={TabNavigator} />
        ) : (
          <MainStack.Screen name="Auth" component={AuthNavigator} />
        )}
        <MainStack.Screen name="NotFound" component={NotFoundScreen} options={{ title: "Not Found" }} />
      </MainStack.Navigator>
    </NavigationContainer>
  )
}
