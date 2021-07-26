
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const { validationResult } = require('express-validator')

const  User = require('../models/user-schema')
const  Admin = require('../models/admin-schema')

const  Product = require('../models/product-schema')
const Banner = require('../models/banner-schema');
const Advertisement = require('../models/advertisement-schema');
const Payment = require('../models/payments-schema');
const  Plan = require('../models/plans-schema');
const Category = require('../models/category-schema');

const HttpError = require('../middleware/http-error');

const { v1: uuid } = require('uuid')

let geoip = require('geoip-lite');


//Admin signup

const createAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      console.log(errors);
      const error =  new HttpError("invalid input are passed,please pass valid data",422)
      return next(error)
  }
  const { name, email,  password  } = req.body;
 

  let geo = geoip.lookup(req.ip);
  const browser = req.headers["user-agent"];
  const ip = JSON.stringify(req.ip);
   
  let existingUser
  try{
       existingUser = await Admin.findOne({ email : email })
  }
  catch(err){
      const error = await new HttpError("something went wrong,creating a admin failed",500)
      return next(error)
  }
  if(existingUser){
      const error = new HttpError("user already exists",422)
      return next(error)
  }

  
  let hashedPassword;

 try{
  hashedPassword = await bcrypt.hash(password, 12)
 } 
 catch(err){
   console.log(err)
     const error = new HttpError("could not create fuser",500);
     return next(error)
 }


  const createdAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      ip,
      browser
   
  })

  try {
      await createdAdmin.save();
    } catch (err) {
      const error = new HttpError(
        'Creating Admin failed, please try again.',
        500
      );
      console.log(err)
      return next(error);
    }

    let token;
    try{
      token = await jwt.sign({
          userId : createdAdmin.id,
          email : createdAdmin.email 
           },
          process.env.JWT_KEY,
          {expiresIn :'1h'}
          )

    }
   catch (err) {
      const error = new HttpError(
        'Creating Admin failed, please try again.',
        500
      );
      return next(error);
    }
  
   
  res.status(201).json({ userId : createdAdmin.id,email : createdAdmin.email , token: token})
}

//admin login 
const  adminLogin = async(req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      console.log(errors);
      const error =  new HttpError("invalid input are passed,please pass valid data",422)
      return next(error)
  }

  const { email,password  } = req.body;

  let admin
  try{
       admin = await Admin.findOne({ email : email  })
  }
  catch(err){
      const error = await new HttpError("something went wrong,logging in failed",500)
      return next(error)
  }

  if(!admin){
      const error = new HttpError("invalid credentials could not log in",401)
      return next(error)
  }

 let isValidPassword = false; 
 try{
       isValidPassword = await bcrypt.compare(password, admin.password)
 }
 catch(err){
  const error = await new HttpError("invalid credentials try again",500)
  return next(error)
}

if(!isValidPassword){
  const error = new HttpError("invalid credentials could not log in",401)
  return next(error)
}



let token;
try{
token = await jwt.sign({
    userId : admin.id,
    email : admin.email
   },
    process.env.JWT_KEY,
    {expiresIn :'1h'}
    )

}
catch (err) {
const error = new HttpError(
  'LogIn failed, please try again.',
  500
);
return next(error);
} 
console.log("logged in");
res.json({ 
  message : 'admin logged in successful' , 
  userId : admin.id,
  email : admin.email , 
  token: token})

}

//get list of admin
const getAdminsList = async(req, res, next) => {

  let admins
  try{
      admins = await Admin.find()
  }
  catch(err){
      const error = new HttpError("can not fetch admins complete request",500)
      return next(error)
  }
  res.json({ admins : admins.map( admin => admin.toObject({ getters : true})) })
  
  }

  //Delete admins  ById
const deleteAdminById = async (req, res, next) => {
  const AdminId = req.params.aid;
  Admin.findByIdAndRemove(AdminId)
  .then((result) => {
    res.json({
      success: true,
      msg: `Admin has been deleted.`,
      result: {
        _id: result._id,
        name: result.name,
      }
    });
  })
  .catch((err) => {
    res.status(404).json({ success: false, msg: 'there is no Admin image to delete with provided id.' });
  });

};
  


//update user by id
const updateUserById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { status } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not found to  update user.',
      500
    );
    return next(error);
  }

  user.status = status;




  try {
    await user.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not update the  user status.',
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });

};

