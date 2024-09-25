import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, ScrollView, Text, TextInput, View} from 'react-native';
import SmsAndroid, {SMS} from 'react-native-get-sms-android';
import moment from 'moment';


const App = () => {
    // const [smsList, setSmsList] = useState([]);
    const [prevMonthList, setPrevMonthList] = useState<Array<SMS>>([]);
    const [currentMonthList, setCurrentMonthList] = useState<Array<SMS>>([]);
    const [text, setText] = useState('2823');
    const [prevMonthTotal, setPrevMonthTotal] = useState(0);
    const [currentMonthTotal, setCurrentMonthTotal] = useState(0);


    // timestamp (in milliseconds since UNIX epoch)
    let startDate = moment().date(21).subtract(1, 'month').startOf('day'); // 8/21/2024
    let endDate = moment().date(20).add(1, 'month').endOf('day'); // 10/20/2024

    let prevMonthDate = {
        start: startDate,
        end: moment(endDate).subtract(1, 'month').endOf('day'),
    };

    let currentMonthDate = {
        start: moment(startDate).add(1, 'month').startOf('day'),
        end: endDate,
    };

    console.log('Start Date: ', startDate.format('YYYY-MM-DD HH:mm'));
    console.log('End Date: ', endDate.format('YYYY-MM-DD HH:mm'));


    useEffect(() => {
        const requestSmsPermission = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_SMS,
                    {
                        title: 'SMS Permission',
                        message: 'This app needs access to your SMS messages.',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('SMS permission granted');
                    fetchSms();
                } else {
                    console.log('SMS permission denied');
                }
            } catch (err) {
                console.warn(err);
            }
        };

        const fetchSms = () => {
            const filter = {
                box: 'inbox',
                address: 'CIB',
                minDate: startDate.valueOf(),
                maxDate: endDate.valueOf(),
                bodyRegex: '.*(charged|تم خصم).*',
            };

            SmsAndroid.list(
                JSON.stringify(filter),
                (fail: string) => {
                    console.log('Failed with this error: ' + fail);
                },
                (count: number, smsList: string) => {
                    const arr: Array<SMS> = JSON.parse(smsList);
                    arr.sort((a, b) => a.date - b.date);
                    console.log('');
                    console.log('All Count: ', count);
                    filterSms(arr);
                },
            );
        };

        const filterSms = (list: Array<SMS>) => {
            const filteredSms = list.filter(sms => sms.body.includes(text));
            console.log('Filtered Count: ', filteredSms.length);
            const prevMonthSms = filteredSms.filter(sms => moment(sms.date).isBefore(moment(currentMonthDate.start)));
            const currentMonthSms = filteredSms.filter(sms => moment(sms.date).isAfter(moment(currentMonthDate.start)));

            console.log('Prev Month Count: ', prevMonthSms.length);
            console.log('Current Month Count: ', currentMonthSms.length);
            console.log('');

            setPrevMonthList(prevMonthSms);
            setCurrentMonthList(currentMonthSms);

            setPrevMonthTotal(calculateTotal(prevMonthSms));
            setCurrentMonthTotal(calculateTotal(currentMonthSms));
        };

        const calculateTotal = (list: Array<SMS>) => {
            return list.reduce((sum, sms) => {
                const match = sms.body.match(/(\d+\.\d+)/);
                return match ? sum + parseFloat(match[0]) : sum;
            }, 0);
        };

        requestSmsPermission();
    }, [text]);

    const renderInput = () => {
        return (
            <View>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Last 4 digits of your card (e.g. 2823)</Text>
                <TextInput
                    style={{ padding: 10, height: 50, borderColor: 'gray', borderWidth: 1 }}
                    placeholder="Enter the last 4 digits of your card (e.g. 2823)"
                    onChangeText={newText => setText(newText)}
                    defaultValue={text}
                    editable={true}
                />
            </View>
        );
    };

    const renderMonth = (list: Array<SMS>, title: string, price: number, date: { start: moment.Moment; end: moment.Moment }) => {
        return (
            <ScrollView style={{ marginTop: 20, borderWidth: 1, padding: 10, height: 300 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                    {title}
                    <Text style={{ fontSize: 30, textDecorationLine: 'underline' }}>{price}</Text>
                    <Text style={{ fontSize: 20, color: 'gray' }}> EGP</Text>
                </Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                    SMS List <Text style={{ fontSize: 13, color: 'gray' }}>
                        ({list.length} - from {date.start.format('YYYY-MM-DD')} to {date.end.format('YYYY-MM-DD')})
                    </Text>
                </Text>
                <ScrollView>
                    {list.map((sms, index) => (
                        <View key={index} style={{ borderWidth: 1, padding: 10, margin: 5 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, alignSelf: 'center' }}>{sms.body}</Text>
                            <Text style={{ color: 'gray' }}>Date: {moment(sms.date).format('YYYY-MM-DD HH:mm')}</Text>
                        </View>
                    ))}
                </ScrollView>
            </ScrollView>
        );
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            {renderInput()}
            {renderMonth(prevMonthList, 'You need to pay: ', prevMonthTotal, prevMonthDate)}
            {renderMonth(currentMonthList, 'You have spent: ', currentMonthTotal, currentMonthDate)}
        </View>
    );
};

export default App;
