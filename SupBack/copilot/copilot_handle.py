import json
import requests

from copilot.llm_handle import ChatGPT
from copilot.speak_handle import Speaker

from copilot.func_handle import FuncHandler

from settings.copilot_setting import CopilotSetting


class Copilot(object):
	def __init__(self, in_setting=CopilotSetting()):
		self.setting = in_setting

		self.llm = ChatGPT(in_setting)
		self.llm_func_param = ChatGPT(in_setting)

		self.speaker = Speaker()

		self.func_handler = FuncHandler()

		self.chat_dict_history = []
		self.chat_history = ""

		self.msg_list_llm = []

	@staticmethod
	def add_into_history(in_role: str, in_message: str, out_chat_dict_history: [dict]):
		out_chat_dict_history.append({"role": in_role, "content": in_message})
		chat_history = ""
		for chat in out_chat_dict_history:
			role = chat["role"]
			content = chat["content"]
			chat_history += f"{role}: {content}\n"
		return chat_history

	def chat(self, in_new_message: str):
		func_name = self.get_func(in_new_message)
		func_params_dict_str = self.get_func_param(func_name, in_new_message)
		response_str = self.call_func_url(func_name, json.loads(func_params_dict_str))
		return json.loads(response_str)["note"]

	def get_func(self, in_message):
		chat_dict_history = []
		msg_list_llm = []

		start_prompt = str.format(self.setting.start_prompt_template, func_desc_str=self.func_handler.get_func_desc_str())
		start_prompt += "\n" + self.setting.start_example
		self.add_into_history("system", start_prompt, chat_dict_history)
		msg_list_llm.append({"role": "system", "content": start_prompt})

		chat_history = self.add_into_history("user", in_message, chat_dict_history)
		msg_list_llm.append({"role": "user", "content": chat_history})

		response = self.llm.chat(msg_list_llm)
		print(response)
		return json.loads(response)["function_name"]

	def get_func_param(self, func_name, in_message):
		chat_dict_history = []
		msg_list_llm = []

		get_func_params_prompt = str.format(self.setting.get_func_params_template,
		                                    func_params_desc_str=self.func_handler.get_func_params_desc(func_name))
		get_func_params_prompt += "\n" + self.setting.func_params_example

		self.add_into_history("system", get_func_params_prompt, chat_dict_history)
		msg_list_llm.append({"role": "system", "content": get_func_params_prompt})

		chat_history = self.add_into_history("user", in_message, chat_dict_history)
		msg_list_llm.append({"role": "user", "content": chat_history})

		response = self.llm.chat(msg_list_llm)
		print(response)
		return response

	def call_func_url(self, func_name, in_param_dict):
		func_url = self.func_handler.get_func_url(func_name)
		param_str = ""
		for param_name, param_value in in_param_dict.items():
			param_str += f"{param_name}={param_value}&"
		param_str = param_str[:-1]

		url = f"{func_url}{param_str}"

		response = requests.get(url)
		print(response.text)
		return response.text


if __name__ == "__main__":
	copilot = Copilot()
	# copilot.chat("乐音C5对应的频率是多少？")
	copilot.chat("频率880Hz附近的乐音是什么？")
	# copilot.chat("What is the capital of France?")
	# copilot.chat("下次再见会是什么时候？")

