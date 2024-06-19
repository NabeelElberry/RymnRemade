# Started 5/28/24
from datetime import datetime, timedelta
from flask import Flask, url_for, request, jsonify
from flask_cors import CORS
import subprocess
import pickle
import os
import shutil
import random
import re

app = Flask(__name__)
CORS(app)


# Global Variables
current_profile = "None"
curr_directory = None
items_list = {}
review_list = {}
stats = dict(
    numberofterms=0,
    numberofreviewsdone=0,
    numberright=0,
    numberwrong=0,
    lvl1=0,
    lvl2=0,
    lvl3=0,
    lvl4=0,
    lvl5=0,
    lvl6=0,
    lvl7=0,
    lvl8=0,
)


# This will store every term => each term is one item
class Item:
    # constructor with optional alternate defns parameter
    def __init__(self, termN, defnN, alt_defnsN=[], notes=[]):
        now = datetime.now()
        self.term = termN
        self.defn = defnN
        self.alt_defns = alt_defnsN
        self.notes = notes
        self.date_created = now.strftime("%m/%d/%Y, %H:%M:%S")
        self.level = 1
        # retrieving review date
        review_time = now  # + timedelta(hours=4)
        self.dt_datereview = review_time
        self.full_date_review = review_time.strftime("%m/%d/%Y, %H:%M:%S")
        # self.date_to_review = {}
        # hour, day, month, year
        # self.date_to_review["hour"] = review_time.strftime("%H")
        # self.date_to_review["day"] = review_time.strftime("%d")
        # self.date_to_review["month"] = review_time.strftime("%m")
        # self.date_to_review["year"] = review_time.strftime("%Y")

    def getLevel(self):
        return self.level

    def setLevel(self, newlevel):
        self.level = newlevel

    def getdt(self):
        return self.dt_datereview

    def setdt(self, new_date):
        self.dt_datereview = new_date
        self.full_date_review = new_date.strftime("%m/%d/%Y, %H:%M:%S")
        # self.date_to_review["hour"] = new_date.strftime("%H")
        # self.date_to_review["day"] = new_date.strftime("%d")
        # self.date_to_review["month"] = new_date.strftime("%m")
        # self.date_to_review["year"] = new_date.strftime("%Y")

    def __str__(self):
        return f"Term: {self.term}, Review Date: {self.full_date_review}, Level: {self.level}, Notes: {self.notes}, alt: {self.alt_defns}"


def loadProf():
    global current_profile
    try:
        with open("./prof", "rb") as file:
            current_profile = pickle.load(file)
    except FileNotFoundError:
        current_profile = "None"

        with open("./prof", "wb") as file:
            pickle.dump(current_profile, file)
        saveProf()


def saveProf():
    global current_profile
    try:
        with open("./prof", "wb") as file:
            pickle.dump(current_profile, file)
    except FileNotFoundError:
        current_profile = "None"

        with open("./prof", "wb") as file:
            pickle.dump(current_profile, file)
        saveProf()
    file.close()


############################### ENDPOINTS ###################


# ENDPOINTS FOR LOADING PAGES
@app.route("/homepage", methods=["GET"])
def check_profiles():
    profiles_path = "./profiles"
    profiles_exist = len(os.listdir(profiles_path)) > 0
    return jsonify(hasProfiles=profiles_exist)


def loadItems():
    global items_list
    global current_profile
    try:
        with open(f"./profiles/{current_profile}/items", "rb") as file:
            items_list = pickle.load(file)
    except FileNotFoundError:
        items_list = {}
        with open(f"./profiles/{current_profile}/items", "wb") as file:
            pickle.dump(items_list, file)


def saveItems():
    global items_list
    global current_profile
    try:
        with open(f"./profiles/{current_profile}/items", "wb") as file:
            pickle.dump(items_list, file)
    except FileNotFoundError:
        items_list = {}
        with open(f"./profiles/{current_profile}/items", "wb") as file:
            pickle.dump(items_list, file)
    file.close()


