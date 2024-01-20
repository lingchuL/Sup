import os
import json
import requests

from copilot.llm_handle import ChatGPT

from settings.copilot_setting import CopilotSetting

from log_handle import SupLogger


class FuncHandler(object):
	def __init__(self, in_setting=CopilotSetting()):
		current_dir = os.path.dirname(os.path.abspath(__file__))
		with open(os.path.join(current_dir, "func_desc.json"), "r", encoding='utf-8') as f:
			self.func_desc_dict = json.load(f)
		with open(os.path.join(current_dir, "func_params_desc.json"), "r", encoding='utf-8') as f:
			self.func_param_desc_dict = json.load(f)
		with open(os.path.join(current_dir, "func_url.json"), "r", encoding='utf-8') as f:
			self.func_url_dict = json.load(f)

		self.setting = in_setting
		self.llm = ChatGPT()

	def get_func_desc_str(self):
		result_str = ""
		if self.func_desc_dict:
			for func_name, desc in self.func_desc_dict.items():
				result_str += f"\"{func_name}\": \"{desc}\"\n"

		return result_str

	def get_func_params_desc(self, func_name):
		result_str = ""
		if self.func_param_desc_dict[func_name]:
			for param_name, param_prop in self.func_param_desc_dict[func_name].items():
				type_name = param_prop["type"]
				desc = param_prop["desc"]
				result_str += f"\"{param_name}\": {type_name}, \"{desc}\"\n"

		return result_str

	def get_func_url(self, func_name):
		return f"http://127.0.0.1:8133/{self.func_url_dict[func_name]}"

	def get_func_name(self, in_message) -> str:
		start_prompt = str.format(self.setting.func_prompt_template,
		                          func_desc_str=self.get_func_desc_str())
		start_prompt += "\n" + self.setting.func_example

		response = self.llm.simple_chat(start_prompt, in_message)
		return json.loads(response)["function_name"]

	def get_func_param_dict(self, func_name, in_message) -> dict:
		get_func_params_prompt = str.format(self.setting.get_func_params_template,
		                                    func_params_desc_str=self.get_func_params_desc(func_name))
		get_func_params_prompt += "\n" + self.setting.func_params_example

		response = self.llm.simple_chat(get_func_params_prompt, in_message)
		try:
			result_dict = json.loads(response)
		except json.decoder.JSONDecodeError:
			SupLogger.error(f"获得的参数无法转换为字典: {response}")
			result_dict = {"text": response}
		return result_dict if result_dict else {}

	def get_func_and_params_dict(self, message: str):
		func_name = self.get_func_name(message)
		SupLogger.info(f"func_name: {func_name}")
		params_dict = self.get_func_param_dict(func_name, message)

		func_params_dict = {"func": func_name, "params": params_dict}
		return func_params_dict

	def call_func(self, func_params_dict):
		print(f"call_func {func_params_dict}")
		func = func_params_dict["func"]
		params = func_params_dict["params"]
		if func == "" or params == {}:
			return

		func_url = self.get_func_url(func)

		param_str = ""
		for param_name, param_value in params.items():
			param_str += f"{param_name}={param_value}&"
		param_str = param_str[:-1]

		url = f"{func_url}{param_str}"
		print(f"call_func {url}")

		response = requests.get(url)
		return response.text

	def verify_params(self, func_params_dict):
		func_name = func_params_dict["func"]
		func_params = func_params_dict["params"]
		if func_name not in self.func_param_desc_dict:
			return
		for param_name, param_value in func_params.items():
			if param_name not in self.func_param_desc_dict[func_name]:
				SupLogger.warning(f"Maybe invalid parameter: {param_name}")
				continue
			verify_system_prompt = self.setting.verify_param_system

			param_desc = self.func_param_desc_dict[func_name][param_name]["desc"]
			param_type = self.func_param_desc_dict[func_name][param_name]["type"]
			param_value = func_params[param_name]
			msg = f"The parameter description: {param_desc}. The parameter require format: {param_type}. The parameter is: {param_value}"
			verify_result = self.llm.simple_chat(verify_system_prompt, msg)
			# print(f"param_name: {param_name}, verify_result: {verify_result}")
			func_params_dict[param_name] = verify_result
