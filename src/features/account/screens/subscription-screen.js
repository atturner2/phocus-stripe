import { Text, Button } from 'react-native';


export const SubscriptionScreen = ({navigation}) => {

    return (
        <>
            <Text>This is the subscriptionscreen </Text>
            <Button title="Go back" onPress={() => navigation.goBack()} />

        </>
    )
};
