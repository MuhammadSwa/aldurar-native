import { View, Text } from 'react-native'
export default function HomeScreen() {
  return (
    <View className='flex-1 items-center justify-center'>
      <View>
        <Text className="text-primary">Access as a theme value</Text>
        <Text className="text-[--color-rgb]">Or the variable directly</Text>

        {/* Variables can be changed inline */}
        <View>
          <Text className="text-primary">I am now green!</Text>
          <Text className="text-[--color-rgb]">I am now blue!</Text>
        </View>
      </View>
    </View>
  )
}
