import json
from pprint import pprint

from audio.text_to_speech_handle import OpenAITTS

from copilot.llm_handle import ChatGPT

from copilot.func_handle import FuncHandler
from copilot.chat_handle import ChatHandler

from settings.copilot_setting import CopilotSetting

from log_handle import SupLogger


class Copilot(object):
	def __init__(self, in_setting=CopilotSetting()):
		self.setting = in_setting

		self.llm = ChatGPT(in_setting)
		self.speaker = OpenAITTS(in_setting)

		self.func_handler = FuncHandler()
		self.chat_handler = ChatHandler()
		self.num = 0

	def consider_chat(self, chat_history: str):
		"""
		推测 message含义 得到相应可用函数返回结果美化后的回答
		:param chat_history: 本次对话记录
		:return: 函数, 工具返回结果美化后回答
		"""
		func_params_dict = self.func_handler.get_func_and_params_dict(chat_history)
		SupLogger.info(f"Copilot func_params_dict: {func_params_dict}")
		func_name = func_params_dict["func"]

		if func_name in ["talk", "end"]:
			func_result = self.func_handler.call_func(func_params_dict)
			SupLogger.info(f"Copilot func_result: {func_result}")
			return json.loads(func_result)["result"]

		# 验证尝试转换参数格式
		self.func_handler.verify_params(func_params_dict)
		SupLogger.info(f"Copilot verified func_params_dict: {func_params_dict}")

		func_result = self.func_handler.call_func(func_params_dict)
		SupLogger.info(f"Copilot func_result: {func_result}")

		func_result_str = json.loads(func_result)["result"]

		# 美化并返回结果
		return self.polish(func_result_str)

	def chat(self, message: str):
		self.chat_handler.wake_up()
		self.chat_handler.add_chat("user", message)
		# chat_history_str = self.chat_handler.get_history_str()

		result = self.consider_chat(message)

		self.chat_handler.add_chat("assistant", result)

		print(f"Copilot chat result: {result}")
		return result

	def talk(self):
		"""
		直接将目前以用户语句结尾的对话记录，询问语言模型
		不应该从外部调用
		:return: 语言模型的回答
		"""
		msg_list = self.chat_handler.get_full_msg_list(self.setting.chat_system_prompt)
		pprint(msg_list, sort_dicts=False)
		return self.llm.talk(msg_list)

	def end(self):
		msg_list = self.chat_handler.get_full_msg_list(self.setting.end_system_prompt)
		pprint(msg_list, sort_dicts=False)
		self.chat_handler.end_chat()
		return self.llm.talk(msg_list)

	def polish(self, func_result):
		polish_prompt = self.setting.polish_system_prompt.format(conversation=self.chat_handler.get_history_str())
		msg_list = self.chat_handler.get_full_msg_list(polish_prompt)
		msg_list.append({"role": "user", "content": f"the function result: {func_result}. "
		                                            f"Complete the conversation as if you are talking like human."
		                                            f"Use {self.setting.main_language}."})
		pprint(msg_list, sort_dicts=False)
		return self.llm.talk(msg_list)


# 单例
sup_copilot = Copilot()

if __name__ == "__main__":
	# copilot.chat("乐音C5对应的频率是多少？")
	sup_copilot.chat("频率880Hz附近的乐音是什么？")
	# copilot.chat("What is the capital of France?")
	# copilot.chat("下次再见会是什么时候？")
