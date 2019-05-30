from pytrends.request import TrendReq
import pandas as pd
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
# Flask Routes
#################################################

@app.route("/")
def home():
    """Render Home Page."""
    return render_template("index.html")


@app.route("/interest_over_time/<inputValue>")
def interest_over_time_data(inputValue):
    """Return interest_over_time data for the keywords"""

    print(f"The input is:{inputValue}")

    keywords = inputValue

    keywords = keywords.split(sep=',')

    pytrend.build_payload(kw_list=keywords)

    # Interest over time
    interest_over_time_df = pytrend.interest_over_time()

    # Interest by region
    interest_by_region_df = pytrend.interest_by_region()

    interest_by_region_df.reset_index(inplace=True)

    interest_over_time_df.reset_index(inplace=True)

    print(interest_over_time_df.head())

    interest_by_region_df = interest_by_region_df.to_dict()

    interest_over_time_df = interest_over_time_df.to_dict()

    return jsonify({
        "interest_over_time": interest_over_time_df,
        "interest_by_region": interest_by_region_df
    })


if __name__ == "__main__":
    app.run(debug=True)
