import os

from pytrends.request import TrendReq

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask_sqlalchemy import SQLAlchemy
from flask import (
    Flask,
    session,
    render_template,
    jsonify)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['SESSION_TYPE'] = 'memcached'
app.config['SECRET_KEY'] = 'super secret key'

# Login to Google. 
# Only need to run this once,
# The rest of requests will use the same session.

pytrend = TrendReq()
countries_df = pd.read_csv("static/csv/countries.csv")


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///static/db/top_trends.db"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
initTime = Base.classes.time
initRegion = Base.classes.region

#################################################
# Flask Routes
#################################################

@app.route("/")
def home():
    """Render Home Page."""
    return render_template("index.html")


@app.route("/init")
def init():
    # Use Pandas to perform the sql query
    time_stmt = db.session.query(initTime).statement
    time_df = pd.read_sql_query(time_stmt, db.session.bind)
    time_data = {
        "date": time_df.date.values.tolist(),
        "taco": time_df.tacos.values.tolist(),
        "sandwich": time_df.sandwiches.values.tolist(),
        "kebab": time_df.kebabs.values.tolist()
    }

    # region_stmt = db.session.query(initRegion).statement
    # region_df = pd.read_sql_query(region_stmt, db.session.bind)
    session['keywords'] = ['taco','sandwich','kebab']

    # Results
    return jsonify(time_data)


@app.route("/live_trends/<inputValue>")
def interest_over_time_data(inputValue):
    """Return live_trends data for the keywords"""

    # Pytrends API pull
    keywords = inputValue
    keywords = keywords.split(sep=',')
    pytrend.build_payload(kw_list=keywords)
    time_df = pytrend.interest_over_time()
    time_df.reset_index(inplace=True)
    time_data = {"date": time_df.date.tolist()}
    for phrase in keywords:
        time_data[phrase] = time_df[phrase].values.tolist()

    session['keywords'] = keywords

    return jsonify(time_data)

@app.route("/region")
def interest_by_region_data():
    keywords =  session.get('keywords', None)
    pytrend.build_payload(kw_list=keywords)
        # Interest By region
    region_df = pytrend.interest_by_region()
    region_df['total'] = region_df.sum(axis=1)
    region_filtered_df = region_df[region_df['total']>0]
    region_loc_df = pd.merge(region_filtered_df, countries_df, how="inner", left_on="geoName", right_on="name")
    region_loc_df = region_loc_df.drop(columns=['name','total'])
    region_loc_df.reset_index(inplace=True)
    region_loc_data = []
    for index, row in region_loc_df.iterrows():
        region_loc_data.append(
            row.to_dict()
        )
    return jsonify(region_loc_data)

@app.route("/viewMap")
def view_map():
    return render_template("viewMap.html")


if __name__ == "__main__":
    app.run(debug=True)

