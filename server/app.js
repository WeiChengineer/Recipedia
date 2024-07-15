const express = require("express");
const cors = require("cors");
const pool = require("./database/db.js");
const { hash } = require("bcryptjs");
const { hashPassword, validatePassword } = require("./utilities/bcrypt.js");
const createToken = require("./utilities/createToken.js");
const createCookie = require("./utilities/createCookie.js");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// get all users
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json({
      status: 200,
      data: result.rows,
    });

    if (result.rows.length !== 0) {
      return res.status(200).json({
        status: 200,
        data: result.rows,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
  } catch (err) {
    console.error(err.message);
  }
});

// post admin login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = `
  SELECT * FROM users WHERE email LIKE '%${
    email.split("@")[0]
  }%' AND email LIKE '%gmail.com%' AND email LIKE '%@%';
`;
    const result = await pool.query(query);

    if (result.rows.length === 0)
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });

    const { password: existingPassword, userid } = result.rows[0];
    const isMatch = await validatePassword(password, existingPassword);

    if (!isMatch)
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });

    const token = createToken({ email });
    res.json({
      status: 200,
      cookie: { token, userid },
      redirect: "/",
    });
  } catch (err) {
    console.error(err.message);
  }
});

// get single user

app.post("/api/users/addUser", async (req, res) => {
  try {
    const { username, password, email, profileImage } = req.body;

    const isUserExist = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (isUserExist.rowCount > 0) {
      return res.status(400).json({
        status: 400,
        message: "User already exists",
      });
    }

    const hashed = await hashPassword(password);

    const newUser = await pool.query(
      `INSERT INTO users (username, password, email, image) VALUES ($1, $2, $3, $4) RETURNING *`,
      [username, hashed, email, profileImage]
    );

    if (newUser.rowCount === 0) {
      return res.status(404).json({
        status: 404,
        message: "Invalid user data",
      });
    }

    console.log("user add success", newUser);

    res.json({
      status: 200,
      redirect: "/auth/login",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
});

// create user
app.post("/api/users/addUser", async (req, res) => {
  try {
    console.log("i am calling");
    const { username, password, email, image } = req.body;
    // const hashed = await hashPassword(password);

    const user = await pool.query(
      `SELECT * FROM users WHERE email LIKE '%${
        email.split("@")[0]
      }%' AND email LIKE '%gmail.com%' AND email LIKE '%@%';`
    );

    if (user.rowsAffected > 0) {
      return res.status(400).json({
        status: 400,
        message: "User already exists",
      });
    }

    // console.log("user is",user);

    // const newUser = await pool.query(
    //   `INSERT INTO users (username,password, email, image) VALUES ( '${username}', '${hashed}', '${email} ','${image} ');`
    // );

    // if (newUser.rowsAffected === 0) {
    //   return res.status(404).json({
    //     status: 404,
    //     message: "Invalid user data",
    //   });
    // }

    // res.json({
    //   status: 200,
    //   redirect: "/auth/login",
    // });
  } catch (err) {
    console.error(err.message);
  }
});

// update user
app.put("/api/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { username, email, password, image } = req.body;

    const updatedUser = await pool.query(
      `UPDATE users SET username='${username}', email='${email}', password='${password}' , image='${image}' WHERE userId=${id};`
    );

    if (updatedUser.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    res.json({
      status: 200,
      data: updatedUser.rows[0],
    });
  } catch (err) {
    console.error(err.message);
  }
});

// delete user

// app.delete("/api/users/:id", async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     const deletedUser = await pool.query(`DELETE FROM users WHERE userId = ${id}`);

//     if (deletedUser.rowsAffected === 0) {
//       return res.status(404).json({
//         status: 404,
//         message: "User not found",
//       });
//     }

//     res.json({
//       status: 200,
//       message: "User deleted successfully",
//     });
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// Get Restaurants

app.get("/api/restaurants", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM restaurants");
    res.json({
      status: 200,
      data: result.rows,
    });

    if (result.rows.length !== 0) {
      return res.status(200).json({
        status: 200,
        data: result.rows,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "Restaurant not found",
      });
    }
  } catch (err) {
    console.error(err.message);
  }
});

// get single restaurant

app.get("/api/restaurants/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      `SELECT * FROM restaurants WHERE restaurantId = ${id}`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Restaurant not found",
      });
    }

    res.json({
      status: 200,
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
  }
});

