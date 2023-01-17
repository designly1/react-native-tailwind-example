React-Native is a great solution for existing React web developers looking to extend their skillset into the native mobile arena. The API and the way components are built in React-Native is identical to that of regular React.

One key difference between the technologies is the way "CSS" is implemented--and I put CSS in quotes because in the React-Native world, they are called "stylesheets," but the are not fully-implemented CSS. Many of the CSS rules overlap that of RN stylesheets, but there are many key differences.

If you are already a Tailwind CSS user, then you already know how useful a tool it is for speeding up UI development. Well, now you can have that same great tool for React-Native (called Nativewind), and the utility classes are pretty much identical!

In this tutorial, I'm going to show you how to set up a new React-Native project using the [Expo](https://expo.dev/) CLI tool. Then well install and configure Tailwind. And then as an extra-added bonus, we'll define a custom font class for a Google font.

#### Create and Initialize Our Project

If you don't already have it, please install the Expo CLI. You'll need elevated privileges to do so ('sudo' in Linux or run 'cmd' as administrator in Windows).

```bash
npm i -g expo-cli
```

Now let's create a new Expo / React-Native project:

```bash
npx create-expo-app react-native-tailwind-example
```

And then install our dependencies:

```bash
cd react-native-tailwind-example
npm i nativewind expo-splash-screen @expo-google-fonts/georama
npm i --save-dev tailwindcss
```

Then initialize Tailwind:

```bash
npx tailwindcss init
```

This script creates a file called `tailwind.config.js` in the project root directory. Now let's edit that file. Open up our new project in [Visual Studio Code](https://code.visualstudio.com/download) by running `code .` in the terminal. If you're using Windows and the command interpreter can't find `code`, then you need to add the path to VS code executable to your PATH environment variable. If you're unsure on how to do this, [check out this tutorial](https://helpdeskgeek.com/windows-10/add-windows-path-environment-variable/).

Now edit the `tailwind.config.js` file to look like this:

```js
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'geo': 'Georama_400Regular'
      }
    },
  },
  plugins: [],
}
```

Tailwind needs to know which directories to traverse to compile the stylesheets. I use a `screens` directory for screen components and a `components` directory for sub-components in the RN projects. Also, not that I've added a custom class under `theme` for the Google font I intend to use.

One last thing we need to do to configure Tailwind is add the babel plugin to `babel.config.js` file:

```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
    ],
  };
};
```

That's it! Super easy. Now let's get on with programming our app.

#### Building The App

In this example, I won't be using anything from `components` or `screens`. For simplicity's sake, I'm going to put everything into the `App.js` file.

```js
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView, Linking } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Georama_400Regular } from '@expo-google-fonts/georama';

/* Prevent splash screen from hiding automatically */

SplashScreen.preventAutoHideAsync();

export default function App() {
  // Initialize state for app readiness
  const [appIsReady, setAppIsReady] = useState(false);

  // Show splash screen while we load Google Fonts
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({ Georama_400Regular });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Create a callback for when our font is done loading
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // return null until app is ready
  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaView onLayout={onLayoutRootView}>
      <View className={`py-10 px-5 bg-slate-600`}>
        <Text className={`font-geo text-lg text-white`}>This text is in Google's Georama Regular 400 font!</Text>
      </View>
      <View className={`py-10 px-5 bg-indigo-800`}>
        <Text className="font-geo text-lg text-white">
          For more great information, please read the {' '}
          <Text className={`text-yellow-300`} onPress={() => Linking.openURL('https://designly.biz/blog')}>Designly Blog</Text>!
        </Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
```

Here's a quick overview of what the above code does:

1. We create a state variable called `appIsReady` set default to `false`
2. We create an `effect` to load our Google font with a promise resolution that sets our state variable to true
3. We create a `callback` and assign it to the `onLayout` prop of our main component

What this accomplishes is the splash screen will cover the app main screen until all fonts are done loading. This will prevent a noticeable change in font face and help prevent layout shift.

Then we create our test views. Note that we use `className=` just like in regular react. Also note our custom `font-geo` class that we defined in `tailwind.config.css`. You can create as many custom classes as you like.

Now to test your app, simply open a terminal in VS Code and enter:

```bash
npx expo start
```

If everything compiles properly, you should see this output:

![Expo Start Output](https://cdn.designly.biz/blog_files/how-to-create-a-react-native-app-with-tailwind-nativewind-and-google-fonts/image1.jpg)

You'll need the Expo Go app to test it out. It's available from the App Store and Google Play. Once loaded, your screen should look like this:

![Expo Start Output](https://cdn.designly.biz/blog_files/how-to-create-a-react-native-app-with-tailwind-nativewind-and-google-fonts/image2.jpg)

That's all folks! I hope you found this article useful. For more great information, please be sure to read the [Designly Blog](https://designly.biz/blog)!