'use strict';

const fs = require('fs');
const path = require('path');

const nativeDir = path.join(__dirname, '..', 'native');
const targetDir = path.join(nativeDir, 'target', 'release');
const prebuildsDir = path.join(nativeDir, 'prebuilds');
const outFile = path.join(prebuildsDir, 'react_console_native.node');

const libNames = {
  darwin: 'libreact_console_native.dylib',
  linux: 'libreact_console_native.so',
  win32: 'react_console_native.dll',
};

const platform = process.platform;
const libName = libNames[platform];
if (!libName) {
  console.error('copy-native-addon: unsupported platform', platform);
  process.exit(1);
}

const srcPath = path.join(targetDir, libName);
if (!fs.existsSync(srcPath)) {
  console.error('copy-native-addon: built addon not found at', srcPath);
  console.error('Run "npm run build:native" first.');
  process.exit(1);
}

fs.mkdirSync(prebuildsDir, { recursive: true });
fs.copyFileSync(srcPath, outFile);
console.log('copy-native-addon: copied to', outFile);
