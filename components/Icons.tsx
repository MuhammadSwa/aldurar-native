import { cssInterop } from 'nativewind';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

export const IconFeather = cssInterop(Feather, { className: 'style' });
export const IconMaterial = cssInterop(MaterialIcons, { className: 'style' });
export const IconIon = cssInterop(Ionicons, { className: 'style' });

export default {
  Feather: IconFeather,
  Material: IconMaterial,
  Ion: IconIon,
};
