# -*- coding: utf-8 -*-

import json

from urllib.parse import unquote

from flask import Flask, request, Response
from flask_cors import CORS

from dir_file_handle import DirHandler
from freq_note_handle import FreqNoteTrans

app = Flask(__name__)
CORS(app)

dir_file_handler = DirHandler()
freq_note_trans = FreqNoteTrans()


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


@app.route('/file', methods=["GET"])
def get_file_size_list():
	if request.method == 'GET':
		pass

	global dir_file_handler

	path_param_encoded = request.args.get("path")
	path_param = unquote(path_param_encoded)
	print(f"get_file_size_list 得到路径 path_param: {path_param}")
	if path_param is None:
		resp = Response(json.dumps({"answer": "missing_path", "status": "-1"}))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	action_parm_encoded = request.args.get("action")
	action_param = unquote(action_parm_encoded)
	print(f"get_file_size_list 得到动作 action_param: {action_param}")
	if action_param is None:
		resp = Response(json.dumps({"answer": "missing_action", "status": "-1"}))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	if action_param == "open_file":
		dir_file_handler.open_explorer_and_select(path_param)
		resp = Response(json.dumps({"answer": "haha", "status": "0"}))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	if action_param == "get_file_size_list":
		is_recursively_param = request.args.get("recursively")
		if is_recursively_param is None:
			is_recursively_param = True
		is_recursively = (is_recursively_param in ["true", "True", "1"])

		resp_dict = dir_file_handler.list_file_in_size_order(path_param, is_recursively)
		resp = Response(json.dumps(resp_dict))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	if action_param == "get_search_file_size_list":
		search_param_encoded = request.args.get("search")
		search_param = unquote(search_param_encoded)
		print(f"get_file_size_list 得到search search_param: {search_param}")
		if search_param is None:
			resp = Response(json.dumps({"answer": "missing_search_param", "status": "-1"}))
			resp.headers['Access-Control-Allow-Origin'] = '*'
			return resp

		is_recursively_param = request.args.get("recursively")
		if is_recursively_param is None:
			is_recursively_param = True
		is_recursively = (is_recursively_param in ["true", "True", "1"])

		resp_dict = dir_file_handler.list_file_in_size_order(path_param, search_param, is_recursively)
		resp = Response(json.dumps(resp_dict))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	resp = Response(json.dumps({"answer": "none", "status": "-1"}))
	resp.headers['Access-Control-Allow-Origin'] = '*'
	return resp


@app.route('/note', methods=["GET"])
def trans_note_freq():
	global freq_note_trans

	note_param_encoded = request.args.get("note")
	note_param = unquote(note_param_encoded)
	print(f"trans_note_freq 得到音高 note_param: {note_param}")

	freq_parm_encoded = request.args.get("freq")
	freq_parm = unquote(freq_parm_encoded)
	print(f"trans_note_freq 得到频率 freq_param: {freq_parm}")

	if note_param in ["", None] and freq_parm in ["", None]:
		resp = Response(json.dumps({"answer": "missing_path", "status": "-1"}))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	if freq_parm in ["", None]:
		freq = freq_note_trans.get_note_freq(note_param)

		resp = Response(json.dumps({"note": note_param, "freq": str(freq)}))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	if note_param in ["", None]:
		note = freq_note_trans.get_near_note(float(freq_parm))

		resp = Response(json.dumps({"note": note, "freq": freq_parm}))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	resp = Response(json.dumps({"answer": "none", "status": "-1"}))
	resp.headers['Access-Control-Allow-Origin'] = '*'
	return resp