//get restaurant recipes
app.get("/api/resturants/recipes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      `SELECT * FROM recipes WHERE restaurantId = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Recipe not found",
      });
    }

    res.json({
      status: 200,
      data: result.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// create restaurant

app.post("/api/restaurants/addRestaurant", async (req, res) => {
  try {
    const { name, location, userId, cuisineId, rating, notes, image } =
      req.body;

    console.log(
      "object",
      name,
      location,
      userId,
      rating,
      notes,
      image,
      cuisineId
    );

    const newRestaurant = await pool.query(
      `INSERT INTO restaurants (name, location, userId, cuisineId, rating, notes, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, location, userId, cuisineId, rating, notes, image]
    );

    if (newRestaurant.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "Invalid restaurant data",
      });
    }

    res.json({
      status: 200,
      data: newRestaurant.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// update restaurant
app.put("/api/restaurants/updateRestaurant/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, location, userId, cuisineId, rating, notes, image } =
      req.body;

    const updatedRestaurant = await pool.query(
      `UPDATE restaurants SET name=$1, location=$2, userId=$3, cuisineId=$4, rating=$5, notes=$6, image=$7 WHERE restaurantId=$8 RETURNING *`,
      [name, location, userId, cuisineId, rating, notes, image, id]
    );

    if (updatedRestaurant.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "Restaurant not found",
      });
    }

    res.json({
      status: 200,
      data: updatedRestaurant.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// delete restaurant

app.delete("/api/restaurants/deleteRestaurant/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedRestaurant = await pool.query(
      `DELETE FROM restaurants WHERE restaurantId=$1 RETURNING *`,
      [id]
    );

    if (deletedRestaurant.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "Restaurant not found",
      });
    }

    res.json({
      status: 200,
      message: "Restaurant deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// get cuisine

app.get("/api/cuisines", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cuisines");
    res.json({
      status: 200,
      data: result.rows,
    });

    if (result.rows.length !== 0) {
      return res.status(200).json({
        status: 200,
        data: result.rows,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "Cuisine not found",
      });
    }
  } catch (err) {
    console.error(err.message);
  }
});

// get single cuisine

app.get("/api/cuisines/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      `SELECT * FROM cuisines WHERE cuisineId = ${id}`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Cuisine not found",
      });
    }

    res.json({
      status: 200,
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
  }
});

// create cuisine

app.post("/api/cuisines/addCuisine", async (req, res) => {
  try {
    const { name, description, country, value, userId } = req.body;

    const newCuisine = await pool.query(
      `INSERT INTO cuisines (name , description , country , value ,userId) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, description, country, value, userId]
    );

    if (newCuisine.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "Invalid cuisine data",
      });
    }

    res.json({
      status: 200,
      data: newCuisine.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// update cuisine

app.put("/api/cuisines/updateCuisine/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, country, value, userId } = req.body;

    const updatedCuisine = await pool.query(
      `UPDATE cuisines SET name=$1, description=$2, country=$3, value=$4, userId=$5 WHERE cuisineId=$6 RETURNING *`,
      [name, description, country, value, userId, id]
    );

    if (updatedCuisine.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "Cuisine not found",
      });
    }

    res.json({
      status: 200,
      data: updatedCuisine.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// delete cuisine

app.delete("/api/cuisines/deleteCuisine/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log("id is " + id);
    const deletedCuisine = await pool.query(
      `DELETE FROM cuisines WHERE cuisineId=$1 RETURNING *`,
      [id]
    );

    if (deletedCuisine.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "Cuisine not found",
      });
    }

    res.json({
      status: 200,
      message: "Cuisine deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// get recipes

app.get("/api/recipes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recipes");
    res.json({
      status: 200,
      data: result.rows,
    });

    if (result.rows.length !== 0) {
      return res.status(200).json({
        status: 200,
        data: result.rows,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "Recipe not found",
      });
    }
  } catch (err) {
    console.error(err.message);
  }
});

// get single recipe

app.get("/api/recipes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      `SELECT * FROM recipes WHERE recipeId = ${id}`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Recipe not found",
      });
    }

    res.json({
      status: 200,
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
  }
});

// create recipe

