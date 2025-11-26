import { View } from 'react-native'
import { Title, Body } from '@/components/Typography';
export default function HomeScreen() {
  return (
    <View className='flex-1 items-center justify-center bg-background dark:bg-background-dark'>
      <View className='p-4'>
        <Title className="text-center">الصفحة الرئيسية</Title>
        <Body className="text-center">Access as a theme value</Body>
        <Body className="text-center">Or the variable directly</Body>

        {/* Variables can be changed inline */}
        <View className='mt-3'>
          <Body className="text-primary">I am now green!</Body>
          <Body className="text-[--color-rgb]">I am now blue!</Body>
        </View>
      </View>
    </View>
  )
}