//Delete user  ById
const deleteUserById = async (req, res, next) => {
  const userID = req.params.uid;
  uSER.findByIdAndRemove(userID)
  .then((result) => {
    res.json({
      success: true,
      msg: `User has been deleted.`,
      result: {
        _id: result._id,
        name: result.name,
      }
    });
  })
  .catch((err) => {
    res.status(404).json({ success: false, msg: 'there is no User image to delete with provided id.' });
  });

};
    


//get list of users
const getUsersList = async(req, res, next) => {

let users
try{
    users = await User.find()
}
catch(err){
    const error = new HttpError("can not fetch users complete request",500)
    return next(error)
}
res.json({ users : users.map( user => user.toObject({ getters : true})) })

}

//get users count
const getUsersCount = async (req ,res ,next) => {


  let users
try{
    users = await User.find().countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch users complete request",500)
    return next(error)
}
res.json({ users : users})


}

//no of products
const getProductsCount = async (req ,res ,next) => {


  let products
try{
    products = await Product.find().countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch products complete request",500)
    return next(error)
}
res.json({ products : products})


}

//no of feautured products
const getFeauturedProductsCount = async (req ,res ,next) => {


  let products
try{
    products = await Product.find({isFeatured : true }).countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch products complete request",500)
    return next(error)
}
res.json({ products : products})


}

//no of Payments
const getPaymentsCount = async (req ,res ,next) => {


  let payments
try{
    payments = await Payment.find().countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch payments complete request",500)
    return next(error)
}
res.json({ payments : payments})


}


//postBannerImages
const postBannerImages = async (req ,res , next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, image, isFeatured, isShow } = req.body;

  const createdBanner = new Banner({
    title,
    description,
    image: req.file.path,
    isFeatured,
    isShow,
  });


  try {
    await createdBanner.save()
  }
catch(err){
  console.log(err)
  const error = new HttpError(
    'Creating product failed, please try again.',
    500
  );
  return next(error);
}
res.json({ Banner : createdBanner })
}


//update banner by id
const updateBannerById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { title , description } = req.body;
  const bannerId = req.params.bid;

  let banner;
  try {
    banner = await Banner.findById(bannerId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not found to  update banner.',
      500
    );
    return next(error);
  }

  banner.title = title;
  banner.description = description;
  banner.image = req.file.path;






  try {
    await banner.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not update the  banner status.',
      500
    );
    return next(error);
  }

  res.status(200).json({ banner: banner.toObject({ getters: true }) });

};

//update banner by id
const updateAdvertisementById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { title , description } = req.body;
  const addId = req.params.bid;

  let add;
  try {
    add = await Advertisement.findById(addId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not found to  update Addvertisement.',
      500
    );
    return next(error);
  }

  add.title = title;
  add.description = description;
  add.image = req.file.path;
  try {
    await add.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not update the  addvertisement.',
      500
    );
    return next(error);
  }

  res.status(200).json({ add: add.toObject({ getters: true }) });

};


//get bannerImgs
const getBannerImages = async (req, res ,next) => {
  let BannerImages
  try{
      BannerImages = await Banner.find().sort({_id:1}).limit(5);
  }
  catch(err){
      const error = new HttpError("can't fetch banner images ",500)
      return next(error)
  }
  res.json({ bannerImages : BannerImages.map( Banner => Banner.toObject({ getters : true}))})
}

//Delete Banner Images ById
const deleteBannerImageById = async (req, res, next) => {
  const BannerId = req.params.bid;
  Banner.findByIdAndRemove(BannerId)
  .then((result) => {
    res.json({
      success: true,
      msg: `Banner has been deleted.`,
      result: {
        _id: result._id,
        title: result.title,
      }
    });
  })
  .catch((err) => {
    res.status(404).json({ success: false, msg: 'there is no Banner image to delete with provided id.' });
  });

};


//Delete Banner Images ById
const deleteAddsImageById = async (req, res, next) => {
  const AddsId = req.params.aid;
  Advertisement.findByIdAndRemove(AddsId)
  .then((result) => {
    res.json({
      success: true,
      msg: `Add has been deleted.`,
      result: {
        _id: result._id,
        title: result.title,
      }
    });
  })
  .catch((err) => {
    res.status(404).json({ success: false, msg: 'there is no Add image to delete with provided id.' });
  });

};


//postAdvertisementImages
const postAdvertisementImages = async (req ,res , next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, image, isFeatured, isShow } = req.body;

  const createdAdvertisementImage = new Advertisement({
    title,
    description,
    image : req.file.path ,
    isFeatured,
    isShow,
  });


  try {
    await createdAdvertisementImage.save()
  }
catch(err){
  console.log(err)
  const error = new HttpError(
    ' uploading failed, please try again.',
    500
  );
  return next(error);
}
res.json({ Advertisement : createdAdvertisementImage })
}

