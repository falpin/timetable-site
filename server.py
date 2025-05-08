from flask import Flask, render_template
from flask_cors import CORS
import importlib
import sys
import api

VERSION = "1.0.1"
print(f"Версия: {VERSION}")

app = Flask(__name__, static_url_path='/static', static_folder='static')
CORS(app)
Blueprint = api.Blueprint
app.register_blueprint(Blueprint)
    
    
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/groups/<complex>', methods=['GET'])
def groups(complex):
    return render_template('groups.html')

@app.route('/schedule/<group>', methods=['GET'])
def schedule(group):
    return render_template('schedule.html')


if __name__ == '__main__':
    app.run()