# APIDocs PayOman

Trade Api Routes

## Installation

OS X & Linux:

```sh
npm install
```
## Open Endpoints
Open endpoints require no Authentication.

LIVE URL : https://tradeappapi.herokuapp.com/

* [HomePage](login.md) : `POST /`

## User Routes

* [userSignup] : `POST /api/user/signup`

fields:

```sh
name :
email :
password : 
country :
nationality :
nickname :
countryCode :
phoneNumber :
```

 

* [merchantSignup] : `POST /api/user/login`

  merchant signup:

```sh
email:
password:
```


* [updatePassword] : `POST /api/user/updatePassword`

update password fields:

```sh
email:
oldpassword:
newpassword:
```


   

* [postItem] : `POST /api/user/postItem`

type : protected Route (require a bearer Token while testing on postman )
pass token : 'tokenValue'

after login (creator) -> from req.userData -> from jwt token


```sh
 title : 
 description :
 modelNumber :
 category :
 subcategory :
 isFeatured :
 quantity :
```
      

## Product Routes
 
get list of products

* [GetListOfProducts] :     `GET /api/product/list`
     
response will be list of products 


* [FeauturedProducts] : `GET /api/product/featuredproducts`

type : Response will be list of feautured Products


* [getProductsByCategory] : `GET /api/product/category/:cid`  

cid : req.parms
where cid is a type of category 
ex : category/:books

   Response : will be list of items which follows under this cid (category)


* [getListofProductsBasedOnUserId] : `GET /api/product/:uid`

  
 Uid : req.query.params
 Uid : is creatorId (uniquie)
 Response : getList of Products by Based on user id (creator)



* [updateProductBasedOnProductId] : `PATCH /api/product/:pid`

 pid : req.query.params
 pid : is productId (uniquie)
 Response : get single Product by Based on product id

* [deleteProductBasedOnProductId] : `DELETE /api/product/:pid`

 pid : req.query.params
 pid : is productId (uniquie)
 DELETE single Product by Based on product id



## DevelopedByCodeSoftic
