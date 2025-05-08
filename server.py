from flask import Flask, render_template
from flask_cors import CORS
import importlib
import sys
LIBRARY_NAME = "timetable-api"

VERSION = "1.0.1"
print(f"Версия: {VERSION}")

app = Flask(__name__)
CORS(app)

try:
    timetable_api = importlib.import_module(LIBRARY_NAME.replace("-", "_"))  # Заменяем тире на подчёркивание
    print(f"Библиотека '{LIBRARY_NAME}' успешно импортирована!")
    Blueprint = api.Blueprint
    app.register_blueprint(Blueprint)
    
except ImportError:
    print(f"Ошибка: библиотека '{LIBRARY_NAME}' не найдена!")


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