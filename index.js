const Jimp = require('jimp');
const key = require('./key');
const path = require('path');

let cv;

Module = { onRuntimeInitialized };

cv = require('./lib/opencv')

async function onRuntimeInitialized() {
    try {
        const mapImage = await Jimp.read('./map.gif');

        // quick and dirty way to prevent multiple keys from claiming the
        // same x, y
        const occupied = new Map();

        const mapPoints = [];

        for (const { name, threshold } of key) {
            const mapMatrix = cv.matFromImageData(mapImage.bitmap);
            cv.cvtColor(mapMatrix, mapMatrix, cv.COLOR_BGR2GRAY, 0);
            const [mapWidth, mapHeight] = [mapMatrix.cols, mapMatrix.rows];
            const keyImage = await Jimp.read(path.resolve('res/key-old',
                `${name}.png`));
            const keyMatrix = cv.matFromImageData(keyImage.bitmap);
            cv.cvtColor(keyMatrix, keyMatrix, cv.COLOR_BGR2GRAY, 0);
            const [keyWidth, keyHeight] = [keyMatrix.cols, keyMatrix.rows];

            const resWidth = mapWidth - keyWidth + 1;
            const resHeight = mapHeight - keyHeight + 1;
            const resMatrix = new cv.Mat(resWidth, resHeight, cv.CV_32FC1);

            cv.matchTemplate(mapMatrix, keyMatrix, resMatrix,
                cv.TM_CCOEFF_NORMED);

            //cv.normalize(resMatrix, resMatrix, 0, 1, cv.NORM_MINMAX, -1);

            const { minVal, maxVal } = cv.minMaxLoc(resMatrix);

            for (let x = 0; x < resWidth; x += 1) {
                for (let y = 0; y < resHeight; y += 1) {
                    const pixel = resMatrix.data32F[y * resWidth + x];

                    if (pixel <= maxVal && pixel >= maxVal - threshold) {
                        if (occupied.has(`${x},${y}`)) {
                            /*console.log(name, 'tried to occupy where',
                                occupied.get(`${x},${y}`), 'is');*/
                            break;
                        }

                        /*cv.rectangle(
                            mapMatrix,
                            new cv.Point(x + 2, y + 2),
                            new cv.Point(x + keyWidth - 3, y + keyHeight - 3),
                            [255, 0, 0, 255], 1);*/

                        occupied.set(`${x},${y}`, name);
                        mapPoints.push({ type: name, x, y });
                    }
                }
            }

            cv.cvtColor(mapMatrix, mapMatrix, cv.COLOR_GRAY2RGB, 0);

            /*new Jimp({
                width: mapMatrix.cols,
                height: mapMatrix.rows,
                data: Buffer.from(mapMatrix.data)
            }).write(`./map-${name}.png`);*/
        }

        console.log(JSON.stringify(mapPoints, null, '    '));
    } catch (e) {
        if (!Number.isNaN(+e)) {
            e = cv.exceptionFromPtr(e);
            console.error('error code: ', e.code);
            console.error(e.msg);
        } else {
            console.error(e);
        }
    }
}
