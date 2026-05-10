USE traveloop;

-- ─── CITIES ───────────────────────────────────────────────────────────────────
INSERT INTO cities (name, country, region, avg_daily_cost_usd, popularity_score, timezone) VALUES
('Paris','France','Europe',120.00,10,'Europe/Paris'),
('Tokyo','Japan','Asia',100.00,10,'Asia/Tokyo'),
('Bangkok','Thailand','Asia',45.00,9,'Asia/Bangkok'),
('Barcelona','Spain','Europe',95.00,9,'Europe/Madrid'),
('New York','USA','North America',180.00,10,'America/New_York'),
('Dubai','UAE','Middle East',150.00,8,'Asia/Dubai'),
('Singapore','Singapore','Asia',110.00,8,'Asia/Singapore'),
('Rome','Italy','Europe',105.00,9,'Europe/Rome'),
('Bali','Indonesia','Asia',40.00,9,'Asia/Makassar'),
('Istanbul','Turkey','Europe',55.00,8,'Europe/Istanbul'),
('Amsterdam','Netherlands','Europe',130.00,8,'Europe/Amsterdam'),
('Lisbon','Portugal','Europe',80.00,8,'Europe/Lisbon'),
('Prague','Czech Republic','Europe',60.00,7,'Europe/Prague'),
('Kyoto','Japan','Asia',90.00,8,'Asia/Tokyo'),
('Marrakech','Morocco','Africa',50.00,7,'Africa/Casablanca'),
('Cape Town','South Africa','Africa',70.00,8,'Africa/Johannesburg'),
('Sydney','Australia','Oceania',140.00,8,'Australia/Sydney'),
('Mumbai','India','Asia',35.00,7,'Asia/Kolkata'),
('Mexico City','Mexico','North America',55.00,7,'America/Mexico_City'),
('Vienna','Austria','Europe',110.00,7,'Europe/Vienna'),
('Budapest','Hungary','Europe',65.00,7,'Europe/Budapest'),
('Reykjavik','Iceland','Europe',200.00,6,'Atlantic/Reykjavik'),
('Nairobi','Kenya','Africa',60.00,6,'Africa/Nairobi'),
('Hanoi','Vietnam','Asia',30.00,7,'Asia/Ho_Chi_Minh'),
('Buenos Aires','Argentina','South America',50.00,7,'America/Argentina/Buenos_Aires');

-- ─── ACTIVITIES ───────────────────────────────────────────────────────────────
-- Paris (id=1)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(1,'Eiffel Tower Visit','sightseeing',25.00,2.5,'Iconic iron lattice tower with panoramic city views'),
(1,'Louvre Museum Tour','culture',17.00,4.0,'World''s largest art museum and historic monument'),
(1,'Seine River Cruise','sightseeing',15.00,1.5,'Scenic boat tour along the River Seine'),
(1,'French Cooking Class','food',95.00,3.0,'Learn to cook classic French cuisine with a chef'),
(1,'Montmartre Walking Tour','sightseeing',20.00,2.0,'Explore the artistic hilltop neighborhood');

-- Tokyo (id=2)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(2,'Senso-ji Temple Visit','culture',0.00,2.0,'Tokyo''s oldest and most significant Buddhist temple'),
(2,'Tsukiji Outer Market Food Tour','food',40.00,2.0,'Sample fresh seafood and street food'),
(2,'Shibuya Crossing Experience','sightseeing',0.00,1.0,'World''s busiest pedestrian crossing'),
(2,'TeamLab Borderless Digital Art','culture',32.00,3.0,'Immersive digital art museum experience'),
(2,'Sumo Wrestling Morning Practice','culture',30.00,2.0,'Watch sumo wrestlers train at a stable');

-- Bangkok (id=3)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(3,'Grand Palace Tour','sightseeing',15.00,3.0,'Stunning royal complex with ornate Thai architecture'),
(3,'Floating Market Boat Tour','sightseeing',20.00,2.5,'Traditional market on wooden boats'),
(3,'Thai Cooking Class','food',30.00,3.0,'Learn authentic Thai cooking techniques'),
(3,'Wat Pho Temple','culture',5.00,1.5,'Temple of the Reclining Buddha'),
(3,'Muay Thai Boxing Match','adventure',25.00,3.0,'Watch a live Muay Thai fight at a local venue');

