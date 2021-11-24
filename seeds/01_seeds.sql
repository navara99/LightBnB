INSERT INTO users
  (name, email, password)
VALUES
  ('Rhona Aguirre', 'Rhona-Aguirre@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
  ('Penny Dalby', 'Penny-Dalby@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
  ('Tariq Rosales', 'Tariq-Rosales@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
  ('Leroy Hart', 'jaycereynolds@inbox.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties
  (
  owner_id, title, description, thumbnail_photo_url, cover_photo_url,
  cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms,
  country, street, city, province, post_code, active
  )
VALUES
  (3, 'The Lodge' , 'description' , 'https://some-thumbnail.jpg',
    'https://some-coverPhoto.jpg', 150, 2, 2, 4, 'Canada', '544 Oak Lane', 'Toronto', 'Ontario', 'Z3Z 4E6', TRUE),
  (1, 'Chestnut House' , 'description' , 'https://some-thumbnail.jpg',
    'https://some-coverPhoto.jpg', 350, 2, 2, 1, 'USA', '149 Eva Pearl Street', 'Baton Rouge', 'Louisiana', '88333', TRUE)
,
  (1, 'Lazy Duck Villa' , 'description' , 'https://some-thumbnail.jpg',
    'https://some-coverPhoto.jpg', 500, 3, 5, 5, 'USA', '1025 Fincham Road', 'San Diego', 'California', '92103', TRUE)
,
  (2, 'Winterfell' , 'description' , 'https://some-thumbnail.jpg',
    'https://some-coverPhoto.jpg', 200, 3, 5, 5, 'Canada', '4396 Carlson Road', 'Prince George', 'British Columbia', 'V2L 5E5', TRUE);

INSERT INTO reservations
  (start_date, end_date, property_id, guest_id)
VALUES
  ('2020-05-23', '2020-05-27', 1, 4),
  ('2022-01-23', '2022-01-30', 2, 4),
  ('2022-08-12', '2022-08-24', 3, 3);

INSERT INTO property_reviews
  (
  reservation_id, property_id, guest_id, rating, message
  )
VALUES
  (1, 1, 4, 4, 'messages'),
  (2, 2, 4, 1, 'messages'),
  (3, 3, 3, 5, 'messages');



    


