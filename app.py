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
    render_template,
    jsonify)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

# Login to Google. 
# Only need to run this once,
# The rest of requests will use the same session.

pytrend = TrendReq()

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
initRegion = Base.classes.region
initTime = Base.classes.time

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
    # region_dict = region_df.to_dict()

    # Results
    return jsonify(time_data)


@app.route("/live_trends/<inputValue>")
def interest_over_time_data(inputValue):
    """Return live_trends data for the keywords"""

    keywords = inputValue

    keywords = keywords.split(sep=',')

    pytrend.build_payload(kw_list=keywords)

    # Interest over time
    interest_over_time_df = pytrend.interest_over_time()

    # Interest by region
    interest_by_region_df = pytrend.interest_by_region()

    # Fix dataframes
    interest_by_region_df.reset_index(inplace=True)
    interest_over_time_df.reset_index(inplace=True)

    # DataFrame to Dictionary
    interest_by_region_df = interest_by_region_df.to_dict()
    interest_over_time_df = interest_over_time_df.to_dict()

    # Results
    return jsonify({
        "interest_over_time": interest_over_time_df,
        "interest_by_region": interest_by_region_df
    })

if __name__ == "__main__":
    app.run(debug=True)
