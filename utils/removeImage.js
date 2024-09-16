const fs = require('fs');
exports.removeImage = async (imageName, req)=> {
  try {
    const image = req?.files?.[imageName];
    fs.unlink(image[0].path, (err) => {
      if (err) console.log("error while removing image");
      console.log("image removed successfully.");
    });
  } catch (error) {
    console.log('error', error)
  }
}