-- Create role if it doesn't exist
DO $$ BEGIN IF NOT EXISTS (
    SELECT
    FROM pg_roles
    WHERE rolname = 'cse340_starter'
) THEN CREATE ROLE cse340_starter WITH LOGIN PASSWORD 'your_secure_password';
END IF;
END $$;
-- Create ENUM type for account_type
CREATE TYPE public.account_type AS ENUM ('Client', 'Employee', 'Admin');
ALTER TYPE public.account_type OWNER TO cse340_starter;
-- Create classification table
CREATE TABLE public.classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR NOT NULL
);
-- Create inventory table
CREATE TABLE public.inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR NOT NULL,
    inv_model VARCHAR NOT NULL,
    inv_year CHAR(4) NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR NOT NULL,
    inv_thumbnail VARCHAR NOT NULL,
    inv_price NUMERIC(9, 0) NOT NULL,
    inv_miles INT NOT NULL,
    inv_color VARCHAR NOT NULL,
    classification_id INT NOT NULL,
    CONSTRAINT fk_classification FOREIGN KEY (classification_id) REFERENCES public.classification (classification_id) ON UPDATE CASCADE ON DELETE NO ACTION
);
-- Create account table
CREATE TABLE public.account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR NOT NULL,
    account_lastname VARCHAR NOT NULL,
    account_email VARCHAR NOT NULL,
    account_password VARCHAR NOT NULL,
    account_type account_type NOT NULL DEFAULT 'Client'
);
-- Insert classification data
INSERT INTO public.classification (classification_name)
VALUES ('Custom'),
    ('Sport'),
    ('SUV'),
    ('Truck'),
    ('Sedan');
-- Insert inventory data
INSERT INTO public.inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )
VALUES (
        'Chevy',
        'Camaro',
        '2018',
        'Great performance at an affordable price.',
        '/images/camaro.jpg',
        '/images/camaro-tn.jpg',
        25000,
        101222,
        'Silver',
        2
    ),
    (
        'Batmobile',
        'Custom',
        '2007',
        'Switch to bike mode for rush hour.',
        '/images/batmobile.jpg',
        '/images/batmobile-tn.jpg',
        65000,
        29887,
        'Black',
        1
    ),
    (
        'FBI',
        'Surveillance Van',
        '2016',
        'Comes with surveillance equipment.',
        '/images/survan.jpg',
        '/images/survan-tn.jpg',
        20000,
        19851,
        'Brown',
        1
    ),
    (
        'Dog',
        'Car',
        '1997',
        '90s Dog Car with fluffy ears.',
        '/images/dog-car.jpg',
        '/images/dog-car-tn.jpg',
        35000,
        71632,
        'White',
        1
    ),
    (
        'Jeep',
        'Wrangler',
        '2019',
        'Compact and powerful for offroading.',
        '/images/wrangler.jpg',
        '/images/wrangler-tn.jpg',
        28045,
        41205,
        'Yellow',
        3
    ),
    (
        'Lamborghini',
        'Adventador',
        '2016',
        'V-12 engine packs a punch.',
        '/images/adventador.jpg',
        '/images/adventador-tn.jpg',
        417650,
        71003,
        'Blue',
        2
    ),
    (
        'Aerocar International',
        'Aerocar',
        '1963',
        'Converts into an airplane.',
        '/images/aerocar.jpg',
        '/images/aerocar-tn.jpg',
        700000,
        18956,
        'Red',
        1
    ),
    (
        'Monster',
        'Truck',
        '1995',
        '60 inch tires for mud fun.',
        '/images/monster-truck.jpg',
        '/images/monster-truck-tn.jpg',
        150000,
        3998,
        'Purple',
        1
    ),
    (
        'Cadillac',
        'Escalade',
        '2019',
        'Luxurious and stylish.',
        '/images/escalade.jpg',
        '/images/escalade-tn.jpg',
        75195,
        41958,
        'Black',
        4
    ),
    (
        'GM',
        'Hummer',
        '2016',
        'Huge interior for offroading with kids.',
        '/images/hummer.jpg',
        '/images/hummer-tn.jpg',
        58800,
        56564,
        'Yellow',
        4
    ),
    (
        'Mechanic',
        'Special',
        '1964',
        'Needs TLC to run well.',
        '/images/mechanic.jpg',
        '/images/mechanic-tn.jpg',
        100,
        200125,
        'Rust',
        5
    ),
    (
        'Ford',
        'Model T',
        '1921',
        'First production car, only in black.',
        '/images/model-t.jpg',
        '/images/model-t-tn.jpg',
        30000,
        26357,
        'Black',
        5
    ),
    (
        'Mystery',
        'Machine',
        '1999',
        'Scooby van with 4WD.',
        '/images/mystery-van.jpg',
        '/images/mystery-van-tn.jpg',
        10000,
        128564,
        'Green',
        1
    ),
    (
        'Spartan',
        'Fire Truck',
        '2012',
        'Comes with hose and tank.',
        '/images/fire-truck.jpg',
        '/images/fire-truck-tn.jpg',
        50000,
        38522,
        'Red',
        4
    ),
    (
        'Ford',
        'Crown Victoria',
        '2013',
        'Ex-police car with siren.',
        '/images/crwn-vic.jpg',
        '/images/crwn-vic-tn.jpg',
        10000,
        108247,
        'White',
        5
    );
-- Update GM Hummer description
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Update image paths to include /vehicles
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');