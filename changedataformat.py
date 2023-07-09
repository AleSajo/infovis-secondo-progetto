import csv

# Define the input and output CSV file paths
input_file = "data/pluvioset18.csv"
output_file = "data/pluvioset18FIXED.csv"


# Define the desired data format conversion function
def change_data_format(data):
    # Perform the desired data format conversion here
    # For example, converting a date format from 'MM/DD/YYYY' to 'YYYY-MM-DD'
    parts = data.split("/")
    formatted_date = f"{parts[2]}/{parts[1]}/{parts[0]}"  # Assuming 'MM/DD/YYYY' format
    return formatted_date


# Open input and output CSV files
with open(input_file, "r") as csv_input, open(
    output_file, "w", newline=""
) as csv_output:
    reader = csv.reader(csv_input, delimiter=";")
    writer = csv.writer(csv_output, delimiter=";")

    # Skip the header row
    next(reader)

    # Iterate over rows in the input CSV file
    for row in reader:
        # Modify the desired column (e.g., column index 2)
        old_data = row[1]
        new_data = change_data_format(old_data)
        row[1] = new_data

        # Write the modified row to the output CSV file
        writer.writerow(row)
