import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import azkar from '../store/azkar.js'
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import { Platform } from 'react-native'

export const askForPermission = async () => {
	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalState = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalState = status;
		}
		if (finalState !== "granted") {
			// alert("Failed to get push token for push notification!");
			return false;
		}
		//const token = (await Notifications.getExpoPushTokenAsync()).data;

		return true;
	} else {
		alert("Must use physical device for Push Notifications");
	}
	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}
	return false;
}

export const init = async () => {
	try {
		await AsyncStorage.setItem('isInit', 'initialized');
		return true;
	} catch (err) {
		alert("Must use physical device for Push Notifications");
	}
	return false
}
export const isInit = async () => {
	let x;
	try {
		x = await AsyncStorage.getItem('isInit');
	} catch (err) { }

	if (x) return true;
	return false;
}
// export const init = async ()=>{

//         if(askForPermission){
//         	let x;

// 	     try{
//             await AsyncStorage.setItem('tokenNotify', token);
// 	     }catch(err){
//           alert("Failed to get push token for push notification!");
// 	     }
// 	 }
// 	    setNotification()
// 	}

// }



export const setNotification = async (data) => {
	let time = data.time;
	let newDate = (new Date()).getTime();
	if (data.time <= newDate) {
		const days = Math.ceil((newDate - time) / (1000 * 3600 * 24));
		time = data.time + (days * (24 * 1000 * 3600));
	}
	const localnotification = {
		title: data.title,
		body: data.body,
		data: {
			title: data.title,
			body: data.body,
		},

		ios: {
			sound: true,
		},
	};

	const schedulingOptions = { time: time, repeat: 'day' };

	const id = await Notifications.scheduleLocalNotificationAsync(
		localnotification,
		schedulingOptions
	);
	return id;

}

export const safeOne = async (data) => {
	try {
		await AsyncStorage.setItem(data.path, JSON.stringify(data));
		return true
	} catch (err) {
		alert('Unknowen Error!');
	}
	return false

}
export const cancelAll = async () => {
	try {
		await Notifications.cancelAllScheduledNotificationsAsync();
	} catch (err) {
		alert('Unknowen Error!');
	}
}
export const cancelNotification = async (id) => {
	try {
		if (id) {
			await Notifications.cancelScheduledNotificationAsync(id);
			// console.log('deleted successfuly')
		}
	} catch (err) {
		alert('Unknowen Error!');
	}
}