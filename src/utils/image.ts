import ExifReader from "exifreader"
import { PrismaClient } from '@prisma/client/edge'

const prisma = new PrismaClient()

export async function extract_metadata(img_buffer: Buffer<ArrayBufferLike>) {
  const buffer = img_buffer;
  const tags = await ExifReader.load(buffer,
    {
      async: true
    }
  );

  const height = tags["Image Height"];
  const width = tags["Image Width"];
  
  // Prepared to get uploaded to MongoDB
  const tags_stringified = JSON.stringify(tags);
}