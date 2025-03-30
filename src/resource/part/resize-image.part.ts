import * as sharp from 'sharp';


export async function resizeImagePart
    (
        file: Express.Multer.File,
        width: number,
        height: number,
    )
{
    file.buffer = await sharp(file.buffer)
        .resize({
            width,
            height,
            fit: sharp.fit.outside,
        })
        .toBuffer();


    return file;
}