-- Barcelona (id=4)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(4,'Sagrada Familia Tour','sightseeing',26.00,2.0,'Gaudí''s unfinished masterpiece basilica'),
(4,'Park Güell Visit','sightseeing',10.00,1.5,'Colorful mosaic park designed by Gaudí'),
(4,'La Boqueria Market','food',0.00,1.0,'Famous public market with fresh food stalls'),
(4,'Tapas & Wine Tour','food',55.00,3.0,'Guided tour of Barcelona''s best tapas bars'),
(4,'Barceloneta Beach Day','adventure',5.00,4.0,'Relax on Barcelona''s famous city beach');

-- New York (id=5)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(5,'Statue of Liberty & Ellis Island','sightseeing',24.00,4.0,'Iconic symbol of freedom with ferry ride'),
(5,'Central Park Bicycle Tour','adventure',35.00,2.0,'Explore 840 acres of urban green space by bike'),
(5,'Broadway Show','culture',120.00,3.0,'World-class theatrical performance on Broadway'),
(5,'Brooklyn Food Tour','food',65.00,3.0,'Discover Brooklyn''s diverse culinary scene'),
(5,'Metropolitan Museum of Art','culture',25.00,4.0,'One of world''s greatest art collections');

-- Dubai (id=6)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(6,'Burj Khalifa Observation Deck','sightseeing',40.00,2.0,'World''s tallest building with 124th floor views'),
(6,'Desert Safari & BBQ Dinner','adventure',85.00,6.0,'Dune bashing, camel riding and traditional dinner'),
(6,'Dubai Mall Shopping','shopping',0.00,3.0,'World''s largest mall with 1200+ stores'),
(6,'Dubai Creek Dhow Cruise','sightseeing',35.00,2.0,'Traditional wooden boat dinner cruise'),
(6,'Gold & Spice Souk Tour','shopping',10.00,2.0,'Explore traditional gold and spice markets');

-- Singapore (id=7)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(7,'Gardens by the Bay','sightseeing',20.00,3.0,'Futuristic nature park with Supertree Grove'),
(7,'Singapore Food Trail (Hawker)','food',15.00,2.0,'Sample Singapore''s famous hawker centre food'),
(7,'Universal Studios Singapore','adventure',80.00,6.0,'Theme park on Sentosa island'),
(7,'Marina Bay Sands SkyPark','sightseeing',25.00,1.5,'Infinity pool and panoramic views'),
(7,'Chinatown Heritage Tour','culture',10.00,2.0,'Explore Singapore''s historic Chinatown');

-- Rome (id=8)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(8,'Colosseum & Roman Forum','sightseeing',18.00,3.0,'Ancient amphitheater and Roman ruins'),
(8,'Vatican Museums & Sistine Chapel','culture',21.00,4.0,'Michelangelo''s masterpiece and papal collections'),
(8,'Pasta Making Class','food',75.00,3.0,'Learn to make fresh pasta with a local nonna'),
(8,'Trevi Fountain & Spanish Steps','sightseeing',0.00,1.5,'Iconic baroque fountain and famous steps'),
(8,'Trastevere Food Walk','food',45.00,3.0,'Evening food tour through Rome''s oldest neighborhood');

-- Bali (id=9)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(9,'Ubud Sacred Monkey Forest','sightseeing',5.00,1.5,'Natural sanctuary with Balinese macaques'),
(9,'Tanah Lot Temple at Sunset','sightseeing',5.00,2.0,'Stunning sea temple at golden hour'),
(9,'Balinese Cooking Class','food',35.00,4.0,'Market visit and traditional cooking lesson'),
(9,'Bali Swing & Rice Terrace','adventure',35.00,3.0,'Swing over the jungle and walk through terraces'),
(9,'Traditional Balinese Massage','wellness',25.00,2.0,'Full body relaxation massage at a spa');

