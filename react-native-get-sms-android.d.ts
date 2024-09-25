declare module 'react-native-get-sms-android' {
    export interface SMS {
        body: string;
        date: number;
    }
    export default class SmsAndroid {
        static list(
            filter: string,
            fail: (error: string) => void,
            success: (count: number, smsList: string) => void,
        ): void;
    }
}