## MANAGE TERMS FUNCTIONALITY


# Add Term
@app.route("/addterms", methods=["POST"])
def add_term():
    loadItems()
    loadStats()
    data = request.json

    terms_defns = data.get("termsanddefn")

    # PARSING DATA
    # comes in the form of Term :: Definition ::/ alt defns ::: notes
    # splitting input

    terms_defns = terms_defns.splitlines()
    print("terms_defns:", terms_defns)
    # splitting into terms and defns
    # iterating through each pair, then adding it to items_list
    count = 0
    for item in terms_defns:
        alt_defns = None
        notes = None

        parts = item.split("::")

        term = parts[0].strip()
        defn = parts[1].strip()

        print("term", term)
        print("defn", defn)
        if len(parts) == 4:
            alt_defns = parts[2].strip()
            notes = parts[3].strip()
        if len(parts) == 3:
            parts[2] = parts[2].strip()
            if parts[2][0] == "{" and parts[2][len(parts[2]) - 1] == "}":
                alt_defns = parts[2]
                print("alt_defns: ", alt_defns)
            else:
                notes = parts[2]
                print("notes: ", notes)
        if alt_defns:
            alt_defns = alt_defns[1:]  # removing first and last brackets
            alt_defns = alt_defns[:-1]
            alt_defns = alt_defns.split(",")
            index = 0
            while index < len(alt_defns):
                alt_defns[index] = alt_defns[index].strip()
                index += 1
        print("alt_defns each", alt_defns)
        print("notes: ", notes)
        if alt_defns and notes:
            items_list[term] = Item(term, defn, alt_defns, notes)
        elif alt_defns:
            items_list[term] = Item(term, defn, alt_defns)
        elif notes:
            items_list[term] = Item(term, defn, [], notes)
        else:
            items_list[term] = Item(term, defn)
        print("term: ", items_list[term])
        count += 1
    stats["numberofterms"] += count
    stats["lvl1"] += count
    # adding the number of terms to statistics
    saveItems()
    saveStats()
    return f"added term {terms_defns}"


# Delete Term
@app.route("/deleteterms", methods=["POST"])
def delete_term():
    loadItems()
    loadStats()
    data = request.json

    terms_to_delete = data.get("termsanddefn")
    terms_to_delete = terms_to_delete.splitlines()
    count = 0
    for term in terms_to_delete:
        term = term.strip()
        if term in items_list:
            count += 1
            item_lvl = items_list[term].getLevel()
            stats[f"lvl{item_lvl}"] -= 1
            del items_list[term]

    stats["numberofterms"] -= count
    saveItems()
    saveStats()
    return "deleted term"


# VIEW TERMS


@app.route("/viewterms", methods=["GET"])
def getItems():
    global items_list
    loadItems()
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
            "notes": curr_item.notes,
        }
        json_list.append(json_item)
    return jsonify(terms=json_list)


# PROFILE MANAGEMENT


@app.route("/chooseprofile", methods=["POST"])
def chooseProfile():
    global current_profile
    loadProf()

    data = request.json
    profilename = data.get("profilename")
    current_profile = profilename
    saveProf()
    return f"{current_profile} chosen"


@app.route("/getprofiles", methods=["GET"])
def getProfiles():
    loadProf()
    global current_profile
    dirs = [x[0][11:] for x in os.walk("./profiles") if x[0] != "./profiles"]
    return jsonify(profiles=dirs)


@app.route("/getcurrentprofile", methods=["GET"])
def getCurrProfile():
    loadProf()
    global current_profile

    return jsonify(profile=current_profile)


@app.route("/addprofile", methods=["POST"])
def createProfile():
    data = request.json
    global current_profile
    profilename = data.get("profilename")

    if not os.path.exists(
        f"./profiles/{profilename}"
    ):  # creating a new profile if doesn't already exist
        os.makedirs(f"./profiles/{profilename}")

    if len(next(os.walk("./profiles"))[1]) == 1:
        current_profile = profilename
        saveProf()
    return f"profile {profilename} created successfully"