//get bannerImgs
const getAdvertisementImages = async (req, res ,next) => {
  let addImages
  try{
      addImages = await Advertisement.find().sort({_id:1}).limit(5);
  }
  catch(err){
      const error = new HttpError("can't fetch addvertisement images ",500)
      return next(error)
  }
  res.json({ advertisementImages : addImages.map( Imgs => Imgs.toObject({ getters : true}))})
}

//get Banner Images ById
const getBannerImageById = async (req, res, next) => {
  const bannerId = req.params.bid; //(objectidofbanner)

  let banner;
  try {
      banner  = await Banner.findById(bannerId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a banner.',
      500
    );
    return next(error);
  }

  if (!banner) {
    const error = new HttpError(
      'Could not find a banner for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ banner : banner.toObject({ getters: true }) });
};

//post add category 
const addCategory = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { subcategory , category} = req.body;
  
  //const a= [{ cat :[ `${subcategory}`] }]
  //const fruits = await [`"${productIds}"`];
   //const category = await [`${subcategory}`]
   let subs = []
   subs = subcategory.split(',')
   console.log(subs)

  const createdCategory = new Category({
     categoryId: uuid(),
     category,
     subcategory:subs
     
  });

 
  try {
      await createdCategory.save();
    } catch (err) {
      const error = new HttpError(
        'Creating Category failed, please try again.',
        500
      );
      console.log(err)
      return next(error);
    }


  res.status(201).json({ category: createdCategory });
}

//post add subcategory 
const addSubCategory = async(req, res, next) => {
   const categoryId = req.params.cid;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { subcategory  ,category} = req.body;
  
  //const a= [{ cat :[ `${subcategory}`] }]
  //const fruits = await [`"${productIds}"`];
   //const category = await [`${subcategory}`]
  

   let foundcategory;
   try {
    foundcategory = await Category.findById(categoryId);
   } catch (err) {
     const error = new HttpError(
       'Something went wrong, could not update .',
       500
     );
     return next(error);
   }
   
   let subs = []
   subs = subcategory.split(',')
   console.log(subs)
   foundcategory.subcategory =subs;
   foundcategory.category = category;

  
 
   try {
     await foundcategory.save();
   } catch (err) {
     console.log(err)
     const error = new HttpError(
       'Something went wrong, could not update the  category.',
       500
     );
     return next(error);
   }
 
   res.status(200).json({ category: foundcategory.toObject({ getters: true }) });

   
}

//get subCategory by id
const getSubCategories = async (req, res, next) => {
  const findCategory = req.params.cid;

  let category
  try{
    category = await Category.find({ _id : `${findCategory}` })
  }
  catch(err){
      const error = new HttpError("can't fetch category complete request",500)
      return next(error)
  }
  res.json({ subcategories : category.map( category => category.subcategory)})
  
}


//get list of category 
const getCategories = async (req, res, next) => {
  let category
  try{
    category = await Category.find()
  }
  catch(err){
      const error = new HttpError("can't fetch plans complete request",500)
      return next(error)
  }
  res.json({ categories : category.map( category => category.toObject({ getters : false}))})
  
}

//DELETE category by id
const deleteCategoryByID= async (req, res, next) => {
  const categoryId = req.params.cid;
  Category.findByIdAndRemove(categoryId)
  .then((result) => {
    res.json({
      success: true,
      msg: `category has been deleted.`
    });
  })
  .catch((err) => {
    res.status(404).json({ success: false, msg: 'there is no categoryId to delete with provided id.' });
  });

};



//get list of plans 
const getPlansList = async (req, res, next) => {
    let plans
    try{
        plans = await Plan.find()
    }
    catch(err){
        const error = new HttpError("can't fetch plans complete request",500)
        return next(error)
    }
    res.json({ plans : plans.map( plans => plans.toObject({ getters : true}))})
    
  }
  
  
  

// post plan 
const createPlan = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { title, description, amount,type, posts } = req.body;
  
 
  
    const createdPlan = new Plan({
      title,
      description,
      amount,
      posts,
      type
    });
  
   
    try {
        await createdPlan.save();
      } catch (err) {
        const error = new HttpError(
          'Creating Plan failed, please try again.',
          500
        );
        console.log(err)
        return next(error);
      }

  
    res.status(201).json({ plan: createdPlan });
  };
  

