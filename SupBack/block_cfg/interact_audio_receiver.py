import json
import os.path

from subprocess import Popen, PIPE, STDOUT
import subprocess

from urllib.parse import unquote

from flask import Flask, request, Response, Request
from flask_cors import CORS

from block_cfg.interact_audio_handle import InteractAudioCfgHandler


class InteractAudioReceiver(object):
	def __init__(self, in_request_args: Request.args):
		self.request_args = in_request_args
		self.arg_name_list = [
			"action",
			"cfgFilePath",
			"column",
			"search",
			"sfx_start",
			"sfx_end",
		]
		self.arg_dict = {}

		self.init()

	def init(self):
		for arg_name in self.arg_name_list:
			if arg_name in self.request_args:
				self.arg_dict[arg_name] = self.request_args[arg_name]
			else:
				self.arg_dict[arg_name] = ""

	def handle_action(self):
		result_dict = {}
		if self.arg_dict["action"] == "search":
			result_dict = self.search()
		elif self.arg_dict["action"] == "write_save_id":
			result_dict = self.write_save_id()
		elif self.arg_dict["action"] == "convert_rp_cfg":
			result_dict = self.convert_rp_cfg()

		resp = Response(json.dumps(result_dict))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	def search(self):
		cfg_file_path_encoded = self.arg_dict["cfgFilePath"]
		cfg_file_path = unquote(cfg_file_path_encoded)

		search_name_encoded = self.arg_dict["search"]
		search_name = unquote(search_name_encoded)

		# print(cfg_file_path)
		handler = InteractAudioCfgHandler()
		handler.load(cfg_file_path)
		handler.init_main_key("id")

		search_result = handler.search_with_audio_cfg(search_name)

		status_code = "0"

		result_dict = {"result": search_result, "status": status_code}
		return result_dict

	def write_save_id(self):
		cfg_file_path_encoded = self.arg_dict["cfgFilePath"]
		cfg_file_path = unquote(cfg_file_path_encoded)

		id_ = self.arg_dict["search"]
		sfx_start = self.arg_dict["sfx_start"]
		sfx_end = self.arg_dict["sfx_end"]

		handler = InteractAudioCfgHandler()
		handler.load(cfg_file_path)
		handler.init_main_key("id")

		should_save = False if sfx_start is None and sfx_end is None else True

		if sfx_start != "":
			handler.set_rp_interact_sound(id_, sfx_start, "sfx_start")
		else:
			handler.remove_rp_interact_sound(id_, "sfx_start")
		if sfx_end != "":
			handler.set_rp_interact_sound(id_, sfx_end, "sfx_end")
		else:
			handler.remove_rp_interact_sound(id_, "sfx_end")

		if should_save:
			handler.write_save_id(id_)

		status_code = "0"

		result_dict = {"result": "Finished", "status": status_code}
		return result_dict

	def convert_rp_cfg(self):
		cfg_file_path_encoded = self.arg_dict["cfgFilePath"]
		cfg_file_path = unquote(cfg_file_path_encoded)

		convert_rp_bat_dir = os.path.dirname(os.path.dirname(cfg_file_path))
		convert_rp_bat_path = os.path.join(convert_rp_bat_dir, "转表_仅RP游戏.bat")

		print(convert_rp_bat_path)

		p = Popen(rf"{convert_rp_bat_path}", shell=True, stdin=PIPE)
		p.stdin.write(b"\r\n")
		p.stdin.close()
		p.wait()
		ret_code = p.returncode
		print(ret_code)
		if ret_code == 0:
			status_code = "0"
		else:
			status_code = "-1"

		result_dict = {"result": "Finished", "status": status_code}
		return result_dict