-- Istanbul (id=10)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(10,'Hagia Sophia Visit','culture',15.00,2.0,'Byzantine cathedral turned Ottoman mosque'),
(10,'Grand Bazaar Shopping','shopping',5.00,2.5,'One of world''s oldest and largest covered markets'),
(10,'Bosphorus Boat Tour','sightseeing',20.00,2.0,'Cruise between Europe and Asia on the strait'),
(10,'Turkish Cooking Class','food',50.00,3.0,'Learn Ottoman recipes in a traditional kitchen'),
(10,'Hammam Spa Experience','wellness',40.00,2.0,'Traditional Turkish bath experience');

-- Amsterdam (id=11)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(11,'Anne Frank House Tour','culture',16.00,2.0,'Historic house where Anne Frank hid during WWII'),
(11,'Canal Boat Tour','sightseeing',18.00,1.5,'Explore Amsterdam''s UNESCO canal ring by boat'),
(11,'Rijksmuseum Visit','culture',22.00,3.0,'Dutch masterpieces including Rembrandt and Vermeer'),
(11,'Heineken Experience Brewery','food',25.00,2.0,'Interactive brewery tour with tastings'),
(11,'Dutch Cheese & Jenever Tasting','food',30.00,1.5,'Sample traditional Dutch cheese and gin');

-- Lisbon (id=12)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(12,'Belém Tower & Jerónimos Monastery','sightseeing',12.00,3.0,'UNESCO World Heritage medieval monuments'),
(12,'Tram 28 Ride through Alfama','sightseeing',3.00,1.5,'Historic yellow tram through oldest Lisbon district'),
(12,'Fado Music Dinner Show','culture',55.00,3.0,'Traditional Portuguese music with dinner'),
(12,'Sintra Day Trip','adventure',25.00,6.0,'Fairy-tale palaces and castles near Lisbon'),
(12,'LX Factory Market Visit','shopping',0.00,2.0,'Creative market in repurposed industrial space');

-- Prague (id=13)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(13,'Prague Castle Complex','sightseeing',15.00,3.0,'Largest ancient castle complex in the world'),
(13,'Charles Bridge Walk','sightseeing',0.00,1.0,'Gothic bridge with Baroque statues over Vltava'),
(13,'Czech Beer Tasting Tour','food',30.00,2.5,'Sample local pilsners in traditional pubs'),
(13,'Old Town Astronomical Clock','sightseeing',0.00,0.5,'Medieval clock with hourly animated show'),
(13,'Czech Cooking Class','food',45.00,3.0,'Learn to cook svíčková and other classics');

-- Kyoto (id=14)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(14,'Fushimi Inari Shrine Hike','adventure',0.00,3.0,'Thousands of vermillion torii gates on a mountain'),
(14,'Geisha District (Gion) Walk','culture',10.00,2.0,'Evening walk through Kyoto''s geisha district'),
(14,'Arashiyama Bamboo Grove','sightseeing',0.00,1.5,'Famous towering bamboo forest walk'),
(14,'Tea Ceremony Experience','culture',30.00,1.5,'Traditional Japanese matcha tea ceremony'),
(14,'Nishiki Market Food Walk','food',25.00,2.0,'Kyoto''s centuries-old narrow market street');

-- Marrakech (id=15)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(15,'Medina Souk Walking Tour','shopping',15.00,3.0,'Explore the labyrinthine traditional market'),
(15,'Jardin Majorelle Visit','sightseeing',8.00,1.5,'Yves Saint Laurent''s legendary blue garden'),
(15,'Moroccan Cooking Class','food',40.00,3.5,'Learn tagine and couscous with a local family'),
(15,'Sahara Desert Day Trip','adventure',80.00,12.0,'Camel ride and sunset in the desert dunes'),
(15,'Traditional Hammam','wellness',20.00,2.0,'Moroccan bath with black soap and kessa scrub');

-- Cape Town (id=16)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(16,'Table Mountain Cable Car','sightseeing',25.00,3.0,'Iconic flat-topped mountain with city views'),
(16,'Cape of Good Hope Tour','adventure',35.00,5.0,'Southernmost tip of Africa with penguin colony'),
(16,'Cape Winelands Tour','food',70.00,6.0,'Wine tasting in Stellenbosch and Franschhoek'),
(16,'V&A Waterfront','shopping',0.00,2.0,'Historic harbor with shops and restaurants'),
(16,'Robben Island Tour','culture',20.00,4.0,'Former prison where Mandela was held');

