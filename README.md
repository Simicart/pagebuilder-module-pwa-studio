# pagebuilder-module-pwa-studio

![alt text](https://tapita.io/wp-content/uploads/2021/05/templates.png)

PageBuilder client side module for pwa-studio

## We support from PWA studio 10 and later. Please use the correct release brand to do.
1. If you use PWA studio 10, please try release/v10
2. If you use PWA studio 11, please try release/v11
3. If you use PWA studio 12, please try release/v12

## To check it
Option 1. If you use @magento/create-pwa package, from the root directory of your PWA Studio project, clone the repository:
```
git clone https://github.com/Simicart/pagebuilder-module-pwa-studio @simicart/pagebuilder-module-pwa-studio/
```
Option 2. If you clone magento pwa from github (https://github.com/magento/pwa-studio), go to packages/venia-concept, then clone the repository
```
git clone https://github.com/Simicart/pagebuilder-module-pwa-studio @simicart/pagebuilder-module-pwa-studio/
```

Modify the dependencies of your project
Option 1. If you use @magento/create-pwa, please modify package.json file at the root folder. 
Option 2. If you clone magento pwa from github (https://github.com/magento/pwa-studio), please modify package.json file at packages/venia-concept. 
```
"dependencies": {
  ...
  "@simicart/pagebuilder-module-pwa-studio": "link:./@simicart/pagebuilder-module-pwa-studio"
},
"devDependencies": {
    "simi-pagebuilder-react": "^1.3.4",
    ...
},
```
Install and start project:
```
yarn install && yarn run watch
```

## To Integrate your key
1. You have to create an account at Tapita.io
2. Sync your Magento site to Tapita
3. Copy Integration Token 
![alt text](https://tapita.io/wp-content/uploads/2021/11/Screenshot-6.png)
4. Open the file at
```
  src/override/magentoRoute.js
```
5. And change the value at this line:
```
  const integrationToken = '14FJiubdB8n3Byig2IkpfM6OiS6RTO801622446444';
```
to your integration key and re-run the watch command.
```
yarn run watch
```

## To Develop

### Firstly, modify the package json:

```
    "simi-pagebuilder-react": "(version)",
to
    "simi-pagebuilder-react": "link:./simi-pagebuilder-react",
```

and

```
    "react": "(version)",
to
    "react": "link:./simi-pagebuilder-react/node_modules/react",
```

### And Pull the simi-pagebuilder-react repo to your directory

```
git clone https://github.com/Simicart/simi-pagebuilder-react

cd simi-pagebuilder-react

yarn install && yarn run build

```

### Go outside and run start command

```
cd ..

yarn install && yarn run watch
```
