import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FocusScreen } from '../../focus/screens/focus.screen';
import { MeditateScreen } from '../../meditate/screens/meditate.screen';
import { SleepScreen } from '../../sleep/screens/sleep.screen';
import { AccountScreen } from '../../account/screens/account.screen';
import { AccountNavigator } from '../../../infrastructure/navigation/account.navigator';
import { AccountInfoNavigator } from '../../../infrastructure/navigation/account-info.navigator';
const Tab = createBottomTabNavigator();


export const MyTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Focus" component={FocusScreen} />
      <Tab.Screen name="Meditate" component={MeditateScreen} />
      <Tab.Screen name="Sleep" component={SleepScreen} />
      <Tab.Screen name="Account" component={AccountInfoNavigator} />
    </Tab.Navigator>
  );
};
  