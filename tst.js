const url = "http://res.cloudinary.com/demo/image/upload/v1570979139/eneivicys42bq5f2jpn2.jpg";
const regex = /\/([^\/]+)\.jpg$/;
const match = url.match(regex);
const id = match[1];
console.log(id.length);

