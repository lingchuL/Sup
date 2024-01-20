import json

from urllib.parse import unquote

from abc import abstractmethod

from subprocess import Popen, PIPE

from flask import Response, Request

from settings.block_cfg_setting import BlockCfgSettings
from log_handle import SupLogger


class RequestReceiver(object):
	def __init__(self, in_request: Request):
		self.request = in_request
		self.request_args = in_request.args
		self.arg_name_list = []
		self.arg_dict = {}
		self.action_func_dict = {}

		self.settings = BlockCfgSettings()

		self.init_arg_name_list()
		self.init_arg_dict()
		self.init_action_func_dict()

		SupLogger.info(f"RequestReceiver 获得请求参数：{self.arg_dict}")

	@abstractmethod
	def init_arg_name_list(self):
		"""
		初始化Get请求的参数名列表self.arg_name_list
		随后会根据请求自动填入self.arg_dict
		:return:
		"""
		pass

	@abstractmethod
	def init_action_func_dict(self):
		"""
		初始化Get请求的参数名列表self.action_func_dict
		将根据action值执行不同函数
		:return:
		"""
		pass

	@staticmethod
	def load_arg_from_dict(arg_name_list, arg_value_dict):
		arg_dict = {}
		for arg_name in arg_name_list:
			if arg_name in arg_value_dict:
				arg_dict[arg_name] = arg_value_dict[arg_name]
			else:
				arg_dict[arg_name] = ""
		return arg_dict

	def init_arg_dict(self):
		self.arg_dict = self.load_arg_from_dict(self.arg_name_list, self.request_args)

	def handle_action(self) -> Response:
		"""
		处理请求 通过self.arg_dict字典获取需要的请求参数
		:return:
		"""
		if "action" in self.arg_dict:
			action = self.arg_dict["action"]
		else:
			SupLogger.info("handle_action action参数缺失")
			return self.form_response(self.form_result_dict("action missing", "-1"))

		if action not in self.action_func_dict:
			SupLogger.info(f"handle_action action未定义: {action}")
			return self.form_response(self.form_result_dict(f"action not defined {action}", "-1"))

		action_func = self.action_func_dict[action]
		result_dict = action_func()

		return self.form_response(result_dict)

	@staticmethod
	def form_result_dict(result, status="0"):
		SupLogger.info(f"RequestReceiver 处理返回结果: result={result}, status_code={status}")
		return {"result": result, "status_code": status}

	@staticmethod
	def form_response(result_dict):
		resp = Response(json.dumps(result_dict))
		resp.headers['Access-Control-Allow-Origin'] = '*'
		return resp

	@staticmethod
	def unquote_arg(in_encoded_arg_value):
		return unquote(in_encoded_arg_value, encoding='utf-8')