//update plan
const updatePlan = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { title, description  , posts, amount , plantype} = req.body;
    
   //  const planId = req.params.pid;
    let plan;
    try {
      plan = await Plan.findOneAndUpdate({type : plantype});
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update plan.',
        500
      );
      return next(error);
    }
  
    plan.title = title;
    plan.description = description;
    plan.posts = posts;
    plan.amount = amount;
  
    try {
      await plan.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, couldnt update plan.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ plan: plan.toObject({ getters: true }) });
  };
  
//DELETE PLAN
  const deletePlan = async (req, res, next) => {
    const planId = req.params.pid;
    Plan.findByIdAndRemove(planId)
    .then((result) => {
      res.json({
        success: true,
        msg: `plan has been deleted.`,
        result: {
          _id: result._id,
          title: result.title,
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'there is no plan to delete with provided id.' });
    });

  };


  //update product
  const updateProductVisiblity = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    const productId = req.params.pid;

    const { isShow } = req.body;
  
    let product;
    try {
      product = await Product.update(
        { productid : productId },
        {
          isShow 
        }
      );

    } catch (err) {
      console.log(err)
      const error = new HttpError(
        'Something went wrong, could not upda;te product.',
        500
      );
      return next(error);
    }
   
    product.isShow = isShow;
  
    try {
      await product.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update product.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ product: product.toObject({ getters: true }) });
  };
  
//update product by id
const updatePlanById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { title, description,visbility,amount, posts, type } = req.body;
  const planId = req.params.pid;

  let plan;
  try {
    plan = await Plan.findById(planId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not found to  update plan.',
      500
    );
    return next(error);
  }

  plan.title = title;
  plan.description = description;
  plan.visbility = visbility;
  plan.amount = amount;
  plan.posts = posts;
  plan.type =type;



  try {
    await plan.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not update the  plan.',
      500
    );
    return next(error);
  }

  res.status(200).json({ plan: plan.toObject({ getters: true }) });

};

// post product 

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);

 const files = req.files.imgOptOne;
 const fileSingle = req.files.image;

 let finalImages = []
 let SingleFilePath 
 let imgPath ;

 
 if(files){

  files.forEach(img => {
    console.log(img.path)
     imgPath = img.path;
    finalImages.push(imgPath)
  })
}

if(!fileSingle){
  const error = new Error("please single choose files");
  return next(error)
}

fileSingle.forEach(img => {
  console.log(img.path)
   imgPath = img.path;
   SingleFilePath = imgPath
})




  if (!errors.isEmpty()) {

    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, modelNumber, category , subcategory , recommendCategory, recommendSubcategory ,isFeatured, quantity , status} = req.body;

   const creator  = "60f91a6b0b885e087a20cf51";


 let RecommendSubs = []
 RecommendSubs = recommendSubcategory.split(',')
 console.log(RecommendSubs)


  let user;
  try {
      user = await User.findById(creator);
    }
       catch (err) {
    const error = new HttpError('Creating product failedl, please try again', 500);
    console.log("error ")
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

 const Nickname = user.nickname;
 const Country = user.country;
 const CountryTwoLetterCode = user.countryTwoLetterCode;


   
 const createdProduct = new Product({
  title,
  description,
  modelNumber,
  category,
  subcategory,
  recommendCategory,
  recommendSubcategory: RecommendSubs,
  image:SingleFilePath,
  imgOptOne :finalImages,
  creator,
  isFeatured,
  quantity,
  status,
  nickname : Nickname,
  country : Country,
  countryTwoLetterCode : CountryTwoLetterCode,
  productid : uuid() 
});


 
   //check if userwants to feauture product or not if he wants to feature product then his balance will be deducted by -2 if he doesnt then -1
      
    if(isFeatured === "true"){
     console.log("isFeautured is "+isFeatured)
     try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdProduct.save({ session: sess });
      user.inventory.push(createdProduct);
      await user.save({ session: sess });
      await sess.commitTransaction();
   
      await User.findByIdAndUpdate({ _id : creator }, { userType : "Vendor"  , isFeatured : true });



    } catch (err) {
        console.log(err)
      const error = new HttpError(
        'Creating product failed, please try again.',
        500
      );
      return next(error);
    }
  
    res.status(201).json({ product: createdProduct });
    }
    else {

        
   
      console.log("isFeautured is "+isFeatured)
      try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdProduct.save({ session: sess });
        user.inventory.push(createdProduct);
        await user.save({ session: sess });
        await sess.commitTransaction();
     
        await User.findByIdAndUpdate({ _id : creator }, {  userType : "Vendor" , isFeatured : false });
  
  
  
      } catch (err) {
          console.log(err)
        const error = new HttpError(
          'Creating product failed, please try again.',
          500
        );
        return next(error);
      }
    
      res.status(201).json({ product: createdProduct });
     }

 
};


