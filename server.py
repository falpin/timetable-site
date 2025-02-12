from flask import Flask, render_template

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/groups/<complex>', methods=['GET'])
def groups(complex):
    return render_template('groups.html')

@app.route('/schedule/<group>', methods=['GET'])
def schedule(group):
    return render_template('schedule.html')


app.run(debug=True, port=5000)