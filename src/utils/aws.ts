import { 
  S3Client,
  DeleteObjectsCommand, 
  GetObjectCommand, 
  ListBucketsCommand,
  ListObjectsV2Command,
  Bucket
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { HealthReport } from "@/health";

const client = new S3Client({
  region: String(process.env.AWS_REGION), // Specify the AWS region from environment variables
  credentials: {
    accessKeyId: String(process.env.AWS_ACCESSKEYID),
    secretAccessKey: String(process.env.AWS_SECRETACCESSKEY),
  }
});

export async function s3CheckConenction(): Promise<HealthReport> {
  let data;

  try {
    data = await client.send(
      new ListBucketsCommand()
    );
  } catch (e) {
    console.error(e);
    return {
      OK: false,
      msg: JSON.stringify(e)
    };
  }

  return { OK: true, msg: ""};
}

export async function s3GetBuckets(): Promise<Bucket[]> {
  let data;
  try {
    data = await client.send(
      new ListBucketsCommand()
    );
  } catch (e) {
    console.error(e);
  }

  if (data && data.Buckets)
    return data.Buckets;
  return [];
}

export async function s3UploadMedia(
  uuid: string,
  buffer: Buffer<ArrayBufferLike>
) {
  
}

export async function s3GetBucketObjects(
  bucket: string
): Promise<Object[] | null> {
  let data;
  try {
    // Config format for listObjects
    // const input = { // ListObjectsV2Request
    //   Bucket: "STRING_VALUE", // required
    //   Delimiter: "STRING_VALUE",
    //   EncodingType: "url",
    //   MaxKeys: Number("int"),
    //   Prefix: "STRING_VALUE",
    //   ContinuationToken: "STRING_VALUE",
    //   FetchOwner: true || false,
    //   StartAfter: "STRING_VALUE",
    //   RequestPayer: "requester",
    //   ExpectedBucketOwner: "STRING_VALUE",
    //   OptionalObjectAttributes: [ // OptionalObjectAttributesList
    //     "RestoreStatus",
    //   ],
    // };
    data = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
      }),
    )
  } catch (e) {
    console.error(e)
  }

  if (!data) return null;

  if (!data.Contents) return null;
  else return data.Contents;
}

export const folderNames = {

}