@app.route("/deleteprofile", methods=["POST"])
def deleteProfile():
    data = request.json
    profilename = data.get("profilename")
    global current_profile
    if os.path.exists(f"./profiles/{profilename}"):
        shutil.rmtree(f"./profiles/{profilename}")
        os.remove("./prof")
    if len(next(os.walk("./profiles"))[1]) == 0:
        current_profile = "None"
        print("WE HAVE DELETED ALL")
    saveProf()
    return f"profile ${profilename} delete"


# REVIEW TERMS FUNCTIONALITY

# might want to look into using load and save review list sparingly,
# since we have useEffect loadReviews which should load it in once per page
# cutting down on API calls


def loadReviewList():
    global review_list
    try:
        with open(f"./profiles/{current_profile}/reviews", "rb") as file:
            review_list = pickle.load(file)
    except FileNotFoundError:
        review_list = {}
        with open(f"./profiles/{current_profile}/reviews", "wb") as file:
            pickle.dump(review_list, file)


def saveReviewList():
    global review_list
    print("review list we're saving: ", review_list)
    try:
        with open(f"./profiles/{current_profile}/reviews", "wb") as file:
            print("here")
            pickle.dump(review_list, file)
    except FileNotFoundError:
        review_list = {}
        with open(f"./profiles/{current_profile}/reviews", "wb") as file:
            pickle.dump(review_list, file)
    file.close()


def setupReviewList():
    global review_list
    loadItems()
    loadReviewList()

    print("revs: ", review_list)
    now = datetime.now()
    for item in items_list:
        print("item: ", items_list[item].getdt().strftime("%m/%d/%Y, %H:%M:%S"))
        acc_item = items_list[item]
        if (
            acc_item.getdt() < now
        ):  # if the date to review is less than now, add it to list
            review_list[acc_item.term] = acc_item.defn
    saveReviewList()


@app.route("/loadreviews", methods=["GET"])
def loadReviews():
    setupReviewList()
    print(len(review_list))
    return jsonify(revLength=len(review_list))


def calculateNextReviewTime(item, correct, numberOfTimesFailed):
    global stats
    loadStats()
    penaltyFactor = 1
    if item.getLevel() >= 5:
        penaltyFactor = 2
    if correct:  # case where they get it right
        stats[f"lvl{item.getLevel()}"] -= 1
        item.setLevel(item.getLevel() + 1)
        stats[f"lvl{item.getLevel()}"] += 1
    else:
        stats[f"lvl{item.getLevel()}"] -= 1
        item.setLevel(max(1, item.getLevel() - (penaltyFactor * numberOfTimesFailed)))
        stats[f"lvl{item.getLevel()}"] += 1

    print("num times failed", numberOfTimesFailed)
    # increment level by 1
    level = item.getLevel()
    now = datetime.now()
    if level == 2:
        item.setdt(now + timedelta(hours=8))
    if level == 3:
        item.setdt(now + timedelta(hours=24))
    if level == 4:
        item.setdt(now + timedelta(hours=48))
    if level == 5:
        item.setdt(now + timedelta(hours=168))
    if level == 6:
        item.setdt(now + timedelta(hours=336))
    if level == 7:
        item.setdt(now + timedelta(hours=730))
    if level == 8:
        item.setdt(now + timedelta(hours=2920))
    print("next review print ", item)
    saveStats()
    return item


failedReviews = {}


