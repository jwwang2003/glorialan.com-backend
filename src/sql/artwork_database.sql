CREATE TABLE IF NOT EXISTS Locations (
    -- REQUIRED
    location_id         SERIAL PRIMARY KEY,
    coordinates         POINT,                  -- Coordinates (latitude, longitude)
    location_name       VARCHAR(255) NOT NULL,  -- Name of the location
    
    -- OPTIONAL
    country             VARCHAR(100),           -- Name of country
    country_code        VARCHAR(3),
    province            VARCHAR(100),
    city                VARCHAR(100),
    specific_address    VARCHAR(1024) UNIQUE,          -- The specific address (might be long)

    google_place_id     VARCHAR(255) UNIQUE,
    location_type       VARCHAR(255),

    memo                VARCHAR(255),

    UNIQUE(google_place_id, specific_address)
);

CREATE TABLE IF NOT EXISTS Artworks (
    -- REQUIRED
    artwork_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    name VARCHAR(100) NOT NULL,

    -- OPTIONAL
    original_source VARCHAR(100) DEFAULT 'Original',
    description VARCHAR(100) DEFAULT '',
    primary_tool VARCHAR(50) DEFAULT '',
    
    -- FOREIGN KEYS
    location_id INT,
    FOREIGN KEY (location_id) REFERENCES Locations(location_id) ON DELETE SET NULL
        -- set null on delete because we don't want it removing the artwork if a location is deleted
);

-- Tags table to store possible tags or styles
CREATE TABLE IF NOT EXISTS Tags (
    tag_id      SERIAL PRIMARY KEY,     -- Unique tag ID with auto-increment
    tag_name    VARCHAR(100) NOT NULL UNIQUE   -- Tag or style name
);

-- Junction table to associate artworks with multiple tags
CREATE TABLE IF NOT EXISTS ArtworkTags (
    artwork_id  INT,    -- Foreign key to ArtworkTracking
    tag_id      INT,    -- Foreign key to Tags
    PRIMARY KEY (artwork_id, tag_id),

    FOREIGN KEY (artwork_id)    REFERENCES Artworks(artwork_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id)        REFERENCES Tags(tag_id) ON DELETE CASCADE
);