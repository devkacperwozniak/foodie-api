import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  private readonly bucket = 'foodie_test';
  private readonly keyFilename = '/home/docker-to-storage/keyfile.json';
  private readonly storage = new Storage({ keyFilename: this.keyFilename });

  async getBuckets() {
    const [buckets] = await this.storage.getBuckets();
    console.log('Buckets:');

    for (const bucket of buckets) {
      console.log(`- ${bucket.name}`);
    }
  }

  async getPublicMealsFiles() {
    const fileUrls = [];
    const buckets = this.storage.bucket(this.bucket);
    const [files] = await buckets.getFiles();
    await buckets.getFiles();
    for (const file of files) {
      if (file.name.includes('meals/')) {
        const a = await file.isPublic();
        if (a[0]) {
          fileUrls.push(file.publicUrl());
        }
      }
    }
    return fileUrls;
  }

  async uploadFile(file: Express.Multer.File) {
    const bucket = this.storage.bucket(this.bucket);
    const filename = `meals/${Date.now()}`;
    const fileUpload = bucket.file(`meals/${Date.now()}`);
    await pipeline(
      Readable.from(file.buffer),
      fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        public: true,
      }),
    );
    return `https://storage.googleapis.com/${this.bucket}/${filename}`;
  }
  async delete(path: string) {
    const decodedUrl = decodeURIComponent(path);
    await this.storage
      .bucket(this.bucket)
      .file(decodedUrl)
      .delete({ ignoreNotFound: true });
  }
}
