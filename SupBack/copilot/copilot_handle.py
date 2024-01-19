import json
import requests

from copilot.llm_handle import ChatGPT
from copilot.speak_handle import Speaker

from copilot.func_handle import FuncHandler
from copilot.decision_handle import DecisionHandler

from settings.copilot_setting import CopilotSetting


class Copilot(object):
	def __init__(self, in_setting=CopilotSetting()):
		self.setting = in_setting

		self.llm = ChatGPT(in_setting)

		self.func_handler = FuncHandler()

	def chat(self, message: str):
		func_params_dict = self.func_handler.get_func_and_params_dict(message)
		response_str = self.func_handler.call_func(func_params_dict)

		print(f"Copilot response_str: {response_str}")

		return json.loads(response_str)["result"]


if __name__ == "__main__":
	copilot = Copilot()
	# copilot.chat("乐音C5对应的频率是多少？")
	copilot.chat("频率880Hz附近的乐音是什么？")
	# copilot.chat("What is the capital of France?")
	# copilot.chat("下次再见会是什么时候？")

