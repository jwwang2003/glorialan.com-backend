"""
This file contains some code for processing the information in the 
"""

import pandas as pd
import requests
import os

def extract_location_components(address_components):
    """
    Extracts country, province (administrative_area_level_1), and city (locality)
    from the given address components.

    Args:
        address_components (list): A list of dictionaries containing address components.

    Returns:
        dict: A dictionary with keys 'country', 'province', and 'city'. Values will be
              None if the respective component is not found.
    """
    # Initialize placeholders
    location_data = {
        "country": None,
        "country_code": None,
        "province": None,
        "city": None
    }

    # Iterate over address components
    for component in address_components:
        types = component.get("types", [])
        long_name = component.get("long_name", None)
        short_name = component.get("short_name", None)

        # Extract country
        if "country" in types:
            location_data["country"] = long_name
            location_data["country_code"] = short_name
        
        # Extract province (administrative area level 1)
        if "administrative_area_level_1" in types:
            location_data["province"] = long_name
        
        # Extract city (locality)
        if "locality" in types:
            location_data["city"] = long_name

    return location_data

def escape_sql_string(input_string):
    """
    Checks for special escape characters in a string and escapes them following SQL rules.

    Args:
        input_string (str): The string to check and escape.

    Returns:
        str: The SQL-escaped string.
    """
    if not isinstance(input_string, str):
        # raise ValueError("Input must be a string.")
        return None

    # List of characters to escape in SQL (based on common SQL rules)
    special_characters = {
        "'": "''"  # Single quote is escaped by doubling it
    }
    
    # Escape each special character
    escaped_string = input_string
    for char, escaped_char in special_characters.items():
        escaped_string = escaped_string.replace(char, escaped_char)
    
    return escaped_string

def prettify_string(input_string):
    """
    Prettifies a string by capitalizing the first letter of each word.

    Args:
        input_string (str): The string to prettify.

    Returns:
        str: The prettified string with each word's first letter capitalized.
    """
    if not isinstance(input_string, str):
        raise ValueError("Input must be a string.")
    
    return input_string.title()

# Load the CSV file
file_path = "raw_data/watercolor_data.csv"
data = pd.read_csv(file_path)  # skip header rows with Chinese description text

# Rename columns for easier handling
data.columns = ["artwork_id", "date", "country", "city", "location", "address", "tool", "original_source", "tag"] + list(data.columns[9:])

# Drop unnecessary columns (those beyond 'tags_style')
data = data[["artwork_id", "date", "country", "city", "location", "address", "tool", "original_source", "tag"]]

data.fillna("",inplace=True)

# Function to clean and split multi-value fields (original_source and tags_style)
def split_values(value):
    if value and isinstance(value, str):
        return [item.strip() for item in value.split(",")]
    return []

# Apply split function for 'original_source' and 'tags_style'
data["original_source"] = data["original_source"].apply(split_values)
data["tag"] = data["tag"].apply(split_values)

# Print the processed DataFrame for review

insert_statements = []
place_id_cache = []
google_id: str = None