//show category list

const CategoryList = async (req, res , next) => {


  //const creator = req.userData.userId;

 let categories;
 try {
  categories = await Category.find({} ,{ category: 1, categoryId: 1 });
   }
      catch (err) {
   const error = new HttpError('fetching failed, please try again', 500);
   console.log(err)
   return next(error);
 }

 if (!categories) {
   const error = new HttpError('Could not find categories', 404);
   return next(error);
 }
 
let categoriesArray = []
categoriesArray.push(categories)

 res.status(200).json({ Categories:  categoriesArray});

}

//show SubCategory list

const SubCategoryList = async (req, res , next) => {

  const Cid = req.query.CId;
   
  //let Cid = "mobiles"
  
  //const creator = req.userData.userId;

 let Subcategories;
 try {
  Subcategories = await Category.find({ category : `${Cid}` },{subcategory:1,categoryId:1});
   }

      catch (err) {
   const error = new HttpError('fetching failed, please try again', 500);
   console.log(err)
   return next(error);
 }

 if (!Subcategories) {
   const error = new HttpError('Could not find Subcategories', 404);
   return next(error);
 }
 
let SubcategoriesArray = []
SubcategoriesArray.push(Subcategories)

 res.status(200).json({ SubCategories:  SubcategoriesArray});

}







const  updateAdminPassword = async(req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      console.log(errors);
      const error =  new HttpError("invalid input are passed,please pass valid data",422)
      return next(error)
  }
  const { email, oldpassword , newpassword } = req.body;

  let user
  try{
       user = await Admin.findOne({ email : email  })
  }
  catch(err){
      const error = await new HttpError("something went wrong,update password in failed",500)
      return next(error)
  }

  if(!user){
      const error = new HttpError("user not found could not update password",401)
      return next(error)
  }

 let isValidPassword = false; 
 try{
       isValidPassword = await bcrypt.compare(oldpassword, user.password)
 }
 catch(err){
  const error = await new HttpError("invalid password try again",500)
  return next(error)
}


if(!isValidPassword){
  const error = new HttpError("invalid old password could not update newpassword",401)
  return next(error)
}

let hashedPassword;

try{
hashedPassword = await bcrypt.hash(newpassword, 12)
let founduser;
founduser = await Admin.findOne({ email : email  })

let updatedRecord = {
   password: hashedPassword
}

Admin.findByIdAndUpdate(founduser, { $set: updatedRecord },{new:true}, (err, docs) => {
   if (!err) res.json({mesage : "password updated sucessfully"})
   else console.log('Error while updating a record : ' + JSON.stringify(err, undefined, 2))
})
} 
catch(err){
  const error = new HttpError("could not updated hash of user ",500);
  return next(error)
}


}




  exports.createPlan = createPlan ;
  exports.getPlansList = getPlansList;
  exports.updatePlan = updatePlan;
  exports.deletePlan = deletePlan;
  exports.updateProductVisiblity = updateProductVisiblity;

  exports.postBannerImages = postBannerImages;
  exports.getBannerImages = getBannerImages;
  exports.getBannerImageById = getBannerImageById;

  exports.deleteAddsImageById = deleteAddsImageById;
  exports.deleteBannerImageById = deleteBannerImageById;
  exports.updateBannerById = updateBannerById;

  exports.postAdvertisementImages = postAdvertisementImages;
  exports.getAdvertisementImages = getAdvertisementImages;
  exports.updateAdvertisementById = updateAdvertisementById;
 
  exports.addCategory = addCategory;
  exports.getCategories = getCategories;
  exports.addSubCategory = addSubCategory;

  exports.deleteCategoryByID = deleteCategoryByID;
  exports.getSubCategories = getSubCategories;

  exports.getUsersList = getUsersList;
  exports.updatePlanById = updatePlanById;
  exports.getUsersCount = getUsersCount;
  exports.getProductsCount = getProductsCount;
  exports.getFeauturedProductsCount = getFeauturedProductsCount;
  exports.getPaymentsCount = getPaymentsCount;

  exports.createAdmin = createAdmin;
  exports.adminLogin = adminLogin;
  exports.updateAdminPassword = updateAdminPassword;
  exports.getAdminsList = getAdminsList;
  exports.deleteAdminById = deleteAdminById;

  exports.updateUserById = updateUserById;
  exports.deleteUserById = deleteUserById;

  exports.createProduct = createProduct;

  exports.CategoryList = CategoryList;
  exports.SubCategoryList = SubCategoryList;