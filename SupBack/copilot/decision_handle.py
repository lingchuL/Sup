import json

from copilot.llm_handle import ChatGPT
from copilot.func_handle import FuncHandler

from settings.copilot_setting import CopilotSetting


class DecisionHandler(object):
	def __init__(self, in_setting=CopilotSetting()):
		self.setting = in_setting
		self.llm = ChatGPT()
		self.func_handler = FuncHandler()

	def do_func(self, func_params_dict):
		print(func_params_dict)

		func_url = self.func_handler.get_func_url(func_name)

		param_str = ""
		for param_name, param_value in in_param_dict.items():
			param_str += f"{param_name}={param_value}&"
		param_str = param_str[:-1]

		url = f"{func_url}{param_str}"

		print(f"Copilot 跳转执行: {url}")

		response = requests.get(url)
		return response.text