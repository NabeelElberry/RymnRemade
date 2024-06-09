# Started 5/28/24
from datetime import datetime, timedelta
from flask import Flask, url_for, request, jsonify
from flask_cors import CORS
import subprocess
import pickle
import os

app = Flask(__name__)
CORS(app)


# Global Variables
curr_directory = None
items_list = {}


reviewListForDay = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
    16: [],
    17: [],
    18: [],
    19: [],
    20: [],
    21: [],
    22: [],
    23: [],
}


# This will store every term => each term is one item
class Item:
    term = ""
    defn = ""
    date_to_review = {}
    alt_defns = []
    level = 0

    # constructor with optional alternate defns parameter
    def newTerm(self, termN, defnN, alt_defnsN=[]):
        self.term = termN
        self.defn = defnN
        self.alt_defns = alt_defnsN

        # retrieving current date
        review_time = datetime.now() + timedelta(hours=4)

        # hour, day, month, year
        self.date_to_review["hour"] = review_time.strftime("%H")
        self.date_to_review["day"] = review_time.strftime("%d")
        self.date_to_review["month"] = review_time.strftime("%m")
        self.date_to_review["year"] = review_time.strftime("%Y")


# Need to add:


# Endpoint for checking if there is profiles
@app.route("/checkprofiles", methods=["GET"])
def check_profiles():
    profiles_path = "./profiles"
    profiles_exist = len(os.listdir(profiles_path)) > 0
    print(profiles_exist)
    return jsonify(hasProfiles=profiles_exist)

    # GOOD SPOT TO LOAD REVIEWS IN, SINCE THIS WILL ALWAYS BE THE FIRS THTING THAT LOADS ###### NEED TO DO #####################


@app.route("/createprofile", methods=["POST"])
def createProfile():
    data = request.json
    print("here")
    profilename = data.get("name")

    if not os.path.exists(
        f"./profiles/{profilename}"
    ):  # creating a new profile if doesn't already exist
        os.makedirs(f"./profiles/{profilename}")
    return f"profile {profilename} created successfully"


# Profiles
@app.route("/chooseprofile", methods=["POST"])
def changeDir():
    data = request.json

    curr_directory = data.get("dir")


# need to make the function populate the terms


@app.route("/populateTerms", methods=["POST"])
# def populateTerms():
#     for item in


# check terms on startup, go into correct directory


# Add Term
@app.route("/addterm", methods=["POST"])
def add_term():
    data = request.json

    term = data.get("term")
    defn = data.get("defn")
    alt_defns = data.get("alt_defns", [])

    new_term = Item()
    new_term.newTerm(term, defn, alt_defns)  # new term created

    items_list[term] = new_term  # new term added to end of list


# Delete Term
@app.route("/deleteterm", methods=["POST"])
def delete_term():
    data = request.json

    term_to_delete = data.get("term")

    del items_list[term_to_delete]


# add show terms path
if __name__ == "__main__":
    app.run(debug=True)
