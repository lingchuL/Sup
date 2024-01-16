import json

from urllib.parse import unquote

from abc import abstractmethod

from subprocess import Popen, PIPE

from flask import Response, Request

from settings.block_cfg_setting import BlockCfgSettings
from log_handle import SupLogger


class RequestReceiver(object):
	def __init__(self, in_request_args: Request.args):
		self.request_args = in_request_args
		self.arg_name_list = []
		self.arg_dict = {}

		self.settings = BlockCfgSettings()

		self.init_arg_name_list()
		self.init_arg_dict()

	@abstractmethod
	def init_arg_name_list(self):
		"""
		初始化Get请求的参数名列表self.arg_name_list
		随后会根据请求自动填入self.arg_dict
		:return:
		"""
		pass

	def init_arg_dict(self):
		for arg_name in self.arg_name_list:
			if arg_name in self.request_args:
				self.arg_dict[arg_name] = self.request_args[arg_name]
			else:
				self.arg_dict[arg_name] = ""

	@abstractmethod
	def handle_action(self) -> Response:
		"""
		处理请求 通过self.arg_dict字典获取需要的请求参数
		:return:
		"""
		pass

	@staticmethod
	def form_result_dict(result, status):
		SupLogger.info(f"处理返回结果: result={result}, status_code={status}")
		return {"result": result, "status_code": status}

	@staticmethod
	def form_response(result_dict):
		resp = Response(json.dumps(result_dict))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	@staticmethod
	def unquote_arg(in_encoded_arg_value):
		return unquote(in_encoded_arg_value, encoding='utf-8')

	@staticmethod
	def call_convert_cfg_bat(in_bat_path):
		# 输入回车跳过 pause
		p = Popen(rf"{in_bat_path}", shell=True, stdin=PIPE)
		p.stdin.write(b"\r\n")
		p.stdin.close()
		p.wait()
		ret_code = p.returncode
		print(ret_code)

		return ret_code

