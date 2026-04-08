import { Tabs } from 'expo-router';
import { HandbagIcon, ListIcon, ShoppingCartIcon } from 'phosphor-react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CarrinhoProvider } from '../carrinhoContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <CarrinhoProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="produtoCadastro"
          options={{
            title: 'Cadastro de Produtos',
            tabBarIcon: ({ color }) => <HandbagIcon size={28} name="" color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Lista Produtos',
            tabBarIcon: ({ color }) => <ListIcon size={28} name="list.bullet" color={color} />,
          }}
        />
        <Tabs.Screen
          name="carrinhoListagem"
          options={{
            title: 'Carrinho',
            tabBarIcon: ({ color }) => <ShoppingCartIcon size={28} name="list.bullet" color={color} />,
          }}
        />
      </Tabs>
    </CarrinhoProvider>
  );
}
