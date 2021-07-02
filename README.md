# pagebuilder-module-pwa-studio
PageBuilder client side module for pwa-studio

## To check it, run:

```
git clone https://github.com/Simicart/pagebuilder-module-pwa-studio
cd pagebuilder-module-pwa-studio
```

create `.env` file like `.env_sample`
Run command below to install and watch:

```
yarn install && yarn run watch
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
