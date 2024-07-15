-- user

-- insert user
INSERT INTO users (username,password, email, image)
VALUES (
    'Hamza', --username
	'alikezainab', --password
    'alihamzabrw52@gmail.com', --email
    'https://example.com/profile_image.jpg' --image
);
--update user
UPDATE Users
SET username = 'Hamza',
    password = 'hamzag',
    email = 'alihamzabrw52@gmail.com',
    image = 'https://example.com/profile_image.jpg'
WHERE userId = 2;
-- delete user by userId
DELETE FROM Users WHERE userId = 2;



--cuisine

-- select cuisine on the base of cuisineID
SELECT * FROM cuisines WHERE cuisineid=2;
-- select cuisine on the base of userId
SELECT * FROM cuisines WHERE userId=2;
-- select cuisine on the base of name
SELECT * FROM Cuisines WHERE name = 'Bryani';
-- insert into cuisines
INSERT INTO cuisines (name, description, country, value, userId) VALUES ('Yougart', 'A flavorful rice dish with spices and meat or vegetables.', 'Pakistan', 'PK', 2);
-- update cuisine on the base of cuisineID
UPDATE cuisines SET name = 'Updated Name', description = 'Updated description.', country = 'Updated Country', value = 'Updated Value', userId = 2 WHERE cuisineId = 2;
-- Delete Cuisines by name and userId
DELETE FROM Cuisines WHERE name = 'Biryani' AND userId = 2;
-- Delete Cuisines by recipeId
DELETE FROM Cuisines WHERE cuisineid=2;


-- restaurant
CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    user_id INT REFERENCES users(user_id),
    cuisine_id INT REFERENCES cuisine(cuisine_id),
    rating FLOAT CHECK (rating >= 1.0 AND rating <= 5.0),
    notes TEXT,
    image VARCHAR(255)
);

-- select restaurant on the base of restaurantId

SELECT * FROM restaurants WHERE restaurantId=2;

-- select restaurant on the base of userId

SELECT * FROM restaurants WHERE userId=2;

-- select restaurant on the base of name

SELECT * FROM restaurants WHERE name = 'Pizza Hut';

-- insert into restaurants
INSERT INTO restaurants (name, location, userId, cuisineId, rating, notes, image)
VALUES (
    'El Ranchero',
    '1010 Maple Drive, Smalltown',
    1,
    3,
    4.0,
    'Authentic Mexican flavors.',
    'https://example.com/el_ranchero.jpg'
);

-- update restaurant on the base of restaurantId
UPDATE restaurants
SET 
	name = 'Cool & night',
	location = 'Burewala',
    userId = 1,
    cuisineId = 1,
    rating = 4.6,
    notes = 'Updated notes about the restaurant.',
    image = 'https://example.com/new_image.jpg'
WHERE restaurantId=1;
-- delete restaurant by restaurantId
DELETE FROM restaurants WHERE restaurantId=1;
-- delete restaurant by userId
DELETE FROM restaurants WHERE userId=1;


-- recipe

-- select recipe on the base of recipeId

SELECT * FROM recipes WHERE recipeId=2;
-- select recipe on the base of userId
SELECT * FROM recipes WHERE userId=2;
-- select recipe on the base of name
SELECT * FROM recipes WHERE name = 'Rice Pilaf';
-- select recipe on the base of restaurantId
SELECT * FROM recipes WHERE restaurantId=2;

-- search and filters --

-- select recipe on the base of name
SELECT * FROM recipes WHERE name LIKE '%Rice Pilaf%';

-- select recipe on the base of restaurant name
SELECT r.* 
FROM Recipes r
JOIN Restaurants rest ON r.restaurantId = rest.restaurantId
WHERE rest.name LIKE '%Cool & night%';
-- select recipe on the base of ingredients
SELECT * 
FROM Recipes 
WHERE 'onion' = ANY (ingredients);

-- select recipe on the base of tags
SELECT * 
FROM Recipes 
WHERE 'spicy' = ANY (tags);


-- insert recipe
INSERT INTO recipes (name, ingredients, steps, notes, tags, image,userId,restaurantId)
VALUES (
    'Rice Pilaf',
    '{"rice", "chili", "water"}',
    '{"gass", "burn", "water", "eat"}',
    'Rice is yummy.',
    '{"rice", "biryani"}',
    'https://firebasestorage.googleapis.com/v0/b/practiceimageupload.appspot.com/o/Recipedia%2Fe07b7519-4dde-488a-8063-3b56514ef49d?alt=media&token=1adc7a6f-2f11-40a7-9377-6cbc6f33850b',
	1,
	1
);

-- update recipe on the base of recipeId
UPDATE recipes
SET 
	name = 'Beaf Palo',
	ingredients = '{"rice", "chicken", "water", "onion", "spices"}',
    steps = '{"Rinse rice", "Cook chicken", "Add water and spices", "Simmer until done"}',
    notes = 'Delicious rice dish with chicken and spices.',
    tags = '{"rice", "chicken", "spicy"}',
    image = 'https://newimageurl.com/new_recipe_image.jpg',
	userId = 1,
	restaurantId=1
WHERE recipeId=2;

-- delete recipe by recipeId
DELETE FROM recipes WHERE recipeId=2;

-- review selected

-- select review on the base of reviewId
SELECT * FROM reviews WHERE reviewId=2;

-- select review on the base of userId

SELECT * FROM reviews WHERE userId=2;

-- select review on the base of recipeId

SELECT * FROM reviews WHERE recipeId=2;

-- insert review
INSERT INTO Reviews (userId, recipeId, rating, content, date)
VALUES (
    4, 
    2, 
    4.5, 
    'Great food and excellent service!',
    '2024-07-09'
);

-- update review on the base of reviewId
UPDATE reviews
SET
    rating = 2,
    content = 'Updated review content.',
    date = '2024-07-10',
    userId = 4,
    recipeId = 2
WHERE reviewId = 2;

-- delete review by reviewId
DELETE FROM reviews WHERE reviewId=2;