-- Sydney (id=17)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(17,'Sydney Opera House Tour','culture',35.00,1.5,'Inside tour of the iconic architectural landmark'),
(17,'Bondi to Coogee Coastal Walk','adventure',0.00,3.0,'Stunning 6km coastal clifftop walk'),
(17,'Harbour Bridge Climb','adventure',180.00,3.5,'Climb to the top of the iconic bridge'),
(17,'Blue Mountains Day Trip','sightseeing',50.00,8.0,'Three Sisters rock formation and scenic railway'),
(17,'Sydney Fish Market','food',20.00,1.5,'World''s largest fish market with fresh seafood');

-- Mumbai (id=18)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(18,'Gateway of India & Elephanta Caves','sightseeing',10.00,4.0,'Colonial arch and ancient rock-cut temples'),
(18,'Dharavi Slum Tour','culture',20.00,2.0,'Insightful guided tour of Asia''s largest slum'),
(18,'Mumbai Street Food Walk','food',15.00,3.0,'Vada pav, pani puri and more street foods'),
(18,'Bollywood Studio Tour','culture',25.00,3.0,'Behind-the-scenes of India''s film industry'),
(18,'Juhu Beach Sunset','sightseeing',0.00,1.5,'Famous beach with street food vendors');

-- Mexico City (id=19)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(19,'Teotihuacan Pyramids','sightseeing',20.00,5.0,'Ancient sun and moon pyramids outside the city'),
(19,'Lucha Libre Wrestling Show','culture',15.00,3.0,'Colorful traditional Mexican wrestling matches'),
(19,'Mexican Cooking Class','food',45.00,3.0,'Learn to make mole, tamales and salsas'),
(19,'Xochimilco Floating Gardens','adventure',20.00,3.0,'Colorful trajinera boat ride on ancient canals'),
(19,'Frida Kahlo Museum','culture',12.00,2.0,'Casa Azul home and museum of the iconic artist');

-- Vienna (id=20)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(20,'Schönbrunn Palace Tour','culture',22.00,3.0,'Baroque imperial palace with 1,441 rooms'),
(20,'Vienna Opera House Tour','culture',15.00,1.5,'Grandest opera house in the world'),
(20,'Viennese Coffee House Culture','food',15.00,1.5,'Experience the famous Kaffeehäuser tradition'),
(20,'Belvedere Museum','culture',18.00,2.5,'Klimt''s The Kiss and stunning gardens'),
(20,'Vienna Woods Hike','adventure',0.00,3.0,'Scenic forest hiking just outside the city');

-- Budapest (id=21)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(21,'Széchenyi Thermal Bath','wellness',20.00,3.0,'Famous neo-baroque thermal spa complex'),
(21,'Parliament Building Tour','sightseeing',15.00,2.0,'Neo-Gothic parliament on the Danube banks'),
(21,'Ruin Bar Pub Crawl','food',25.00,4.0,'Budapest''s unique bars in abandoned buildings'),
(21,'Danube River Cruise','sightseeing',20.00,2.0,'Evening cruise with city lights views'),
(21,'Hungarian Cooking Class','food',50.00,3.0,'Learn goulash and lángos from a local chef');

-- Reykjavik (id=22)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(22,'Northern Lights Tour','adventure',80.00,4.0,'Hunt for the aurora borealis outside the city'),
(22,'Golden Circle Day Trip','sightseeing',90.00,8.0,'Geysir, Gullfoss waterfall and Þingvellir'),
(22,'Blue Lagoon Geothermal Spa','wellness',100.00,3.0,'World-famous milky blue geothermal pool'),
(22,'Whale Watching Tour','adventure',75.00,3.0,'Spot humpback and minke whales in the bay'),
(22,'Hallgrímskirkja Church Visit','sightseeing',10.00,1.0,'Iconic modernist Lutheran church with tower views');