for index, row in data.iterrows():
    address:str = ""
    raw_address:str = "" 

    if row["location"]:
        raw_address += str(row["location"])
        address += str(row["location"]) + "+"
    if row["address"]:
        raw_address += str(row["address"])
        address += str(row["address"]) + "+"
    if row["city"]:
        raw_address += str(row["city"])
        address += str(row["city"]) + "+"
    if row["country"]:
        raw_address += str(row["country"])
        address += str(row["country"])
    
    address = address.replace(" ", "%20")

    if address:
        # print(address)
        key = os.environ.get("GOOGLE_MAPS_API")
        response = requests.get(f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={key}")
        address_info = response.json()["results"][0]

        address_components = address_info["address_components"]
        formatted_address = address_info["formatted_address"]
        coordinates = address_info["geometry"]["location"]
        place_id = address_info["place_id"]
        location_type = address_info["geometry"]["location_type"]
        types = address_info["types"]

        address_components = extract_location_components(address_components)
        
        has_seen = place_id_cache.count(place_id)
        if has_seen:
            print("Been to this place before!")
            # continue
        else:
            place_id_cache.append(place_id)
        
        location_name = formatted_address.split(",")[0]
        
        insert_statement = f"""
INSERT INTO Locations (
    coordinates,
    location_name,
    country,
    country_code,
    province,
    city,
    specific_address,
    google_place_id,
    location_type,
    memo
) VALUES (
    POINT({coordinates['lat']}, {coordinates['lng']}),
    '{escape_sql_string(location_name)}',
    '{escape_sql_string(address_components["country"])}',
    '{escape_sql_string(address_components["country_code"])}',
    '{escape_sql_string(address_components["province"])}',
    '{escape_sql_string(address_components["city"])}',
    '{escape_sql_string(formatted_address)}',
    '{place_id}',
    '{location_type}',
    '{escape_sql_string(raw_address)}'
)
ON CONFLICT (google_place_id, specific_address)
DO NOTHING;
"""
        google_id = place_id
        insert_statements.append(insert_statement)

        for tag in row["tag"]:
            tag_name = prettify_string(tag)
            
            # First check if the tag exists
            tag_check = f"SELECT COUNT(*) FROM Tags WHERE tag_name = '{tag_name}';"
            tag_insert = f"INSERT INTO Tags (tag_name) VALUES ('{tag_name}');"
            insert_statements.append(f"IF NOT EXISTS ({tag_check}) BEGIN {tag_insert} END;")
            
            artwork_tag_insert = f"INSERT INTO ArtworkTags (artwork_id, tag_id) VALUES ('{row['artwork_id']}', (SELECT tag_id FROM Tags WHERE tag_name = '{tag_name}'));"
            insert_statements.append(artwork_tag_insert)

        # Insert the artwork and associate with location and tags
        artwork_insert = \
            f"""INSERT INTO Artworks (date, name, original_source, primary_tool, location_id) VALUES ('{row['date']}', '', '{row['original_source']}', '{row['tool']}', {f"SELECT location_id FROM Locations WHERE google_place_id = '{google_id}'" if address else None } );"""
        insert_statements.append(artwork_insert)
    
    # # Insert the location if it doesn't exist
    # location_check = f"SELECT COUNT(*) FROM Locations WHERE location_name = '{row['location']}' AND coordinates = '{row['address']}';"
    # location_insert = f"INSERT INTO Locations (coordinates, location_name, country, city, specific_address) VALUES ('{row['address']}', '{row['location']}', '{row['country']}', '{row['city']}', '{row['address']}');"
    # insert_statements.append(f"IF NOT EXISTS ({location_check}) BEGIN {location_insert} END;")
    
    # # Insert the original source if it doesn't exist
    # for source in row["original_source"]:
    #     original_source_check = f"SELECT COUNT(*) FROM Artworks WHERE original_source = '{source}';"
    #     original_source_insert = f"INSERT INTO Artworks (original_source) VALUES ('{source}');"
    #     insert_statements.append(f"IF NOT EXISTS ({original_source_check}) BEGIN {original_source_insert} END;")
    
    # # Insert tags if they don't exist
    # for tag in row["tag"]:
    #     tag_check = f"SELECT COUNT(*) FROM Tags WHERE tag_name = '{tag}';"
    #     tag_insert = f"INSERT INTO Tags (tag_name) VALUES ('{tag}');"
    #     insert_statements.append(f"IF NOT EXISTS ({tag_check}) BEGIN {tag_insert} END;")
        
    

    # # Add ArtworkTags associations
    # for tag in row["tag"]:
    #     artwork_tag_insert = f"INSERT INTO ArtworkTags (artwork_id, tag_id) VALUES ('{row['artwork_id']}', (SELECT tag_id FROM Tags WHERE tag_name = '{tag}'));"
    #     insert_statements.append(artwork_tag_insert)

# Display the first few SQL insert statements
# insert_statements[:1]  # Show first 10 statements as an example

# print(insert_statements)

with open("./out.txt", "w") as file:
    for item in insert_statements:
        file.write(f"{item}\n")
