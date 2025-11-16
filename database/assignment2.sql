-- 1 Create Tony Stark Account

INSERT INTO public.account 
(
    account_firstname,
    account_lastname,
    account_email, 
    account_password
)
VALUES 
(
    'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n'
);

-- 2 Modify Account Type to Admin
UPDATE public.account 
SET account_type = 'Admin' 
WHERE account_email = 'tony@starkent.com';


-- 3 Delete Tony from the db
DELETE FROM public.account 
WHERE account_email = 'tony@starkent.com';

-- 4 Modify GM Hummer record to read "a huge interior"
UPDATE public.inventory 
SET inv_description = 'Do you have 6 kids and like to go offroading? The Hummer gives you the huge interiors with an engine to get you out of any muddy or rocky situation.'
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5 Use an inner join to select make and model fields from inventory and classification
SELECT inv_make, inv_model, classification_name
FROM public.inventory i
INNER JOIN public.classification c
    ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6 Update all records in the inventory table to add "/vehicles" to the middle of the file path in image and thumbnail
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'), 
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');

-- 7 Copy Paste 4 and 6 to db rebuild file