-- Nairobi (id=23)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(23,'Nairobi National Park Safari','adventure',60.00,4.0,'Only national park bordering a capital city'),
(23,'Giraffe Centre Visit','sightseeing',15.00,1.5,'Feed endangered Rothschild giraffes up close'),
(23,'Karen Blixen Museum','culture',8.00,2.0,'Home of Out of Africa author Karen Blixen'),
(23,'Maasai Market Shopping','shopping',5.00,2.0,'Traditional crafts, jewelry and fabrics'),
(23,'Carnivore Restaurant','food',40.00,3.0,'Legendary nyama choma (grilled meat) experience');

-- Hanoi (id=24)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(24,'Hoan Kiem Lake & Ngoc Son Temple','sightseeing',2.00,2.0,'Scenic lake with island pagoda in city center'),
(24,'Ha Long Bay Day Cruise','adventure',60.00,10.0,'Stunning limestone karsts and emerald waters'),
(24,'Vietnamese Cooking Class','food',25.00,3.0,'Market visit and learn to make pho and banh mi'),
(24,'Old Quarter Walking Tour','sightseeing',10.00,2.0,'36 streets of traditional guilds and crafts'),
(24,'Water Puppet Show','culture',5.00,1.0,'Traditional Vietnamese puppetry on water');

-- Buenos Aires (id=25)
INSERT INTO activities (city_id, name, category, estimated_cost_usd, duration_hours, description) VALUES
(25,'Tango Show & Dinner','culture',80.00,3.0,'World-famous Argentine tango performance'),
(25,'La Boca & Caminito Tour','sightseeing',0.00,2.0,'Colorful neighborhood and street art district'),
(25,'Argentine Asado BBQ Class','food',55.00,3.0,'Learn the art of Argentine barbecue'),
(25,'MALBA Contemporary Art Museum','culture',12.00,2.0,'Latin American art in a striking modern building'),
(25,'Palermo Parks & Recoleta Cemetery','sightseeing',5.00,2.5,'Lavish mausoleums of Argentina''s elite');

-- ─── DEMO USERS (bcrypt hash of "demo1234", 12 rounds) ───────────────────────
INSERT INTO users (id, name, email, password_hash, is_admin) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Alex Traveler','traveler@demo.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TsY6aCkn7K5rV7oWZo4zF3mwHT5q',0),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Sam Explorer','explorer@demo.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TsY6aCkn7K5rV7oWZo4zF3mwHT5q',1);

-- ─── DEMO TRIPS ───────────────────────────────────────────────────────────────
INSERT INTO trips (id, user_id, title, description, start_date, end_date, total_budget, status, is_public, share_token) VALUES
('tttt1111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Europe Summer 2025','A grand tour through Western Europe''s finest cities','2025-06-15','2025-07-05',4500.00,'planned',1,'sttt1111-1111-1111-1111-111111111111'),
('tttt2222-2222-2222-2222-222222222222','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Southeast Asia Adventure','Exploring the vibrant cultures of Southeast Asia','2025-09-01','2025-09-20',2800.00,'draft',0,'sttt2222-2222-2222-2222-222222222222');

-- ─── TRIP 1 STOPS (Paris → Barcelona → Rome) ─────────────────────────────────
INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, stop_order) VALUES
('ssss1111-1111-1111-1111-111111111111','tttt1111-1111-1111-1111-111111111111',1,'2025-06-15','2025-06-22',1),
('ssss2222-2222-2222-2222-222222222222','tttt1111-1111-1111-1111-111111111111',4,'2025-06-22','2025-06-29',2),
('ssss3333-3333-3333-3333-333333333333','tttt1111-1111-1111-1111-111111111111',8,'2025-06-29','2025-07-05',3);

-- ─── TRIP 2 STOPS (Bangkok → Bali → Hanoi) ───────────────────────────────────
INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, stop_order) VALUES
('ssss4444-4444-4444-4444-444444444444','tttt2222-2222-2222-2222-222222222222',3,'2025-09-01','2025-09-07',1),
('ssss5555-5555-5555-5555-555555555555','tttt2222-2222-2222-2222-222222222222',9,'2025-09-07','2025-09-14',2),
('ssss6666-6666-6666-6666-666666666666','tttt2222-2222-2222-2222-222222222222',24,'2025-09-14','2025-09-20',3);

