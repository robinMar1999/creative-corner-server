const { google } = require("googleapis");
const config = require("config");
const streamifier = require("streamifier");
const mime = require("mime-types");

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || config.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || config.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || config.GOOGLE_REDIRECT_URI;
const GOOGLE_REFRESH_TOKEN =
  process.env.GOOGLE_REFRESH_TOKEN || config.GOOGLE_REFRESH_TOKEN;
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID || config.DRIVE_FOLDER_ID;

const oauth2client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

oauth2client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2client,
});

const BASE_URL = "https://drive.google.com/uc";

const uploadFile = async (file) => {
  // console.log(file);
  const fileExtension = (file.originalname.match(/\.+[\S]+$/) || [])[0];
  try {
    const fileMetadata = {
      name: `${file.fieldname}-${Date.now()}${fileExtension}`,
      parents: [DRIVE_FOLDER_ID],
    };
    const response = await drive.files.create({
      resource: fileMetadata,
      media: {
        mimeType: mime.lookup(fileExtension),
        body: streamifier.createReadStream(file.buffer),
      },
    });
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    return {
      id: response.data.id,
      url: `${BASE_URL}?id=${response.data.id}`,
      name: response.data.name,
    };
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message);
  }
};

const deleteFile = async (fileId) => {
  try {
    const response = await drive.files.delete({
      fileId: fileId,
    });
    console.log(response.data, response.status);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
