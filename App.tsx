import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Text, View, FlatList, TextInput, ScrollView} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import moment from 'moment';
// todo: code needs to be refactored and optimized, add missing types
const App = () => {
    const [smsList, setSmsList] = useState([]);
    const [text, setText] = useState('2823');
    const [total, setTotal] = useState(0);


    // timestamp (in milliseconds since UNIX epoch)
    let startDate = moment().date(20).startOf('day');
    let endDate = moment().date(20).add(1, 'month').endOf('day');

    if (moment().date() < 20) {
        startDate = moment().date(20).subtract(1, 'month').startOf('day');
        endDate = moment().date(20).endOf('day');
    }

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

        const fetchSms =  () => {
            const filter = {
                box: 'inbox', // 'inbox' or 'sent'
                // the phone number to filter by, or '' to retrieve all
                address: 'CIB',
                // the date range as a UNIX timestamp (in seconds)
                // from the first Of the previous month to the current date
                minDate: startDate.valueOf(),
                maxDate: endDate.valueOf(),
                bodyRegex: '.*(charged|تم خصم).*', // content regex to match
            };

            SmsAndroid.list(
                JSON.stringify(filter),
                (fail) => {
                    console.log('Failed with this error: ' + fail);
                },
                (count, smsList) => {
                    const arr = JSON.parse(smsList);
                    // sort sms by date (oldest to newest)
                    arr.sort((a, b) => a.date - b.date);
                    setSmsList(arr);
                    console.log('All Count: ', count);
                    filterSms(arr);
                },
            );
        };

        const filterSms = (list: Array<Object>) => {
            // filter sms by the body that contains "the number of the card" (input)
            const filteredSms = list.filter(sms => sms.body.includes(text));
            console.log('Filtered Count: ', filteredSms.length);
            setSmsList(filteredSms);
            calculateTotal(filteredSms);
        }

        const calculateTotal = (list: Array<Object>) => {
            let t: number = 0;
            list.forEach(sms => {
                const body = sms.body;
                const regex = /(\d+\.\d+)/;
                const match = body.match(regex);
                if (match) {
                    console.log('Match: ', match[0]);
                    t += parseFloat(match[0]);
                }
            });
            console.log('Total: ', t);
            setTotal(parseFloat(t.toFixed(2)));
        };


        requestSmsPermission();
    }, [text]);

    const renderInput = () => {
        return (
            <View>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Last 4 digits of your card (e.g. 2823)</Text>
                <TextInput
                    style={{padding:10,height: 50, borderColor: 'gray', borderWidth: 1}}
                    placeholder="Enter the last 4 digits of your card (e.g. 2823)"
                    onChangeText={newText => setText(newText)}
                    defaultValue={text}
                    editable={true}
                />
            </View>
        );
    };

    return (
        <View style={{flex: 1, padding: 20}}>
            {renderInput()}
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                You need to pay:
                <Text style={{fontSize:30,textDecorationLine:"underline"}}>{total}</Text>
                <Text style={{fontSize: 20, color:"gray"}}> EGP</Text>
            </Text>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                SMS List <Text style={{fontSize: 13, color:"gray"}}>
                    ({smsList.length} - from {startDate.format('YYYY-MM-DD')} to {endDate.format('YYYY-MM-DD')})
                </Text>
            </Text>
            <ScrollView>
                {smsList.map((sms, index) => (
                    <View key={index} style={{borderWidth: 1, padding: 10, margin: 5}}>
                        <Text style={{fontWeight: 'bold', fontSize: 16,alignSelf:'center'}}>{sms.body}</Text>
                        <Text style={{color: 'gray'}}>Date: {moment(sms.date).format('YYYY-MM-DD HH:mm')}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default App;
