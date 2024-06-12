# Started 5/28/24
from datetime import datetime, timedelta
from flask import Flask, url_for, request, jsonify
from flask_cors import CORS
import subprocess
import pickle
import os
import shutil

app = Flask(__name__)
CORS(app)


# Global Variables
curr_directory = None
items_list = {}
reviewListForDay = {}


# This will store every term => each term is one item
class Item:
    term = ""
    defn = ""
    date_created = ""
    full_date_review = ""
    dt_datereview = None
    date_to_review = {}
    alt_defns = []
    level = 0

    # constructor with optional alternate defns parameter
    def __init__(self, termN, defnN, alt_defnsN=[]):
        now = datetime.now()
        self.term = termN
        self.defn = defnN
        self.alt_defns = alt_defnsN
        self.date_created = now.strftime("%m/%d/%Y, %H:%M:%S")

        # retrieving review date
        review_time = now + timedelta(hours=4)
        self.dt_datereview = review_time
        self.full_date_review = review_time.strftime("%m/%d/%Y, %H:%M:%S")

        # hour, day, month, year
        self.date_to_review["hour"] = review_time.strftime("%H")
        self.date_to_review["day"] = review_time.strftime("%d")
        self.date_to_review["month"] = review_time.strftime("%m")
        self.date_to_review["year"] = review_time.strftime("%Y")


############################### ENDPOINTS ###################


# ENDPOINTS FOR LOADING PAGES
@app.route("/homepage", methods=["GET"])
def check_profiles():
    profiles_path = "./profiles"
    profiles_exist = len(os.listdir(profiles_path)) > 0
    print(profiles_exist)
    return jsonify(hasProfiles=profiles_exist)


def loadItems():
    global items_list
    try:
        with open("items", "rb") as file:
            items_list = pickle.load(file)
    except FileNotFoundError:
        items_list = {}
        with open("items", "wb") as file:
            pickle.dump(items_list, file)


def saveItems():
    global items_list
    try:
        with open("items", "wb") as file:
            pickle.dump(items_list, file)
    except FileNotFoundError:
        items_list = {}
        with open("items", "wb") as file:
            pickle.dump(items_list, file)
    file.close()


## MANAGE TERMS FUNCTIONALITY


# Add Term
@app.route("/addterms", methods=["POST"])
def add_term():
    loadItems()
    data = request.json

    terms_defns = data.get("termsanddefn")

    # PARSING DATA
    # comes in the form of Term / Definition

    slash_found = False

    terms_defns = terms_defns.splitlines()
    print(terms_defns)
    # splitting into terms and defns
    # iterating through each pair, then adding it to items_list
    for item in terms_defns:
        if "/" in item:
            i = 0
            term = ""
            defn = ""
            while i < len(item):
                if item[i] == "/":
                    slash_found = True
                else:
                    if not slash_found:
                        term += item[i]
                    else:
                        defn += item[i]

                i += 1
            slash_found = False
            term = term.strip()
            defn = defn.strip()
            items_list[term] = Item(term, defn)
    saveItems()
    return f"added term {terms_defns}"


# Delete Term
@app.route("/deleteterms", methods=["POST"])
def delete_term():
    loadItems()
    data = request.json

    terms_to_delete = data.get("termsanddefn")
    terms_to_delete = terms_to_delete.splitlines()

    for term in terms_to_delete:
        term = term.strip()
        if term in items_list:
            del items_list[term]
    saveItems()
    return "deleted term"


# VIEW TERMS


@app.route("/viewterms", methods=["GET"])
def getItems():
    json_list = []
    for item in items_list:
        curr_item = items_list[item]
        json_item = {
            "term": curr_item.term,
            "defn": curr_item.defn,
            "alt_defns": curr_item.alt_defns,
            "level": curr_item.level,
            "date_created": curr_item.date_created,
            "review_date": curr_item.full_date_review,
        }
        json_list.append(json_item)
    return jsonify(terms=json_list)


# PROFILE MANAGEMENT
@app.route("/addprofile", methods=["POST"])
def createProfile():
    data = request.json
    profilename = data.get("profilename")

    if not os.path.exists(
        f"./profiles/{profilename}"
    ):  # creating a new profile if doesn't already exist
        os.makedirs(f"./profiles/{profilename}")

    return f"profile {profilename} created successfully"


@app.route("/deleteprofile", methods=["POST"])
def deleteProfile():
    data = request.json
    profilename = data.get("profilename")

    if os.path.exists(f"./profiles/{profilename}"):
        shutil.rmtree(f"./profiles/{profilename}")
    return f"profile ${profilename} delete"


@app.route("/chooseprofile", methods=["POST"])
def changeDir():
    data = request.json

    curr_directory = data.get("dir")


# REVIEW TERMS FUNCTIONALITY


@app.route("/addreviewsforday", methods=["POST"])
def loadReviews():
    now = datetime.now()
    for item in items_list:
        if (
            item.dt_datereview < now
        ):  # if the date to review is less than now, add it to list
            reviewListForDay[item.term] = item.defn


@app.route("/checkifcorrect", methods=["POST"])
def checkCorrect():
    data = request.json
    term = data.get("term")
    answer = data.get("answer")

    actualitem = items_list[term]
    if answer == actualitem.defn:
        return jsonify(correct=True)
    else:
        return jsonify(correct=False)


# add show terms path
if __name__ == "__main__":
    app.run(debug=True)
