import os
import json


class FuncHandler(object):
	def __init__(self):
		current_dir = os.path.dirname(os.path.abspath(__file__))
		with open(os.path.join(current_dir, "func_desc.json"), "r", encoding='utf-8') as f:
			self.func_desc_dict = json.load(f)
		with open(os.path.join(current_dir, "func_params_desc.json"), "r", encoding='utf-8') as f:
			self.func_param_desc_dict = json.load(f)
		with open(os.path.join(current_dir, "func_url.json"), "r", encoding='utf-8') as f:
			self.func_url_dict = json.load(f)

	def get_func_desc_str(self):
		result_str = ""
		if self.func_desc_dict:
			for func_name, desc in self.func_desc_dict.items():
				result_str += f"\"{func_name}\": \"{desc}\"\n"

		return result_str

	def get_func_params_desc(self, func_name):
		result_str = ""
		if self.func_param_desc_dict[func_name]:
			for param_name, desc in self.func_param_desc_dict[func_name].items():
				result_str += f"\"{param_name}\": \"{desc}\"\n"

		return result_str

	def get_func_url(self, func_name):
		return f"http://127.0.0.1:8133/{self.func_url_dict[func_name]}?"
