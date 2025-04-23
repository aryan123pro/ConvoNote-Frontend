// Azure Function: blobStorage.js
const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

module.exports = async function (context, req) {
  const fileBuffer = req.body;
  const contentType = req.headers['content-type'];

  if (!fileBuffer || !contentType) {
    context.res = { status: 400, body: 'Missing file or content type' };
    return;
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerName = 'audiouploads';
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `audio-${uuidv4()}.wav`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: { blobContentType: contentType }
    });

    const blobUrl = blockBlobClient.url;

    context.res = {
      status: 200,
      body: { blobUrl }
    };
  } catch (error) {
    context.log('Blob upload failed:', error);
    context.res = { status: 500, body: 'Failed to upload audio' };
  }
};