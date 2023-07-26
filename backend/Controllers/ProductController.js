const ProductModel=require('../Models/ProductModel')
const GenreModel=require('../Models/GenreModel')
const ReviewModel=require('../Models/ReviewModel')
module.exports.get= async(req,res)=>{

    const products = await ProductModel.find()
    res.send(products)
}


module.exports.save= async(req,res)=>{

    const {name,description,category,qty,image,game_title,price,genre} = req.body
    try{
      const Genrename= await GenreModel.findOne({name:genre})
      console.log(Genrename._id)
      let Objectid=Genrename._id
    ProductModel
    .create({name,description,category,qty,image,game_title,price,genre:Objectid})
    .then((data)=>{
        console.log("Product has been added to the inventory...")
        console.log(data)
        res.send(data);
    })}
    catch(err){
      return res.status(500).json({ err: 'Internal server error' });
    }
}

module.exports.update= async(req,res)=>{

    const {_id,qty,image,price}= req.body
    ProductModel
    .findByIdAndUpdate(_id,{qty,image,price})
    .then(()=>{res.send("product information updated sucessfully...")})
    .catch((err)=>{
            console.log(`Error while updating info for product : ${_id} :${err}`)
    })
}


module.exports.delete= async(req,res)=>{

    const {_id,name} = req.body
    ProductModel
    .findByIdAndDelete(_id)
    .then(()=>{res.status(201).send("product deleted sucessfully...")})
    .catch((err)=>{
            console.log(`Error while deleting ${name}'s account :${err}`)
    })
} 

module.exports.findone = async (req, res) => {
    const { id } =req.query;
    console.log( id);
  

    try {
      const product = await ProductModel.findOne({

        _id: id
      });
      console.log(product)
      const reviews = await ReviewModel.find({ productId:product._id });
      console.log(product);
      console.log(reviews); 
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.send(product);
      }
    } catch (err) {
      return res.status(500).json({ err: 'Internal server error' });
    }
  };

module.exports.review= async (req,res)=>{
  try {
    const rating= req.body.rating;
    const productId = req.params.productId;

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const review = new ReviewModel({ productId, rating });
    await review.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}