app.post("/api/recipes/addRecipe", async (req, res) => {
  try {
    const {
      name,
      restaurantId,
      notes,
      userId,
      image,
      ingredients,
      steps,
      tags,
    } = req.body;

    const newRecipe = await pool.query(
      `INSERT INTO recipes ( name, restaurantid, notes, userid, image, ingredients, steps, tags) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, restaurantId, notes, userId, image, ingredients, steps, tags]
    );

    if (newRecipe.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "Invalid recipe data",
      });
    }

    res.json({
      status: 200,
      data: newRecipe.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// update recipe

app.put("/api/recipes/updateRecipe/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      name,
      restaurantid,
      notes,
      userid,
      image,
      ingredients,
      steps,
      tags,
    } = req.body;

    const updatedRecipe = await pool.query(
      `UPDATE recipes SET name=$1, restaurantid=$2, notes=$3, userid=$4, image=$5, ingredients=$6, steps=$7, tags=$8 WHERE recipeId=$9 RETURNING *`,
      [name, restaurantid, notes, userid, image, ingredients, steps, tags, id]
    );

    if (updatedRecipe.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "Recipe not found",
      });
    }

    res.json({
      status: 200,
      data: updatedRecipe.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// delete recipe

app.delete("/api/recipes/deleteRecipe/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedRecipe = await pool.query(
      `DELETE FROM recipes WHERE recipeId=${id}`
    );

    if (deletedRecipe.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "Recipe not found",
      });
    }

    res.json({
      status: 200,
      message: "Recipe deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// review
app.get("/api/reviews", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reviews");
    res.json({
      status: 200,
      data: result.rows,
    });

    if (result.rows.length !== 0) {
      return res.status(200).json({
        status: 200,
        data: result.rows,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "Review not found",
      });
    }
  } catch (err) {
    console.error(err.message);
  }
});
app.get("/api/reviews/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      `SELECT * FROM reviews where reviewid=${id}`
    );
    res.json({
      status: 200,
      data: result.rows,
    });

    if (result.rows.length !== 0) {
      return res.status(200).json({
        status: 200,
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "Review not found",
      });
    }
  } catch (err) {
    console.error(err.message);
  }
});

// get single review
app.get("/api/recipe/reviews/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      `SELECT * FROM reviews WHERE recipeid = ${id}`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Review not found",
      });
    }

    res.json({
      status: 200,
      data: result.rows,
    });
  } catch (err) {
    console.error(err.message);
  }
});

// create review

app.post("/api/reviews/addReview", async (req, res) => {
  try {
    const { content, rating, userid, recipeid, date } = req.body;

    const newReview = await pool.query(
      `INSERT INTO reviews (userid, recipeid, rating, content, date) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userid, recipeid, rating, content, date]
    );

    if (newReview.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "Invalid review data",
      });
    }

    res.json({
      status: 200,
      data: newReview.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// update review
app.put("/api/reviews/updateReview/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { content, rating, userid, recipeid, date } = req.body;

    const updatedReview = await pool.query(
      `UPDATE reviews SET content=$1, rating=$2, userid=$3, recipeid=$4, date=$5 WHERE reviewId=$6 RETURNING *`,
      [content, rating, userid, recipeid, date, id]
    );

    if (updatedReview.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "Review not found",
      });
    }

    res.json({
      status: 200,
      data: updatedReview.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// delete review
app.delete("/api/reviews/deleteReview/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedReview = await pool.query(
      `DELETE FROM reviews WHERE reviewId=${id}`
    );

    if (deletedReview.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "Review not found",
      });
    }

    res.json({
      status: 200,
      message: "Review deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// favorites

// get single user favorite
app.get("/api/favorites/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      `SELECT * FROM favorites f INNER JOIN	recipes r ON f.recipeid = r.recipeid where f.userid =  ${id}`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Favorite not found",
      });
    }

    res.json({
      status: 200,
      data: result.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// create favorite

app.post("/api/favorites/addFavorite", async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    console.log("Received data:", recipeId, userId);

    const newFavorite = await pool.query(
      `INSERT INTO favorites (userId, recipeId) VALUES ($1, $2) RETURNING *`,
      [userId, recipeId]
    );

    if (newFavorite.rowCount === 0) {
      return res.status(404).json({
        status: 404,
        message: "Invalid favorite data",
      });
    }

    res.json({
      status: 200,
      data: newFavorite.rows[0],
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// delete favorite

app.delete("/api/favorites/deleteFavorite/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedFavorite = await pool.query(
      `DELETE FROM favorites WHERE favoriteId=${id}`
    );

    if (deletedFavorite.rowsAffected === 0) {
      return res.status(404).json({
        status: 404,
        message: "Favorite not found",
      });
    }

    res.json({
      status: 200,
      message: "Favorite deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

app.post("/api/searchAndFilter", async (req, res) => {
  try {
    const { searchquery, tags, cuisine } = req.body;

    let query;

    if (searchquery !== "") {
      query = `
           SELECT 
            r.*, 
            rt.name as restaurant_name,
            rt.cuisineid,
            rt.location,
            rt.rating,
            rt.notes as restaurant_notes,
            rt.image as restaurant_image
          FROM 
            public.recipes r 
          JOIN 
            public.restaurants rt ON r.restaurantid = rt.restaurantid 
          JOIN 
            public.cuisines c ON rt.cuisineid = c.cuisineid
          WHERE(
              r.name ILIKE '%${searchquery}%'
            OR rt.name ILIKE '%${searchquery}%'
            OR array_to_string(r.ingredients,',') ILIKE '%${searchquery}%'
            )
        `;
    }

    if (tags !== "") {
      query += `AND array_to_string(r.tags,',') ILIKE '%${tags}%' `
    }

    if (cuisine !== undefined) {
      console.log("cuisine", cuisine);
      query += `AND rt.cuisineid = ${cuisine} `
    }

    console.log("query", query);

    const recipesBySearchQuery = await pool.query(query);

    if (recipesBySearchQuery.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Data not found",
      });
    }

    res.status(200).json({
      status: 200,
      data: recipesBySearchQuery.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

// const filterResult = await pool.query(`
// SELECT r.*
// FROM recipes r
// JOIN restaurants rt ON r.restaurantid = rt.restaurantid
// WHERE (r.name ILIKE '%${searchquery}%'
//   OR rt.name ILIKE '%${searchquery}%'
//   OR r.ingredients @> ARRAY['${searchquery}'])
//   AND '${tags}' = ANY (r.tags);
//   `);

// handle CORS

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, X-Requested-With"
//   );

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
