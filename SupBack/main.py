import json

from urllib.parse import unquote

from flask import Flask, request, Response
from flask_cors import CORS

from dir_file.dir_file_receiver import DirFileReceiver
from dir_file.dir_file_handle import DirFileHandler

from audio.freq_note_handle import FreqNoteHandler
from audio.audio_receiver import AudioReceiver

from block_cfg.interact_audio_receiver import InteractAudioReceiver
from block_cfg.ability_audio_receiver import AbilityAudioCfgReceiver

from copilot.copilot_handle import Copilot

app = Flask(__name__)
CORS(app)

dir_file_handler = DirFileHandler()
freq_note_trans = FreqNoteHandler()


@app.route("/")
def hello_world():
	return "<p>Hello, World!</p>"


@app.route('/login', methods=['GET'])
def login():
	if request.method == 'GET':
		pass
	id_param = request.args.get('id')
	print(id_param)
	if not id_param.isdigit():
		return
	res_id = int(id_param) - 7
	resp = Response(json.dumps({"answer": f"fuck them all!!!{res_id}"}))
	resp.headers['Access-Control-Allow-Origin'] = '*'

	return resp


@app.route('/dir_file', methods=["GET"])
def dir_file():
	print(request.args)
	receiver = DirFileReceiver(request.args)
	return receiver.handle_action()


@app.route('/audio', methods=["GET"])
def audio():
	receiver = AudioReceiver(request.args)
	return receiver.handle_action()


@app.route('/cfg', methods=["GET"])
def interact_audio_handle():
	print(request.args)
	type_name = request.args.get("type")
	receiver = None
	if type_name == "rp_interact":
		receiver = InteractAudioReceiver(request.args)
	elif type_name == "ability":
		receiver = AbilityAudioCfgReceiver(request.args)
	return receiver.handle_action()


@app.route('/copilot', methods=["GET"])
def copilot_handle():
	print(request.args)
	message_encoded = request.args.get("message")
	message = unquote(message_encoded)

	copilot = Copilot()
	result = copilot.chat(message)

	resp = Response(json.dumps({"result": result, "status": "0"}))
	resp.headers['Access-Control-Allow-Origin'] = '*'
	return resp
