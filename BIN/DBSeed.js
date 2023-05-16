// Require Mongoose
const mongoose = require('mongoose');

// Require Book Model
const Piece = require('../models/Piece.model.js');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/VogueVibes";

const piecesArr = [
    {
        "name": "White T-shirt",
        "imageUrl": "https://cdn.shopify.com/s/files/1/0472/7118/2499/products/60033471-1_450x450.jpg?v=1642043307",
        "pieceType": "top"
    },{
        "name": "White Pants",
        "imageUrl": "https://www.highsnobiety.com/static-assets/thumbor/t6Rb2wFaxo9d3IVt_8g6OTIAAQ0=/1500x1000/whatdropsnow.s3.amazonaws.com/product_image/168014/shrine_image/33e2b37450ae9b0aedff11016744e63b.jpeg",
        "pieceType": "bottom"
    },{
        "name": "White Shoes",
        "imageUrl": "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1673469712-4-1673469708.png?crop=1xw:1xh;center,top&resize=980:*",
        "pieceType": "shoes"
    },{
        "name": "Jeans",
        "imageUrl": "https://www.crewclothing.co.uk/images/products/large/WMH008_MIDINDIGO_3.jpg",
        "pieceType": "bottom"
    },{
        "name": "Black Shoes",
        "imageUrl": "https://images.vans.com/is/image/VansEU/VN000EE3BKA-HERO?$PDP-FULL-IMAGE$",
        "pieceType": "shoes"
    },{
        "name": "Black Sweatshirt",
        "imageUrl": "https://media.dior.com/couture/ecommerce/media/catalog/product/i/H/1604511903_113J698A0531_C989_E01_GHC.jpg",
        "pieceType": "top"
    },{
        "name": "Khaki Chinos",
        "imageUrl": "https://target.scene7.com/is/image/Target/GUEST_94e25f25-a3a3-4b08-9d97-830b56c1bd0b?wid=488&hei=488&fmt=pjpeg",
        "pieceType": "bottom"
    },{
        "name": "White Shirt",
        "imageUrl": "https://www.schoolwear.ie/wp-content/uploads/2016/04/White-Shirt.jpg",
        "pieceType": "top"
    }
];

async function insertPieces(){
try{
    let db = await mongoose.connect(MONGO_URI);

    // Feedback about the connection
    console.log(`Connected to Mongo Database: ${db.connections[0].name}`);

    // Create new documents inside books collection

    await Piece.create(piecesArr);
    // Feeback regarding to books creation
    console.log(`Created ${piecesArr.length} pieces!`); 
    // Closing the connection
    await mongoose.connection.close();
}
catch(error){
    console.log('An error occurred while connecting to Db', error);
}
}

insertPieces();