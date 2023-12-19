# -*- coding: utf-8 -*-

import json

from urllib.parse import unquote

from flask import Flask, request, Response
from flask_cors import CORS

from dir_file_handle import DirHandler

app = Flask(__name__)
CORS(app)


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

	path_param_encoded = request.args.get("path")
	path_param = unquote(path_param_encoded)
	print(f"get_file_size_list 得到路径path_param: {path_param}")
	if path_param is None:
		resp = Response(json.dumps({"answer": "missing_path", "status": "-1"}))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	action_parm_encoded = request.args.get("action")
	action_parm = unquote(action_parm_encoded)
	print(f"get_file_size_list 得到动作action_param: {action_parm}")
	if action_parm is None:
		resp = Response(json.dumps({"answer": "missing_action", "status": "-1"}))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	if action_parm == "open_file":
		dir_handler = DirHandler()
		dir_handler.open_explorer_and_select(path_param)
		resp = Response(json.dumps({"answer": "haha", "status": "0"}))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	if action_parm == "get_file_size_list":
		is_recursively_param = request.args.get("recursively")
		if is_recursively_param is None:
			is_recursively_param = True
		is_recursively = (is_recursively_param in ["true", "True", "1"])

		dir_handler = DirHandler()
		resp_dict = dir_handler.list_file_in_size_order(path_param, is_recursively)
		resp = Response(json.dumps(resp_dict))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	resp = Response(json.dumps({"answer": "none", "status": "-1"}))
	resp.headers['Access-Control-Allow-Origin'] = '*'
	return resp