-- ─── TRIP 1 ACTIVITIES (Paris stop) ──────────────────────────────────────────
INSERT INTO trip_activities (id, trip_stop_id, activity_id, scheduled_date, scheduled_time, is_confirmed) VALUES
(UUID(),'ssss1111-1111-1111-1111-111111111111',1,'2025-06-16','10:00:00',1),
(UUID(),'ssss1111-1111-1111-1111-111111111111',2,'2025-06-17','09:00:00',1),
(UUID(),'ssss1111-1111-1111-1111-111111111111',3,'2025-06-18','15:00:00',0),
(UUID(),'ssss1111-1111-1111-1111-111111111111',4,'2025-06-19','11:00:00',1);

-- Barcelona stop activities
INSERT INTO trip_activities (id, trip_stop_id, activity_id, scheduled_date, scheduled_time, is_confirmed) VALUES
(UUID(),'ssss2222-2222-2222-2222-222222222222',16,'2025-06-23','09:30:00',1),
(UUID(),'ssss2222-2222-2222-2222-222222222222',17,'2025-06-24','10:00:00',1),
(UUID(),'ssss2222-2222-2222-2222-222222222222',18,'2025-06-25','12:00:00',0),
(UUID(),'ssss2222-2222-2222-2222-222222222222',19,'2025-06-26','19:00:00',1);

-- Rome stop activities
INSERT INTO trip_activities (id, trip_stop_id, activity_id, scheduled_date, scheduled_time, is_confirmed) VALUES
(UUID(),'ssss3333-3333-3333-3333-333333333333',36,'2025-06-30','09:00:00',1),
(UUID(),'ssss3333-3333-3333-3333-333333333333',37,'2025-07-01','08:30:00',1),
(UUID(),'ssss3333-3333-3333-3333-333333333333',38,'2025-07-02','11:00:00',1),
(UUID(),'ssss3333-3333-3333-3333-333333333333',39,'2025-07-03','16:00:00',0);

-- ─── BUDGET ENTRIES (Trip 1) ──────────────────────────────────────────────────
INSERT INTO budget_entries (id, trip_id, category, label, amount, entry_date, is_estimated) VALUES
(UUID(),'tttt1111-1111-1111-1111-111111111111','transport','Round trip flights Europe',850.00,'2025-06-15',0),
(UUID(),'tttt1111-1111-1111-1111-111111111111','accommodation','Paris hotel 7 nights',980.00,'2025-06-15',0),
(UUID(),'tttt1111-1111-1111-1111-111111111111','accommodation','Barcelona Airbnb 7 nights',700.00,'2025-06-22',1),
(UUID(),'tttt1111-1111-1111-1111-111111111111','food','Daily food budget Paris',350.00,'2025-06-15',1),
(UUID(),'tttt1111-1111-1111-1111-111111111111','misc','Travel insurance & visas',120.00,'2025-06-14',0);

-- ─── PACKING ITEMS (Trip 1) ───────────────────────────────────────────────────
INSERT INTO packing_items (id, trip_id, label, category, is_packed) VALUES
(UUID(),'tttt1111-1111-1111-1111-111111111111','Passport','documents',1),
(UUID(),'tttt1111-1111-1111-1111-111111111111','Travel adapter','electronics',1),
(UUID(),'tttt1111-1111-1111-1111-111111111111','Summer shirts x5','clothing',0),
(UUID(),'tttt1111-1111-1111-1111-111111111111','Sunscreen SPF50','toiletries',1),
(UUID(),'tttt1111-1111-1111-1111-111111111111','Portable charger','electronics',0),
(UUID(),'tttt1111-1111-1111-1111-111111111111','Travel insurance card','documents',1);

-- ─── NOTES (Trip 1) ───────────────────────────────────────────────────────────
INSERT INTO trip_notes (id, trip_id, stop_id, content) VALUES
(UUID(),'tttt1111-1111-1111-1111-111111111111','ssss1111-1111-1111-1111-111111111111','Book Eiffel Tower tickets at least 2 weeks in advance! Evening slots sell out fastest. Also check if Louvre is closed on Tuesdays.'),
(UUID(),'tttt1111-1111-1111-1111-111111111111',NULL,'Remember to notify bank before travel. Get some EUR cash before flying. Check luggage restrictions for all flights.');