@app.route("/checkifcorrect", methods=["POST", "GET"])
def checkCorrect():
    global stats
    global failedReviews
    loadReviewList()
    loadStats()
    global items_list
    global review_list
    data = request.json
    term = data.get("term")  # received term to check if correct
    term = term.strip('"')  # removing extra spaces

    answer = data.get("answer")  # answer the user entered
    answer = re.sub(r'["\']', "", answer)
    answer = answer.strip()
    answer = answer.lower()
    print("answer: ", answer)
    defn = review_list[term]

    stats["numberofreviewsdone"] += 1
    print("failedReviews: ", failedReviews)
    answer_correct = False
    defn = defn.strip()
    print(defn.lower())
    if answer == defn.lower():
        answer_correct = True
    for item in items_list[term].alt_defns:
        if answer == item.lower():
            answer_correct = True

    if answer_correct:
        print("answer was correct!!!!")
        del review_list[term]  # deleting it from the review list if correct
        print("answer was correct")
        print("review list after deletion: ", review_list)

        items_list[term] = calculateNextReviewTime(
            items_list[term],
            False if term in failedReviews else True,
            (failedReviews[term][1] if term in failedReviews else 0),
        )

        if len(review_list) == 0:
            failedReviews = {}
        print("new item: ", items_list[term].getdt())
        stats["numberright"] += 1
        saveItems()
        saveStats()
        saveReviewList()
        return jsonify(correct=True, defn="")
    else:
        print("wrong answer")
        if term not in failedReviews:
            failedReviews[term] = [True, 0]
        failedReviews[term][1] = (
            failedReviews[term][1] + 1
        )  # number of times gotten wrong + 1
        saveItems()
        stats["numberwrong"] += 1
        saveStats()
        return jsonify(correct=False, defn=defn)


@app.route("/getnextterm", methods=["GET"])
def getNextTerm():
    loadReviewList()
    print("review list monkey: ", review_list)
    if len(review_list) != 0:
        choice = random.choice(list(review_list.items()))

        term = choice[0]
        defn = choice[1]
    else:
        term = "all done"
        defn = "all done"
    print(term)
    return jsonify(term=term, defn=defn)


# statistics section
def loadStats():
    global stats
    try:
        with open(f"./profiles/{current_profile}/stats", "rb") as file:
            stats = pickle.load(file)
    except FileNotFoundError:
        stats = dict(
            numberofterms=0,
            numberofreviewsdone=0,
            numberright=0,
            numberwrong=0,
            lvl1=0,
            lvl2=0,
            lvl3=0,
            lvl4=0,
            lvl5=0,
            lvl6=0,
            lvl7=0,
            lvl8=0,
        )

        with open(f"./profiles/{current_profile}/stats", "wb") as file:
            pickle.dump(stats, file)
        saveStats()


def saveStats():
    global stats
    try:
        with open(f"./profiles/{current_profile}/stats", "wb") as file:
            pickle.dump(stats, file)
    except FileNotFoundError:
        stats = dict(
            numberofterms=0,
            numberofreviewsdone=0,
            numberright=0,
            numberwrong=0,
            lvl1=0,
            lvl2=0,
            lvl3=0,
            lvl4=0,
            lvl5=0,
            lvl6=0,
            lvl7=0,
            lvl8=0,
        )

        with open(f"./profiles/{current_profile}/stats", "wb") as file:
            pickle.dump(stats, file)
        saveStats()
    file.close()


@app.route
@app.route("/getstats", methods=["GET"])
def getStats():
    global stats
    loadStats()
    print(stats.keys())
    numterms = stats["numberofterms"]
    numreviews = stats["numberright"] + stats["numberwrong"]
    numright = stats["numberright"]
    numwrong = stats["numberwrong"]
    lvl1 = stats["lvl1"]
    lvl2 = stats["lvl2"]
    lvl3 = stats["lvl3"]
    lvl4 = stats["lvl4"]
    lvl5 = stats["lvl5"]
    lvl6 = stats["lvl6"]
    lvl7 = stats["lvl7"]
    lvl8 = stats["lvl8"]
    return jsonify(
        numterms=numterms,
        numreviews=numreviews,
        numright=numright,
        numwrong=numwrong,
        lvl1=lvl1,
        lvl2=lvl2,
        lvl3=lvl3,
        lvl4=lvl4,
        lvl5=lvl5,
        lvl6=lvl6,
        lvl7=lvl7,
        lvl8=lvl8,
    )


# add show terms path
if __name__ == "__main__":
    app.run(debug=True)
