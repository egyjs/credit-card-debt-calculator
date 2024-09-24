## README

# Credit Card Payment Tracker

This application helps you track your credit card expenses and calculate the total amount you need to pay off each month to avoid late fees and interest. It fetches SMS messages from your phone, filters them based on specific criteria, and calculates the total amount spent.

## Features

- Fetches SMS messages from your phone.
- Filters SMS messages based on the last 4 digits of your card.
- Calculates the total amount spent in the previous month.
- Displays the total amount to be paid and a list of relevant SMS messages.

## Installation

### Prerequisites

- Node.js and npm installed on your machine.
- React Native environment set up. Follow the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions.

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/egyjs/credit-card-debt-calculator.git 
    cd credit-card-debt-calculator
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the Metro server:

    ```bash
    npm start
    ```

4. Open a new terminal and run the application:

   #### For Android

    ```bash
    npm run android
    ```

   #### For iOS

    ```bash
    npm run ios
    ```

## Usage

1. Open the application on your device.
2. Enter the last 4 digits of your credit card in the input field.
3. The application will fetch and filter SMS messages based on the entered digits.
4. The total amount to be paid will be displayed along with a list of relevant SMS messages.

## Troubleshooting

If you encounter any issues, refer to the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev)
- [Getting Started](https://reactnative.dev/docs/environment-setup)
- [Learn the Basics](https://reactnative.dev/docs/getting-started)
- [Blog](https://reactnative.dev/blog)
- [`@facebook/react-native`](https://github.com/facebook/react-native)

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
