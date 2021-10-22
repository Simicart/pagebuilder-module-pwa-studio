# pagebuilder-module-pwa-studio

![alt text](https://tapita.io/wp-content/uploads/2021/05/templates.png)

PageBuilder client side module for pwa-studio

## To check it
If you use @magento/create-pwa package, from the root directory of your PWA Studio project, clone the repository:

(If you clone magento pwa from github (https://github.com/magento/pwa-studio), go to packages/venia-concept, then clone the repository)

```
git clone https://github.com/Simicart/pagebuilder-module-pwa-studio @simicart/pagebuilder-module-pwa-studio/
```
Modify the dependencies of your project
```
"dependencies": {
  ...
  "@simicart/pagebuilder-module-pwa-studio": "link:./@simicart/pagebuilder-module-pwa-studio"
},
"devDependencies": {
    "simi-pagebuilder-react": "^1.3.3",
    ...
},
```
Install and start project:

```
yarn install && yarn run watch
```

## To Integrate your key

Open the file at

```
  src/override/magentoRoute.js
```

And change the value at this line:
```
  const integrationToken = '14FJiubdB8n3Byig2IkpfM6OiS6RTO801622446444';
```
to your integration key and re-run the watch command.

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
