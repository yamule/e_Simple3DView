# e_Simple3DView
Simple 3D Object Viewer which allows you to change a few environment settings (lighting, camera position and so on).


<img src="https://raw.githubusercontent.com/yamule/e_Simple3DView/master/docs/img/example_1.png" width="600px">


Precompiled binaries for 64bit Windows & Linux are available from the [release](https://github.com/yamule/e_Simple3DView/releases) page.


## Make binary app from source
I think you need

[node.js](https://nodejs.org/)

electron (install with npm)

electron-packager (install with npm)

electron-store (install with npm)

To compile windows executable, please type
```
your_electron_version=32.1.2 # Change according to your environment
npm install --save-dev @electron/packager
npm install electron-store
 ./node_modules/.bin/electron-packager ./ e_Simple3DView --platform=win32 --arch=x64 --electron-version=${your_electron_version} --asar
```
Your electron version can be checked with "electron -v" command.

"win32" and "x64" must be changed dependent on your system.

If you are using Mac, they may be "darwin" and "x64", respectively, i guess...


## Usage
Drag & Drop .obj file or .stl file.
Or open .obj file or .stl file from Menu [Object] -> [Load].


## License
Apache License v 2.0


## Author
yamule

## Dependencies
[node.js](https://nodejs.org/)

[electron](https://github.com/electron/electron)

[electron-packager](https://github.com/electron/electron-packager)

[electron-store](https://github.com/sindresorhus/electron-store)

[three.js](https://threejs.org/)
