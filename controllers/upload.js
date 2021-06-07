const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

exports.upload = async (req, res) => {
  try {
    // Get access token
    const {
      data: { accessToken },
    } = await axios.post(
      `${process.env.FABRIC_URL}/api-identity/auth/local/login`,
      {
        username: process.env.FABRIC_LOGIN_USERNAME,
        password: process.env.FABRIC_LOGIN_PASSWORD,
        accountId: process.env.FABRIC_LOGIN_ACCOUNT_ID,
      }
    );

    // get S3 data
    const { data: bucketCredentials } = await axios.post(
      `${process.env.FABRIC_URL}/api-image/image/get-save-url`,
      {
        filename: "abc.png",
        "fabric-service-name": process.env.FABRIC_SERVICE_NAME,
      },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );

    // create formData
    const formData = new FormData();

    const filepath = path.join(__dirname, "gg.png");
    const imgStream = fs.createReadStream(filepath);

    console.log(bucketCredentials);
    // const key = bucketCredentials.fields.key;
    // const bucket = bucketCredentials.fields.bucket;
    // const policy = bucketCredentials.fields.Policy;
    // const amzAlgorithm = bucketCredentials.fields["X-Amz-Algorithm"];
    // const amzCredential = bucketCredentials.fields["X-Amz-Credential"];
    // const amzDate = bucketCredentials.fields["X-Amz-Date"];
    // const amzSecuriyToken = bucketCredentials.fields["X-Amz-Security-Token"];
    // const amzSignature = bucketCredentials.fields["X-Amz-Signature"];

    for (let i in bucketCredentials.fields) {
      formData.append(i, bucketCredentials.fields[i]);
    }
    formData.append("file", imgStream);

    // formData.append("key", key);
    // formData.append("file", imgStream);
    // formData.append("bucket", bucket);
    // formData.append("Policy", policy);
    // formData.append("X-Amz-Algorithm", amzAlgorithm);
    // formData.append("X-Amz-Credential", amzCredential);
    // formData.append("X-Amz-Date", amzDate);
    // formData.append("X-Amz-Security-Token", amzSecuriyToken);
    // formData.append("X-Amz-Signature", amzSignature);

    contentLength = JSON.stringify(formData).length;
    console.log(contentLength);

    var config = {
      method: "post",
      url: "https://s3.amazonaws.com/greatwall-sandbox-sandbox-image",
      headers: {
        ...formData.getHeaders(),
        // "Content-Length": contentLength,
        "Content-Length": 3495,
      },
      data: formData,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        return res.json({ message: "success" });
      })
      .catch(function (error) {
        console.log(error);
        return res.json({ message: "error" });
      });

    // // upload image
    // const imgUploadUrl =
    //   "https://s3.amazonaws.com/greatwall-sandbox-sandbox-image";
    // // console.log(imgStream);
    // await axios({
    //   url: imgUploadUrl,
    //   method: "post",
    //   data: formData,
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //     Connection: "keep-alive",
    //     Host: "s3.amazonaws.com",
    //     Origin: "https://sandbox.copilot.fabric.inc",
    //   },
    // });
  } catch (error) {
    console.log(error);
    return res.json({ message: "error" });
  }
};
