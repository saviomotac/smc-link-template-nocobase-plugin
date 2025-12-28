if exist dist rmdir /s /q dist
if exist node_modules rmdir /s /q node_modules
yarn install
yarn build
npm pack
