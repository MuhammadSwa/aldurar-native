import { useState } from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity } from 'react-native';
import IconButton from './IconButton';
import Card from './Card';
import { Body } from './Typography';
import { useColorScheme } from 'nativewind';
import { useRouter } from 'expo-router';
import { IconFeather } from './Icons';

type MenuItem = {
  key: string;
  label: string;
  route?: string;
  onPress?: () => void;
};

export default function HeaderMenu({ items }: { items: MenuItem[] }) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const onItemPress = (item: MenuItem) => {
    close();
    if (item.onPress) return item.onPress();
    if (item.route) return router.push(item.route as any);
  };

  return (
    <>
      <IconButton onPress={open} className="p-0">
        <IconFeather name="more-vertical" size={20} className="text-foreground dark:text-foreground-dark" />
      </IconButton>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable
          className="flex-1 bg-black/30"
          onPress={close}
        >
          <Card className="absolute right-2 top-12 min-w-[160px] p-2">
            {items.map(item => (
              <TouchableOpacity key={item.key} onPress={() => onItemPress(item)} className="px-3 py-2">
                <Body className="text-right">{item.label}</Body>
              </TouchableOpacity>
            ))}
          </Card>
        </Pressable>
      </Modal>
    </>
  );
}
