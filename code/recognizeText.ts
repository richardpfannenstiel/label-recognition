import MlkitOcr from "react-native-mlkit-ocr";

export type IdentifiableImage = {
    uri: string
}

async function recognize(image: IdentifiableImage) {
    const result = await MlkitOcr.detectFromUri(image.uri);
    let lines: Array<string> = [];
        result.map((block) => {
            block.lines.map(line => {
                lines.push(line.text);
            });
        });

    return lines;
}

export default recognize;