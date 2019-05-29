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

# # The database URI
# app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/pursuitmonkey.sqlite"

# db = SQLAlchemy(app)


# # Create our database model
# class PursuitMonkey(db.Model):
#     __tablename__ = 'emoji'

#     id = db.Column(   # Login to Google. 
    # Only need to run this once,
    #  the rest of requests will use the same session.
pytrend = TrendReq()

#################################################
# Flask Routes
#################################################

# Create database tables
# @app.before_first_request
# def setup():
     # Recreate database each time for demo
    # db.drop_all()
    # db.create_all()

@app.route("/")
def home():
    """Render Home Page."""
    return render_template("index.html")


@app.route("/interest_over_time/<inputValue>")
def interest_over_time_data(inputValue):
    """Return interest_over_time data for the keywords"""

    print(f"The input is:{inputValue}")

    # Create payload and capture API tokens. 
    # Only needed for interest_over_time(), 
    # interest_by_region() & related_queries()

    keywords = inputValue

    keywords = keywords.split(sep=',')

    pytrend.build_payload(kw_list=keywords)

    # # Interest Over Time
    interest_over_time_df = pytrend.interest_over_time()

    interest_over_time_df.reset_index(inplace=True)

    print(interest_over_time_df.head())

    interest_over_time_df = interest_over_time_df.to_dict()

    return jsonify(interest_over_time_df)


if __name__ == "__main__":
    app.run(debug=True)



# # Interest by Region
# interest_by_region_df = pytrend.interest_by_region()
# print(interest_by_region_df.head())

# # Related Queries, returns a dictionary of dataframes
# related_queries_dict = pytrend.related_queries()
# print(related_queries_dict)

# # Get Google Hot Trends data
# trending_searches_df = pytrend.trending_searches()
# print(trending_searches_df.head())

# # Get Google Top Charts
# top_charts_df = pytrend.top_charts(cid='actors', date=201611)
# print(top_charts_df.head())

# # Get Google Keyword Suggestions
# suggestions_dict = pytrend.suggestions(keyword='pizza')
# print(suggestions_dict)